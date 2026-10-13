// A lesson colours a phrase green with :green[...] to tie it to a green box in a strindex fence.
// remark-directive also reads a bare :name in plain text (":D", "12:04", "[0:5]") as a
// directive, so every other directive goes back to the text it was written as
interface MdNode {
  type: string;
  name?: string;
  children?: MdNode[];
  position?: { start: { offset?: number }; end: { offset?: number } };
  data?: Record<string, unknown>;
}

// Bold text sets its own colour inline, so the phrase's bold words need the important flag
const GREEN_TEXT = 'text-[var(--success)] [&_strong]:text-[var(--success)]!';

export function remarkGreen() {
  return (tree: MdNode, file: { value: unknown }) => {
    const source = String(file.value);
    const walk = (node: MdNode) => {
      node.children = node.children?.map((child) => {
        if (!child.type.endsWith('Directive')) {
          walk(child);
          return child;
        }
        if (child.type === 'textDirective' && child.name === 'green') {
          child.data = { hName: 'span', hProperties: { className: GREEN_TEXT } };
          walk(child);
          return child;
        }
        const text = {
          type: 'text',
          value: source.slice(child.position?.start.offset, child.position?.end.offset),
        };
        return child.type === 'textDirective' ? text : { type: 'paragraph', children: [text] };
      });
    };
    walk(tree);
  };
}
