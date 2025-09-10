import { Auth } from "@/pages/Auth";
import { Navigate, Route } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store";

export const PublicRoutes = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return !isAuthenticated ? (
    <>
      <Route path="/auth" element={<Auth />} />
    </>
  ) : (
    <Route path="*" element={<Navigate to="/" />} />
  );
};
