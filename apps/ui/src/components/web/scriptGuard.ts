import { parse, type Node } from 'acorn';

// The student's JavaScript, made safe to run in the preview (CYB-109). A
// sandboxed frame can share its process with the lesson (always in Firefox),
// so an endless loop would freeze the whole tab, the IDE with it, and nothing
// outside could stop it. Every loop gets a guard instead: the loop starts a
// clock (`s`) and each turn asks it (`t`), which throws once the loop has run
// for too long (`e`). The helpers live on window.__cyberstars, which the
// preview's prelude sets up before any of the page's scripts.
//
// In a module, an import of another file of the site is given the name the
// preview runs that file under.
//
// Everything is inserted on the lines it belongs to, so the line of an error
// is the line the student wrote. Code that doesn't parse is left as it is:
// the browser reports its syntax error.

export interface GuardOptions {
  module: boolean;
  // The name an error in this code gives its place by (the file, or the page)
  label: string;
  // Gives the name to import a specifier by, or null to leave it alone
  importTarget?: (specifier: string) => string | null;
  // The first loop number to use; loops are numbered across a whole page
  firstLoop?: number;
  // The line of its file the code starts on: a script inside a page starts
  // where the page has it
  firstLine?: number;
}

export interface GuardedScript {
  code: string;
  // How many loop numbers it used
  loops: number;
}

const LOOPS = new Set([
  'ForStatement',
  'ForInStatement',
  'ForOfStatement',
  'WhileStatement',
  'DoWhileStatement',
]);

interface Loc {
  start: { line: number };
}
type AnyNode = Node & Record<string, unknown> & { loc?: Loc };

interface Edit {
  at: number;
  // An insertion, or a replacement up to `end`
  text: string;
  end?: number;
  // Ties at one position keep their order of creation
  order: number;
}

function children(node: AnyNode): AnyNode[] {
  const out: AnyNode[] = [];
  for (const key of Object.keys(node)) {
    if (key === 'loc') continue;
    const value = node[key];
    if (Array.isArray(value)) {
      for (const item of value) {
        if (item && typeof item === 'object' && typeof item.type === 'string') out.push(item);
      }
    } else if (value && typeof value === 'object' && typeof (value as AnyNode).type === 'string') {
      out.push(value as AnyNode);
    }
  }
  return out;
}

export function guardScript(code: string, options: GuardOptions): GuardedScript {
  let program: AnyNode;
  try {
    program = parse(code, {
      ecmaVersion: 'latest',
      sourceType: options.module ? 'module' : 'script',
      allowHashBang: true,
      locations: true,
    }) as unknown as AnyNode;
  } catch {
    return { code, loops: 0 };
  }

  const edits: Edit[] = [];
  let order = 0;
  const add = (at: number, text: string, end?: number) =>
    edits.push({ at, text, end, order: order++ });
  let next = options.firstLoop ?? 0;
  const label = JSON.stringify(options.label);

  // `labels` is the outermost of the labels right above the node, if any
  const visit = (node: AnyNode, labels: AnyNode | null) => {
    if (LOOPS.has(node.type)) {
      const id = next++;
      const line = (node.loc?.start.line ?? 1) + (options.firstLine ?? 1) - 1;
      // The whole statement, its labels with it so `continue label` still
      // finds them, goes in a block that starts the clock first.
      const outer = labels ?? node;
      add(outer.start, `{__cyberstars.s(${id});`);
      add(outer.end, '}');
      const body = node.body as AnyNode;
      const check = `if(__cyberstars.t(${id}))throw __cyberstars.e(${line},${label});`;
      if (body.type === 'BlockStatement') {
        add(body.start + 1, check);
      } else {
        add(body.start, `{${check}`);
        add(body.end, '}');
      }
    }
    if (
      options.importTarget &&
      (node.type === 'ImportDeclaration' ||
        node.type === 'ExportNamedDeclaration' ||
        node.type === 'ExportAllDeclaration' ||
        node.type === 'ImportExpression')
    ) {
      const source = node.source as AnyNode | null;
      if (source?.type === 'Literal' && typeof source.value === 'string') {
        const target = options.importTarget(source.value);
        if (target !== null) add(source.start, JSON.stringify(target), source.end);
      }
    }
    const above = node.type === 'LabeledStatement' ? (labels ?? node) : null;
    for (const child of children(node)) visit(child, above);
  };
  visit(program, null);

  // Apply from the end, so earlier positions stay where they were. At one
  // position the edit made first ends up first.
  edits.sort((a, b) => b.at - a.at || b.order - a.order);
  let out = code;
  for (const edit of edits) {
    out = out.slice(0, edit.at) + edit.text + out.slice(edit.end ?? edit.at);
  }
  return { code: out, loops: next - (options.firstLoop ?? 0) };
}
