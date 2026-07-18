import path from 'path';
import { Parser, Language, type Node } from 'web-tree-sitter';
import type { InjectValue, LessonTestsSpec, StructureFailure } from '../../shared/tests.js';

// Server-side C analysis for the lesson judge. C has no in-container parser
// (python has `ast`, java has javac's Tree API; gcc's shipped python3 parses
// Python, not C), so structure checks AND value injection happen HERE on the
// server via web-tree-sitter (pure JS + WASM — no node-gyp, VPS/Nix safe). The
// container runner (lesson-tests.runner.c.py) then only compiles + runs the
// pre-injected sources. Two syntax gates: tree-sitter catches structural
// breakage (here), gcc catches semantic errors it recovers from (in the runner).

const WASM_PATH = path.join(process.cwd(), 'server', 'services', 'wasm', 'tree-sitter-c.wasm');

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

// Innermost identifier under a declarator (unwraps pointer_declarator /
// array_declarator / function_declarator wrappers).
function declaratorName(declarator: Node | null): string | null {
  let node: Node | null = declarator;
  while (node) {
    if (node.type === 'identifier') return node.text;
    node = node.childForFieldName('declarator');
  }
  return null;
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
        if (declaratorName(node.childForFieldName('declarator')) === rule.name) return true;
      }
      return false;
    case 'loop':
      for (const node of walk(root))
        if (/^(for_statement|while_statement|do_statement)$/.test(node.type)) return true;
      return false;
    case 'int_literal': {
      const values = new Set(rule.values ?? []);
      for (const node of walk(root)) {
        if (node.type !== 'number_literal') continue;
        const value = parseIntLiteral(node.text);
        if (value !== null && values.has(value)) return true;
      }
      return false;
    }
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
      // A bare string literal as a statement (`"printf(...)";`) — valid C, and
      // the counterfeit students use instead of actually commenting a line out.
      for (const node of walk(root)) {
        if (node.type !== 'expression_statement') continue;
        const expr = node.namedChild(0);
        if (expr && (expr.type === 'string_literal' || expr.type === 'concatenated_string')) {
          return true;
        }
      }
      return false;
    default:
      // Unknown kind: require passes, forbid fires (same convention as py/java).
      return true;
  }
}

export function checkStructure(
  root: Node,
  structure: LessonTestsSpec['structure'],
): StructureFailure[] {
  const failures: StructureFailure[] = [];
  for (const rule of structure?.requires ?? [])
    if (!ruleHolds(root, rule)) failures.push({ type: 'require', rule });
  for (const rule of structure?.forbids ?? [])
    if (ruleHolds(root, rule)) failures.push({ type: 'forbid', rule });
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
// absence — the Java divergence from Python's prepend, since C needs a type).
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
  solutionSrc: string;
  stdin?: string;
}

export interface PrepareResult {
  syntaxError: string | null;
  structureFailures: StructureFailure[];
  cases: PreparedCase[];
}

// Full server-side preparation for the C judge: syntax gate 1 + structure checks
// on the pristine user code, then per-case injection into BOTH the user code and
// the reference solution. The runner receives only pre-injected sources.
export async function prepareC(
  userCode: string,
  solutionCode: string,
  spec: LessonTestsSpec,
): Promise<PrepareResult> {
  const userRoot = await parseC(userCode);
  const syntaxError = detectSyntaxError(userRoot);
  if (syntaxError) return { syntaxError, structureFailures: [], cases: [] };

  const structureFailures = checkStructure(userRoot, spec.structure);
  const userSites = collectInjectionSites(userRoot);
  const solutionSites = collectInjectionSites(await parseC(solutionCode));

  const cases: PreparedCase[] = spec.cases.map((testCase) => {
    const inject = testCase.inject ?? {};
    return {
      userSrc: applyInjection(userCode, userSites, inject),
      solutionSrc: applyInjection(solutionCode, solutionSites, inject),
      ...(testCase.stdin !== undefined ? { stdin: testCase.stdin } : {}),
    };
  });

  return { syntaxError: null, structureFailures, cases };
}
