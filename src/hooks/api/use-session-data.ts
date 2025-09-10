import { api } from "@/api/axios";
import type { Session } from "@/types/group-types";
import type { CreateStudySessionSchema } from "@/validators/session-validators";
import { useMutation } from "@tanstack/react-query";

const sessionApi = {
  createSession: async (data: CreateStudySessionSchema): Promise<Session> => {
    const response = await api.post("/studySessions", data);
    return response.data;
  },
};

export const useCreateSession = () => {
  return useMutation({
    mutationFn: sessionApi.createSession,
  });
};
