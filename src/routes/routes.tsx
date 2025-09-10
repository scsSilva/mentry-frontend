import { BrowserRouter, Routes } from "react-router-dom";
import { PublicRoutes } from "./public-routes";
import { PrivateRoutes } from "./private-routes";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";

export const RouterApp = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Routes>
        {PublicRoutes()}
        {PrivateRoutes()}
      </Routes>
    </BrowserRouter>
  );
};
