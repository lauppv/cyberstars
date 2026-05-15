import { z } from "zod";

const language = z.enum(["python", "c", "java", "algo-python", "algo-java", "algo-c"]);

export const runCodeSchema = z.object({
  code: z.string().max(50_000),
  language,
});

export const submitCodeSchema = z.object({
  code: z.string().max(50_000),
  language,
  courseKey: z.string().min(1).max(50),
  lessonSlug: z.string().min(1).max(100),
});

export type RunCodeInput = z.infer<typeof runCodeSchema>;
export type SubmitCodeInput = z.infer<typeof submitCodeSchema>;
