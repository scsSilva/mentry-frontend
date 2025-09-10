import { useMutation } from "@tanstack/react-query";
import { api } from "@/api/axios";
import { useAuthStore } from "@/store/auth-store";

type LoginPayload = { username: string; password: string };
type SignUpPayload = { name: string; username: string; password: string };

const authApi = {
  login: async (data: LoginPayload) => {
    await api.post("/auth/login", data);
    const response = await api.get("/auth/me");
    return response.data.user;
  },

  signup: async (data: SignUpPayload) => {
    await api.post("/users", data);
    return data;
  },
};

export const useAuthDataLogin = () => {
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (user) => {
      setAuthenticated(true, user);
    },
  });
};

export const useAuthDataSignUp = () => {
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  return useMutation({
    mutationFn: authApi.signup,
    onSuccess: async (signupData) => {
      try {
        const user = await authApi.login({
          username: signupData.username,
          password: signupData.password,
        });
        setAuthenticated(true, user);
      } catch (err) {
        console.error(err);
      }
    },
  });
};
