import { baseLanguage } from "../../shared/constants";

export interface CourseMeta {
  icon: string;
  color: string;
  label: string;
  langLabel: string;
}

const LANGUAGE_META: Record<string, CourseMeta> = {
  python: { icon: "🐍", color: "#3572A5", label: "Python", langLabel: "Python 3" },
  java: { icon: "☕", color: "#E76F00", label: "Java", langLabel: "Java" },
  c: { icon: "⚙️", color: "#555555", label: "C", langLabel: "C" },
  linux: { icon: "🐧", color: "#FCC624", label: "Linux", langLabel: "Bash" },
};

export function courseMeta(key: string): CourseMeta {
  return (
    LANGUAGE_META[baseLanguage(key)] ?? {
      icon: "📘",
      color: "#6C5CE7",
      label: key,
      langLabel: key.toUpperCase(),
    }
  );
}

export function courseTitle(key: string): string {
  const { label } = courseMeta(key);
  return key.startsWith("algo-") ? `${label} Algorithms` : label;
}
