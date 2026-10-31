import type { Locator, Page } from '@playwright/test';

export const TEXT_FONT = 'Inter Variable';
export const CODE_FONT = 'JetBrains Mono Variable';

// The first family in an element's font list: the one the page asks for.
export function firstFontOf(locator: Locator): Promise<string> {
  return locator.evaluate((el) =>
    getComputedStyle(el)
      .fontFamily.split(',')[0]
      .trim()
      .replace(/^["']|["']$/g, ''),
  );
}

// Whether an element draws its symbols as typed: the code font's ligatures
// ("liga") and contextual alternates ("calt"), which join != into ≠, both off.
export function drawsAsTyped(locator: Locator): Promise<boolean> {
  return locator.evaluate((el) => {
    const features = getComputedStyle(el).fontFeatureSettings;
    return features.includes('"liga" 0') && features.includes('"calt" 0');
  });
}

type Face = { family: string; style: string; weight: string; status: string; range: string };

// Every font face the page knows about, once the fonts it needs have loaded.
export async function fontFaces(page: Page): Promise<Face[]> {
  return page.evaluate(async () => {
    await document.fonts.ready;
    return [...document.fonts].map((f) => ({
      family: f.family.replace(/^["']|["']$/g, ''),
      style: f.style,
      weight: f.weight,
      status: f.status,
      range: f.unicodeRange,
    }));
  });
}

// Hosts the page fetched anything from, collected from the moment this is called.
export function recordHosts(page: Page): Set<string> {
  const hosts = new Set<string>();
  page.on('request', (req) => hosts.add(new URL(req.url()).host));
  return hosts;
}
