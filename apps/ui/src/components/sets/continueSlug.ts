interface LessonProgress {
  slug: string;
  completed: boolean;
  lastAccessedAt: string | null;
}

// Where Continue takes a student in a set: the lesson or challenge they opened
// last, else the first one not done, else the first
export function continueSlug(
  lessons: readonly { slug: string }[],
  progress: readonly LessonProgress[] | undefined,
): string | undefined {
  const slugs = new Set(lessons.map((l) => l.slug));
  let last: { slug: string; at: string } | null = null;
  for (const l of progress ?? []) {
    if (l.lastAccessedAt && slugs.has(l.slug) && (!last || l.lastAccessedAt > last.at)) {
      last = { slug: l.slug, at: l.lastAccessedAt };
    }
  }
  const done = new Set((progress ?? []).filter((l) => l.completed).map((l) => l.slug));
  return last?.slug ?? lessons.find((l) => !done.has(l.slug))?.slug ?? lessons[0]?.slug;
}
