import { api } from "@/api/axios";
import type { Material } from "@/types/group-types";
import type { AddMaterialSchema } from "@/validators/material-validators";
import { useMutation } from "@tanstack/react-query";

const materialApi = {
  createMaterial: async (data: AddMaterialSchema): Promise<Material> => {
    const response = await api.post("/materials", data);
    return response.data;
  },
};

export const useCreateMaterial = () => {
  return useMutation({
    mutationFn: materialApi.createMaterial,
  });
};
