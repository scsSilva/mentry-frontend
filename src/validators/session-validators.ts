import { z } from "zod";

export const createStudySessionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, { message: "O título deve ter pelo menos 3 caracteres" })
    .max(50, { message: "O título deve ter no máximo 50 caracteres" }),

  date: z.date({ error: "A data é obrigatória" }),

  link: z.string().url({ message: "Informe um link válido" }).optional(),

  description: z
    .string()
    .max(300, { message: "A descrição pode ter no máximo 300 caracteres" })
    .optional(),
});

export type CreateStudySessionSchema = z.infer<typeof createStudySessionSchema>;
