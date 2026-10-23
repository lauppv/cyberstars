type Source = Record<string, string | undefined>;

// Reads an app's settings, with names and defaults the app picks; an empty value counts as unset
export function settings(source: Source = process.env) {
  return {
    // A secret the server can't run without, so a missing one stops the boot
    required(name: string): string {
      const value = source[name];
      if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
      }
      return value;
    },
    optional(name: string, fallback: string): string {
      return source[name] || fallback;
    },
    // Anything that isn't a number falls back too
    number(name: string, fallback: number): number {
      return Number(source[name]) || fallback;
    },
  };
}
