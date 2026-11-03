import path from 'path';
import { Parser, Language, type Node } from 'web-tree-sitter';
import type { InjectValue, LessonTestsSpec, StructureFailure } from '@cyberstars/shared/tests';

// Server-side C analysis for the lesson judge. C has no in-container parser
// (python has `ast`, java has javac's Tree API; gcc's shipped python3 parses
// Python, not C), so structure checks AND value injection happen HERE on the
// server via web-tree-sitter (pure JS + WASM, no node-gyp, VPS/Nix safe). The
// container runner (lesson-tests.runner.c.py) then only compiles + runs the
// pre-injected sources. Two syntax gates: tree-sitter catches structural
// breakage (here), gcc catches semantic errors it recovers from (in the runner).

const WASM_PATH = path.join(import.meta.dirname, 'wasm', 'tree-sitter-c.wasm');

let parserPromise: Promise<Parser> | null = null;
async function getParser(): Promise<Parser> {
  if (!parserPromise) {
    parserPromise = (async () => {
      await Parser.init();
      const c = await Language.load(WASM_PATH);
      const parser = new Parser();
      parser.setLanguage(c);
      return parser;
    })();
  }
  return parserPromise;
}

export async function parseC(code: string): Promise<Node> {
  const parser = await getParser();
  const tree = parser.parse(code);
  if (!tree) throw new Error('C parse failed');
  return tree.rootNode;
}

function* walk(node: Node): Generator<Node> {
  yield node;
  for (let i = 0; i < node.childCount; i++) {
    const child = node.child(i);
    if (child) yield* walk(child);
  }
}

// tree-sitter is error-tolerant: it still yields a tree with ERROR/MISSING nodes
// where the source is broken. First such node's line is the reported error.
export function detectSyntaxError(root: Node): string | null {
  if (!root.hasError) return null;
  for (const node of walk(root)) {
    if (node.isMissing) return `line ${node.startPosition.row + 1}: missing ${node.type}`;
    if (node.isError) {
      const snippet = node.text.replace(/\s+/g, ' ').trim().slice(0, 30);
      return `line ${node.startPosition.row + 1}: syntax error${snippet ? ` near "${snippet}"` : ''}`;
    }
  }
  return 'syntax error';
}

function callName(node: Node): string | null {
  if (node.type !== 'call_expression') return null;
  const fn = node.childForFieldName('function');
  return fn && fn.type === 'identifier' ? fn.text : null;
}

// The identifier a declarator declares, through pointers, arrays, function
// declarators, initializers and parentheses: `*p`, `a[3]`, `(*len)(void)`.
function declaredIdentifier(declarator: Node | null): Node | null {
  let node = declarator;
  while (node && node.type !== 'identifier') {
    node =
      node.type === 'parenthesized_declarator'
        ? node.namedChild(0)
        : node.childForFieldName('declarator');
  }
  return node;
}

function declaratorName(declarator: Node | null): string | null {
  return declaredIdentifier(declarator)?.text ?? null;
}

function declaredNames(root: Node): Set<string> {
  const names = new Set<string>();
  for (const node of walk(root)) {
    if (node.type === 'declaration' || node.type === 'parameter_declaration') {
      for (const decl of node.childrenForFieldName('declarator')) {
        if (!decl) continue;
        const inner = decl.type === 'init_declarator' ? decl.childForFieldName('declarator') : decl;
        const name = declaratorName(inner);
        if (name) names.add(name);
      }
    }
  }
  return names;
}

function parseIntLiteral(text: string): number | null {
  const cleaned = text.replace(/[uUlL]+$/, '');
  if (/[.eEpP]/.test(cleaned)) return null;
  const value = /^0[xX]/.test(cleaned) ? parseInt(cleaned, 16) : parseInt(cleaned, 10);
  return Number.isNaN(value) ? null : value;
}

// Python's `comprehension` has no C node, so a rule asking for one matches nothing.
const C_LOOP_NODES: Record<string, string> = {
  for: 'for_statement',
  while: 'while_statement',
  do_while: 'do_statement',
};

// A pointer the student declared: not main's own `char **argv`, which every
// program may write, nor the type in a cast or sizeof, which declares nothing.
function isOwnPointer(node: Node): boolean {
  for (let up = node.parent; up; up = up.parent) {
    if (up.type === 'cast_expression' || up.type === 'sizeof_expression') return false;
    if (up.type === 'parameter_list') {
      const name = up.parent?.childForFieldName('declarator')?.text;
      return up.parent?.type !== 'function_declarator' || name !== 'main';
    }
  }
  return true;
}

// Kinds that hold as soon as one node of that type exists. struct and enum
// need a body: `struct point p;` only uses a type someone else declared.
const C_NODE_KINDS: Record<string, (node: Node) => boolean> = {
  if: (n) => n.type === 'if_statement',
  switch: (n) => n.type === 'switch_statement',
  break: (n) => n.type === 'break_statement',
  continue: (n) => n.type === 'continue_statement',
  typedef: (n) => n.type === 'type_definition',
  sizeof: (n) => n.type === 'sizeof_expression',
  pointer: (n) =>
    (n.type === 'pointer_declarator' || n.type === 'abstract_pointer_declarator') &&
    isOwnPointer(n),
  // *p in an expression (reading or writing through the pointer), not the
  // star of a declaration; p->field too. p[i] is indexing and doesn't count:
  // pointers-arrays asks for *(ptr + i) instead of ptr[i].
  deref: (n) =>
    (n.type === 'pointer_expression' && n.childForFieldName('operator')?.text === '*') ||
    (n.type === 'field_expression' && n.childForFieldName('operator')?.text === '->'),
  struct: (n) => n.type === 'struct_specifier' && n.childForFieldName('body') !== null,
  enum: (n) => n.type === 'enum_specifier' && n.childForFieldName('body') !== null,
};

const LOOP_NODE_TYPES = new Set<string>(Object.values(C_LOOP_NODES));

function hasNestedLoop(root: Node): boolean {
  for (const node of walk(root)) {
    if (!LOOP_NODE_TYPES.has(node.type)) continue;
    const body = node.childForFieldName('body');
    if (body) for (const inner of walk(body)) if (LOOP_NODE_TYPES.has(inner.type)) return true;
  }
  return false;
}

// The operator token of a binary, unary, update or compound-assignment
// expression (`a <<= 2` counts as <<, as Python's augmented assignment does);
// `&x` and `*p` are pointer_expression, so they never count as & or *.
function usesOperator(root: Node, op: string | undefined): boolean {
  for (const node of walk(root)) {
    if (!/^(binary|unary|assignment|update)_expression$/.test(node.type)) continue;
    let text = node.childForFieldName('operator')?.text;
    if (node.type === 'assignment_expression' && text !== '=') text = text?.slice(0, -1);
    if (text === op) return true;
  }
  return false;
}

function ruleHolds(root: Node, rule: StructureFailure['rule']): boolean {
  switch (rule.kind) {
    case 'call':
      for (const node of walk(root)) if (callName(node) === rule.name) return true;
      return false;
    case 'variable':
      return rule.name !== undefined && declaredNames(root).has(rule.name);
    case 'function':
      for (const node of walk(root)) {
        if (node.type !== 'function_definition') continue;
        const name = declaratorName(node.childForFieldName('declarator'));
        if (rule.name === undefined ? name !== 'main' : name === rule.name) return true;
      }
      return false;
    case 'recursion':
      for (const node of walk(root)) {
        if (node.type !== 'function_definition') continue;
        const name = declaratorName(node.childForFieldName('declarator'));
        for (const inner of walk(node)) if (name && callName(inner) === name) return true;
      }
      return false;
    case 'loop': {
      const types = rule.type ? [C_LOOP_NODES[rule.type]] : Object.values(C_LOOP_NODES);
      for (const node of walk(root)) if (types.includes(node.type)) return true;
      return false;
    }
    case 'int_literal':
      // A forbidden constant can't hide in a string or a sum of constants
      // either: "58 64", 57 + 1.
      return hasIntLiteral(root, new Set(rule.values ?? []));
    case 'comment': {
      // Whitespace-insensitive so `// printf( "..." );` still matches.
      const needle = (rule.contains ?? '').replace(/\s+/g, '');
      for (const node of walk(root)) {
        if (node.type !== 'comment') continue;
        if (!needle || node.text.replace(/\s+/g, '').includes(needle)) return true;
      }
      return false;
    }
    case 'string_expr':
      // A bare string literal as a statement (`"printf(...)";`): valid C, and
      // the counterfeit students use instead of actually commenting a line out.
      for (const node of walk(root)) {
        if (node.type !== 'expression_statement') continue;
        const expr = node.namedChild(0);
        if (expr && (expr.type === 'string_literal' || expr.type === 'concatenated_string')) {
          return true;
        }
      }
      return false;
    case 'nested_loop':
      return hasNestedLoop(root);
    case 'operator':
      return usesOperator(root, rule.name);
    case 'define':
      for (const node of walk(root)) {
        if (node.type !== 'preproc_def' && node.type !== 'preproc_function_def') continue;
        if (rule.name === undefined || node.childForFieldName('name')?.text === rule.name)
          return true;
      }
      return false;
    default: {
      const matches = C_NODE_KINDS[rule.kind];
      if (matches) {
        for (const node of walk(root)) if (matches(node)) return true;
        return false;
      }
      // Unknown kind: require passes, forbid fires (same convention as py/java).
      return true;
    }
  }
}

// Whether the identifier names a function rather than a variable: in C the
// declarator closest to the name decides, so `int *f(void)` is a function and
// `int (*f)(void)` a pointer to one.
function namesFunction(identifier: Node): boolean {
  let up = identifier.parent;
  while (up?.type === 'parenthesized_declarator') up = up.parent;
  return up?.type === 'function_declarator';
}

const BLOCKS = new Set(['compound_statement', 'for_statement', 'translation_unit']);

function enclosingBlock(node: Node): Node | null {
  let up = node.parent;
  while (up && !BLOCKS.has(up.type)) up = up.parent;
  return up;
}

const SIMPLE_ESCAPES: Record<string, string> = {
  n: '\n',
  t: '\t',
  r: '\r',
  a: '\x07',
  b: '\b',
  f: '\f',
  v: '\v',
  e: '\x1b',
};

// What a string literal holds once its escapes are read ("\x35\x38" is "58"),
// adjacent literals ("5" "8") joined as the compiler joins them.
function stringValue(node: Node): string {
  if (node.type === 'concatenated_string') {
    return node.namedChildren
      .filter((c) => c?.type === 'string_literal')
      .map((c) => stringValue(c as Node))
      .join('');
  }
  const body = node.text.replace(/^[LuU8]*"/, '').replace(/"$/, '');
  return body.replace(
    /\\(x[0-9a-fA-F]+|[0-7]{1,3}|u[0-9a-fA-F]{4}|U[0-9a-fA-F]{8}|[\s\S])/g,
    (_, esc: string) => {
      if (/^[0-7]/.test(esc)) return String.fromCharCode(parseInt(esc, 8));
      if (/^[xuU][0-9a-fA-F]/.test(esc)) {
        return String.fromCodePoint(Math.min(parseInt(esc.slice(1, 9), 16), 0x10ffff));
      }
      return SIMPLE_ESCAPES[esc] ?? esc;
    },
  );
}

// A printf conversion: its width and precision only pad, so "%58d" never
// prints 58.
const FORMAT_SPEC = /%[-+ #0,(']*(?:\d+|\*)?(?:\.(?:\d+|\*))?(?:hh|h|ll|l|L|q|j|z|t)?[a-zA-Z%]/g;

function digitRuns(text: string): number[] {
  // Past 15 digits a run is no answer, and no longer an exact number.
  return (text.replace(FORMAT_SPEC, ' ').match(/\d+/g) ?? [])
    .filter((run) => run.length <= 15)
    .map(Number);
}

function numberValue(text: string): number | null {
  if (!/^0[xX]/.test(text) && /[.eE]/.test(text)) {
    const value = parseFloat(text.replace(/[fFlL]+$/, ''));
    return Number.isInteger(value) ? value : null;
  }
  return parseIntLiteral(text);
}

// The value of an expression made only of constants (57 + 1, "5" "8"), or null.
function folded(node: Node): number | string | null {
  switch (node.type) {
    case 'number_literal':
      return numberValue(node.text);
    case 'string_literal':
    case 'concatenated_string':
      return stringValue(node);
    case 'parenthesized_expression':
      return node.namedChild(0) ? folded(node.namedChild(0) as Node) : null;
    case 'unary_expression': {
      const operator = node.childForFieldName('operator')?.type;
      const argument = node.childForFieldName('argument');
      const value = argument ? folded(argument) : null;
      if (typeof value !== 'number' || (operator !== '-' && operator !== '+')) return null;
      return operator === '-' ? -value : value;
    }
    case 'binary_expression': {
      const operator = node.childForFieldName('operator')?.type;
      const left = node.childForFieldName('left');
      const right = node.childForFieldName('right');
      const a = left ? folded(left) : null;
      const b = right ? folded(right) : null;
      if (typeof a !== 'number' || typeof b !== 'number') return null;
      if (operator === '+') return a + b;
      if (operator === '-') return a - b;
      return operator === '*' ? a * b : null;
    }
    default:
      return null;
  }
}

function hasIntLiteral(root: Node, values: Set<number>): boolean {
  for (const node of walk(root)) {
    // A piece of "5" "8" is read with the whole.
    if (node.type === 'string_literal' && node.parent?.type === 'concatenated_string') continue;
    const value = folded(node);
    if (typeof value === 'number' && values.has(value)) return true;
    if (typeof value === 'string' && digitRuns(value).some((v) => values.has(v))) return true;
  }
  return false;
}

interface Binding {
  block: Node;
  start: number;
}

// Calls that look a function up by a name built at run time, or run another
// program (sort, a second binary): whoever uses one can reach the forbidden
// one too.
const DYNAMIC_LOOKUPS = new Set([
  'dlsym',
  'dlvsym',
  'dlopen',
  'system',
  'popen',
  'execv',
  'execve',
  'execvp',
  'execvpe',
  'execl',
  'execle',
  'execlp',
  'fexecve',
  'posix_spawn',
  'posix_spawnp',
]);

// Built once per program for every call it forbids: where the student's own
// code declares each name, every identifier used, the macro bodies and the
// strings. A variable, a parameter of a function they define or an enum
// constant is seen in its block from where it starts; a function they define
// in the whole file, since a call finds it wherever it stands (main may come
// first, after a prototype). A prototype or an extern declaration names the
// library's own, so it binds nothing; the identifiers that declare count as
// no use either way.
function cNames(root: Node) {
  const bindings = new Map<string, Binding[]>();
  const declaring = new Set<number>();
  const identifiers = new Map<string, Node[]>();
  const macros: string[] = [];
  const strings: { value: string; inAsm: boolean }[] = [];
  const bind = (identifier: Node | null, block: Node | null, own: boolean, start?: number) => {
    if (!identifier) return;
    declaring.add(identifier.id);
    if (!own || !block) return;
    const list = bindings.get(identifier.text) ?? [];
    list.push({ block, start: start ?? identifier.startIndex });
    bindings.set(identifier.text, list);
  };
  for (const node of walk(root)) {
    if (node.type === 'identifier') {
      const list = identifiers.get(node.text) ?? [];
      list.push(node);
      identifiers.set(node.text, list);
    } else if (node.type === 'preproc_arg') {
      macros.push(node.text);
    } else if (
      node.type === 'concatenated_string' ||
      (node.type === 'string_literal' && node.parent?.type !== 'concatenated_string')
    ) {
      let inAsm = false;
      for (let up = node.parent; up && !inAsm; up = up.parent) {
        inAsm = /asm|attribute|declspec/.test(up.type);
      }
      strings.push({ value: stringValue(node), inAsm });
    } else if (node.type === 'declaration') {
      const extern = node.children.some(
        (c) => c?.type === 'storage_class_specifier' && c.text === 'extern',
      );
      for (const declarator of node.childrenForFieldName('declarator')) {
        const identifier = declaredIdentifier(declarator);
        bind(
          identifier,
          enclosingBlock(node),
          !extern && !!identifier && !namesFunction(identifier),
        );
      }
    } else if (node.type === 'function_definition') {
      const declarator = node.childForFieldName('declarator');
      bind(declaredIdentifier(declarator), enclosingBlock(node), true, 0);
      // Its parameters are seen in its body.
      let fn: Node | null = declarator;
      while (fn && fn.type !== 'function_declarator') {
        fn =
          fn.type === 'parenthesized_declarator'
            ? fn.namedChild(0)
            : fn.childForFieldName('declarator');
      }
      for (const param of fn?.childForFieldName('parameters')?.namedChildren ?? []) {
        if (param?.type === 'parameter_declaration') {
          bind(
            declaredIdentifier(param.childForFieldName('declarator')),
            node.childForFieldName('body'),
            true,
          );
        }
      }
    } else if (node.type === 'parameter_declaration') {
      // A prototype's parameter names nothing past it.
      bind(declaredIdentifier(node.childForFieldName('declarator')), null, false);
    } else if (node.type === 'enumerator') {
      bind(node.childForFieldName('name'), enclosingBlock(node), true);
    }
  }
  return { bindings, declaring, identifiers, macros, strings };
}

type CNames = ReturnType<typeof cNames>;

// A forbidden function is forbidden in any use, not only a direct call: a
// pointer to it (`size_t (*len)(const char *) = strlen;`), a macro that
// expands to it (`#define LEN strlen`) or pastes it together (`a##b`), its
// compiler builtin (`__builtin_strlen`), a name the linker is told to bind to
// it (`__asm__("strlen")`, `weakref("strlen")`, `#pragma redefine_extname`)
// or a lookup by name (`dlsym`). A name the student declares themselves
// (`int pow = 1;`, their own `strlen`) is theirs where it is seen.
function refersTo(names: CNames, name: string): boolean {
  const bare = name.replace(/\W/g, '');
  const word = new RegExp(`\\b(?:__builtin_)?${bare}\\b`);
  if (names.macros.some((body) => body.includes('##') || word.test(body))) return true;
  if (names.strings.some((s) => s.value === name || (s.inAsm && word.test(s.value)))) return true;
  const used = (identifier: Node) => {
    if (names.declaring.has(identifier.id)) return false;
    const seen = new Set(
      (names.bindings.get(identifier.text) ?? [])
        .filter((b) => b.start < identifier.startIndex)
        .map((b) => b.block.id),
    );
    let up = identifier.parent;
    while (up && !seen.has(up.id)) up = up.parent;
    return !up;
  };
  for (const spelling of [
    name,
    `__builtin_${name}`,
    `__builtin___${name}_chk`,
    ...DYNAMIC_LOOKUPS,
  ]) {
    if ((names.identifiers.get(spelling) ?? []).some(used)) return true;
  }
  return false;
}

export function checkStructure(
  root: Node,
  structure: LessonTestsSpec['structure'],
): StructureFailure[] {
  const failures: StructureFailure[] = [];
  for (const rule of structure?.requires ?? [])
    if (!ruleHolds(root, rule)) failures.push({ type: 'require', rule });
  let names: CNames | null = null;
  for (const rule of structure?.forbids ?? []) {
    const holds =
      rule.kind === 'call' && rule.name
        ? refersTo((names ??= cNames(root)), rule.name)
        : ruleHolds(root, rule);
    if (holds) failures.push({ type: 'forbid', rule });
  }
  return failures;
}

type ValueBase = 'int' | 'long' | 'double' | 'float' | 'char' | 'bool' | 'string';

interface InjectionSite {
  name: string;
  start: number;
  end: number;
  base: ValueBase;
}

function typeBase(typeText: string, isStringDeclarator: boolean): ValueBase {
  const text = typeText.trim();
  if (/\bchar\b/.test(text)) return isStringDeclarator ? 'string' : 'char';
  if (/\b(_Bool|bool)\b/.test(text)) return 'bool';
  if (/\bdouble\b/.test(text)) return 'double';
  if (/\bfloat\b/.test(text)) return 'float';
  if (/\blong\b/.test(text)) return 'long';
  return 'int';
}

// Injection sites in source order: every `init_declarator` with an initializer,
// paired with the declared type so the literal can be rendered correctly.
export function collectInjectionSites(root: Node): InjectionSite[] {
  const sites: InjectionSite[] = [];
  for (const node of walk(root)) {
    if (node.type !== 'declaration') continue;
    const typeText = node.childForFieldName('type')?.text ?? '';
    for (const decl of node.childrenForFieldName('declarator')) {
      if (!decl || decl.type !== 'init_declarator') continue;
      const declarator = decl.childForFieldName('declarator');
      const value = decl.childForFieldName('value');
      const name = declaratorName(declarator);
      if (!name || !value) continue;
      const isString =
        declarator?.type === 'pointer_declarator' || declarator?.type === 'array_declarator';
      sites.push({
        name,
        start: value.startIndex,
        end: value.endIndex,
        base: typeBase(typeText, isString),
      });
    }
  }
  return sites.sort((a, b) => a.start - b.start);
}

function escapeString(value: string): string {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`;
}

function ensureDecimal(text: string): string {
  return /[.eE]/.test(text) ? text : `${text}.0`;
}

function renderLiteral(value: InjectValue | InjectValue[], base: ValueBase): string {
  if (value !== null && typeof value === 'object') {
    // $list / $dict aren't needed for C (collection lessons read via scanf and
    // use per-case stdin, no injection). Out of scope until a lesson needs them.
    throw new Error('C injection does not support $list/$dict values');
  }
  switch (base) {
    case 'string':
      return escapeString(String(value));
    case 'char': {
      const ch = String(value);
      return `'${ch.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
    }
    case 'bool':
      return value ? '1' : '0';
    case 'long':
      return `${Math.trunc(Number(value))}L`;
    case 'float':
      return `${ensureDecimal(String(Number(value)))}f`;
    case 'double':
      return String(Number(value));
    default:
      if (typeof value === 'boolean') return value ? '1' : '0';
      return String(value);
  }
}

// Splice each injected value into its declarator's initializer range,
// last-to-first so earlier offsets stay valid. A JS array feeds successive
// declarations of the same name (reassignment); a name never declared in this
// source is skipped (structure `requires: variable` + the output diff catch the
// absence; the Java divergence from Python's prepend, since C needs a type).
export function applyInjection(
  code: string,
  sites: InjectionSite[],
  values: Record<string, InjectValue | InjectValue[]>,
): string {
  const queues = new Map<string, InjectValue[]>();
  for (const [name, value] of Object.entries(values)) {
    queues.set(name, Array.isArray(value) ? [...value] : [value]);
  }
  const edits: { start: number; end: number; text: string }[] = [];
  for (const site of sites) {
    const queue = queues.get(site.name);
    if (!queue || queue.length === 0) continue;
    edits.push({
      start: site.start,
      end: site.end,
      text: renderLiteral(queue.shift()!, site.base),
    });
  }
  edits.sort((a, b) => b.start - a.start);
  let result = code;
  for (const edit of edits) {
    result = result.slice(0, edit.start) + edit.text + result.slice(edit.end);
  }
  return result;
}

interface PreparedCase {
  userSrc: string;
  /** Absent when the case's reference output is already cached (skipSolution). */
  solutionSrc?: string;
  stdin?: string;
  skipSolution?: true;
}

export interface PrepareResult {
  syntaxError: string | null;
  structureFailures: StructureFailure[];
  cases: PreparedCase[];
}

// Full server-side preparation for the C judge: syntax gate 1 + structure checks
// on the pristine user code, then per-case injection into BOTH the user code and
// the reference solution. The runner receives only pre-injected sources. Cases
// in `skipSolution` (reference output already cached) carry the user side only.
export async function prepareC(
  userCode: string,
  solutionCode: string,
  spec: LessonTestsSpec,
  skipSolution: ReadonlySet<number> = new Set(),
): Promise<PrepareResult> {
  const userRoot = await parseC(userCode);
  const syntaxError = detectSyntaxError(userRoot);
  if (syntaxError) return { syntaxError, structureFailures: [], cases: [] };

  const structureFailures = checkStructure(userRoot, spec.structure);
  const userSites = collectInjectionSites(userRoot);
  const solutionSites = collectInjectionSites(await parseC(solutionCode));

  const cases: PreparedCase[] = spec.cases.map((testCase, index) => {
    const inject = testCase.inject ?? {};
    return {
      userSrc: applyInjection(userCode, userSites, inject),
      ...(skipSolution.has(index)
        ? { skipSolution: true as const }
        : { solutionSrc: applyInjection(solutionCode, solutionSites, inject) }),
      ...(testCase.stdin !== undefined ? { stdin: testCase.stdin } : {}),
    };
  });

  return { syntaxError: null, structureFailures, cases };
}
