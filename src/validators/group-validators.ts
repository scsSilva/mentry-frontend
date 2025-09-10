import { z } from "zod";

export const createGroupSchema = z.object({
  name: z
    .string({ error: "O nome do grupo é obrigatório" })
    .trim()
    .min(3, { error: "O nome do grupo deve ter pelo menos 3 caracteres" })
    .max(20, { error: "O nome do grupo deve ter, no máximo, 20 caracteres" }),
  description: z
    .string()
    .trim()
    .max(50, { error: "A descrição deve ter, no máximo, 50 caracteres" }),
  isPrivate: z.boolean(),
});

export type CreateGroupSchema = z.infer<typeof createGroupSchema>;
