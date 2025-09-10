import { z } from "zod";

export const addMaterialSchema = z.object({
  title: z
    .string({ error: "O título é obrigatório" })
    .trim()
    .min(3, { message: "O título deve ter pelo menos 3 caracteres" })
    .max(20, { message: "O título deve ter no máximo 20 caracteres" }),

  type: z.enum(["ARTICLE", "VIDEO", "LINK"], {
    error: "O tipo é obrigatório",
  }),

  url: z
    .string({ error: "O link é obrigatório" })
    .url({ message: "Informe uma URL válida" }),

  description: z
    .string()
    .max(300, { message: "A descrição pode ter no máximo 300 caracteres" })
    .optional(),
});

export type AddMaterialSchema = z.infer<typeof addMaterialSchema>;
