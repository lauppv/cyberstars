import type { TFunction } from 'i18next';
import type { ArrayVisual } from '../visual/parseVisual';

// Bubble sort written out as a lesson visual's steps, each pass one shorter than the last, ending
// early on a pass without a swap
export function bubbleSortVisual(values: number[], t: TFunction): ArrayVisual {
  const a = [...values];
  const steps: ArrayVisual['steps'] = [];
  for (let end = a.length, pass = 1; ; pass++) {
    let swapped = false;
    for (let j = 0; j + 1 < end; j++) {
      const swap = a[j] > a[j + 1];
      steps.push({
        title: j === 0 ? t('landing.sorting.pass', { n: pass }) : undefined,
        compare: [j, j + 1],
        ask: t('landing.sorting.ask', { a: a[j], b: a[j + 1] }),
        swap: swap || undefined,
        caption: t(swap ? 'landing.sorting.yes' : 'landing.sorting.no'),
      });
      if (swap) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swapped = true;
      }
    }
    end--;
    if (!swapped || end <= 1) {
      steps.push({
        sorted: 0,
        caption: t(swapped ? 'landing.sorting.done' : 'landing.sorting.doneNoSwaps'),
      });
      return {
        type: 'array',
        values,
        caption: t('landing.sorting.intro'),
        pointers: ['j = {i}', 'j + 1'],
        steps,
      };
    }
    steps.push({ sorted: end, caption: t('landing.sorting.inPlace', { n: a[end] }) });
  }
}
