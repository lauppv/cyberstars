import type { TFunction } from 'i18next';
import type { BoxesVisual } from '../visual/parseBoxes';
import type { TreeVisual } from '../visual/parseTree';
import type { GraphVisual } from '../visual/parseGraph';

// A linked list growing node by node at its end, then losing a node from the middle
export function linkedListVisual(values: number[], removed: number, t: TFunction): BoxesVisual {
  const value = t('landing.lists.value');
  const next = t('landing.lists.next');
  const id = (n: number) => `n${n}`;
  const steps: BoxesVisual['steps'] = values.map((n, i) => {
    const before = values[i - 1];
    return i === 0
      ? {
          title: t('landing.lists.add', { n }),
          focus: ['head'],
          ask: t('landing.lists.empty'),
          show: [id(n)],
          point: { head: id(n) },
          caption: t('landing.lists.first', { n }),
        }
      : {
          title: t('landing.lists.add', { n }),
          focus: [id(before)],
          ask: t('landing.lists.where', { n }),
          show: [id(n)],
          point: { [`${id(before)}.${next}`]: id(n) },
          caption: t('landing.lists.atEnd', { a: before, n }),
        };
  });
  const at = values.indexOf(removed);
  const [before, after] = [values[at - 1], values[at + 1]];
  steps.push(
    {
      title: t('landing.lists.remove', { n: removed }),
      focus: [id(before), id(removed)],
      ask: t('landing.lists.which', { n: removed }),
      point: { [`${id(before)}.${next}`]: id(after) },
      caption: t('landing.lists.skip', { a: before, n: removed, b: after }),
    },
    { remove: [id(removed)], caption: t('landing.lists.gone', { n: removed }) },
  );
  return {
    type: 'boxes',
    caption: t('landing.lists.intro'),
    null: 'null',
    boxes: [
      { id: 'head', name: t('landing.lists.head'), shown: true, cells: [{ to: null }] },
      ...values.map((n) => ({
        id: id(n),
        shown: false,
        cells: [
          { name: value, value: n },
          { name: next, to: null },
        ],
      })),
    ],
    steps,
  };
}

// A binary search tree built value by value, each walking down the way a search would
export function searchTreeVisual(values: number[], t: TFunction): TreeVisual {
  const nodes: Record<number, number> = {};
  const steps: TreeVisual['steps'] = values.map((n, i) => {
    if (i === 0) {
      nodes[0] = n;
      return {
        title: t('landing.trees.insert', { n }),
        add: { 0: n },
        focus: [0],
        caption: t('landing.trees.root', { n }),
      };
    }
    const path = [0];
    const turns: string[] = [];
    let place = 0;
    while (nodes[place] !== undefined) {
      const at = nodes[place];
      turns.push(t(n < at ? 'landing.trees.left' : 'landing.trees.right', { n, at }));
      place = 2 * place + (n < at ? 1 : 2);
      path.push(place);
    }
    nodes[place] = n;
    return {
      title: t('landing.trees.insert', { n }),
      ask: t('landing.trees.where', { n }),
      add: { [place]: n },
      path,
      caption: [...turns, t('landing.trees.there', { n })].join('. '),
    };
  });
  return {
    type: 'tree',
    caption: t('landing.trees.intro'),
    null: 'null',
    array: false,
    nodes: {},
    steps,
  };
}

// Breadth-first search reaching a graph's vertices ring by ring, each tagged with its distance
export function breadthFirstVisual(
  vertices: [number, number][],
  edges: [number, number][],
  start: number,
  t: TFunction,
  language: string,
): GraphVisual {
  const list = new Intl.ListFormat(language, { type: 'conjunction' });
  const distance = new Map([[start, 0]]);
  const rings = [[start]];
  for (let d = 1; ; d++) {
    const ring = [
      ...new Set(
        edges
          .flatMap(([u, v]) => [
            [u, v],
            [v, u],
          ])
          .filter(([u, v]) => distance.get(u) === d - 1 && !distance.has(v))
          .map(([, v]) => v),
      ),
    ].sort((a, b) => a - b);
    if (ring.length === 0) break;
    for (const v of ring) distance.set(v, d);
    rings.push(ring);
  }
  const tags = (upTo: number) =>
    Object.fromEntries([...distance].filter(([, d]) => d <= upTo).map(([v, d]) => [v, String(d)]));
  const steps: GraphVisual['steps'] = rings.map((ring, d) => ({
    title: d === 0 ? t('landing.graphs.title', { v: start }) : undefined,
    focus: ring,
    done: rings.slice(0, d).flat(),
    used: edges.filter(
      ([u, v]) =>
        (distance.get(u) === d - 1 && distance.get(v) === d) ||
        (distance.get(v) === d - 1 && distance.get(u) === d),
    ),
    tags: tags(d),
    caption:
      d === 0
        ? t('landing.graphs.start', { v: start })
        : t('landing.graphs.ring', { count: d, list: list.format(ring.map(String)) }),
  }));
  steps.push({
    done: rings.flat(),
    tags: tags(rings.length),
    caption: t('landing.graphs.all', { v: start }),
  });
  return {
    type: 'graph',
    caption: t('landing.graphs.intro'),
    directed: false,
    list: false,
    matrix: false,
    vertices,
    edges,
    steps,
  };
}
