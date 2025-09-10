import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string({ error: "O nome de usuário é obrigatório" })
    .trim()
    .min(3, { error: "O nome de usuário deve ter pelo menos 3 caracteres" })
    .max(30, { error: "O nome de usuário deve ter no máximo 30 caracteres" }),

  password: z
    .string({ error: "A senha é obrigatória" })
    .min(8, { error: "A senha deve ter no mínimo 8 caracteres" })
    .max(64, { error: "A senha deve ter no máximo 64 caracteres" }),
});

export const signUpSchema = z.object({
  name: z
    .string()
    .min(8, { error: "O nome deve ter pelo menos 8 caracteres" })
    .nonempty({ error: "O nome é obrigatório" }),
  username: z
    .string()
    .min(6, { error: "O nome de usuário deve ter pelo menos 6 caracteres" })
    .nonempty({ error: "O nome de usuário é obrigatório" }),
  password: z
    .string()
    .min(8, { error: "A senha deve ter pelo menos 8 caracteres" })
    .nonempty({ error: "A senha é obrigatória" }),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type SignUpSchema = z.infer<typeof signUpSchema>;
