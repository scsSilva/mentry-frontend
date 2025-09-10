import { api } from "@/api/axios";
import type {
  Group,
  GroupOrderBy,
  PaginatedGroups,
  UpdateGroupDTO,
} from "@/types/group-types";
import type { CreateGroupSchema } from "@/validators/group-validators";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const groupApi = {
  findAllGroups: async (
    page: number,
    orderBy: GroupOrderBy,
    where?: any
  ): Promise<PaginatedGroups> => {
    const response = await api.get("/groups", {
      params: {
        page,
        limit: 6,
        orderBy: JSON.stringify(orderBy),
        ...(where && { where: JSON.stringify(where) }),
      },
    });
    return response.data;
  },

  findMyGroups: async (): Promise<Group[]> => {
    const response = await api.get("/groups/my");
    return response.data;
  },

  findGroupById: async (id: string): Promise<Group> => {
    const response = await api.get(`/groups/${id}`);
    return response.data;
  },

  createGroup: async (data: CreateGroupSchema): Promise<Group> => {
    const response = await api.post("/groups", data);
    return response.data;
  },

  joinGroupByCode: async (code: string) => {
    const response = await api.post("/groups/join/code", { code });
    return response.data;
  },

  joinPublicGroup: async (groupId: string) => {
    const response = await api.post(`/groups/${groupId}/join`);
    return response.data;
  },

  deleteGroup: async (groupId: string) => {
    const response = await api.delete(`/groups/${groupId}`);
    return response.data;
  },

  leaveGroup: async (groupId: string) => {
    const response = await api.delete(`/groupMember/leave/${groupId}`);
    return response.data;
  },

  updateGroup: async (
    id: string,
    payload: UpdateGroupDTO & { userId: string }
  ) => {
    const { userId, ...data } = payload;
    const response = await api.put(`/groups/${id}/${userId}`, data);
    return response.data;
  },
};

export const useFindAllGroups = ({
  page,
  orderBy,
  where,
}: {
  page: number;
  orderBy: GroupOrderBy;
  where?: any;
}) => {
  return useQuery<PaginatedGroups, Error>({
    queryKey: ["groups", page, orderBy, where],
    queryFn: () => groupApi.findAllGroups(page, orderBy, where),
    placeholderData: (previousData) => previousData,
    refetchOnWindowFocus: false,
  });
};

export const useFindMyGroupsData = () => {
  return useQuery<Group[]>({
    queryFn: groupApi.findMyGroups,
    queryKey: ["find-my-groups"],
  });
};

export const useFindGroupById = (id: string) => {
  return useQuery({
    queryFn: () => groupApi.findGroupById(id),
    queryKey: ["find-group-by-id", id],
  });
};

export const useCreateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: groupApi.createGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["find-my-groups"] });
    },
  });
};

export const useJoinGroupByCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: groupApi.joinGroupByCode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["find-my-groups"] });
    },
  });
};

export const useJoinPublicGroup = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: groupApi.joinPublicGroup,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["find-my-groups"] });
      qc.invalidateQueries({ queryKey: ["groups"] });
    },
  });
};

export const useDeleteGroup = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ groupId }: { groupId: string }) =>
      groupApi.deleteGroup(groupId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["find-my-groups"] });
      qc.invalidateQueries({ queryKey: ["groups"] });
    },
  });
};

export const useLeaveGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupId: string) => groupApi.leaveGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["find-my-groups"] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
};

export const useUpdateGroup = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateGroupDTO & { userId: string };
    }) => groupApi.updateGroup(id, payload),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["find-group-by-id", vars.id] });
      qc.invalidateQueries({ queryKey: ["find-my-groups"] });
      qc.invalidateQueries({ queryKey: ["groups"] });
    },
  });
};
