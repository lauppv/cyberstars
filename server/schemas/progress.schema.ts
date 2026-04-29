import { z } from "zod";

export const saveCodeSchema = z.object({
  code: z.string().max(50_000),
});

export type SaveCodeInput = z.infer<typeof saveCodeSchema>;
