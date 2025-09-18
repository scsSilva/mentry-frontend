import { AppSidebar } from "@/components/shared/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Explore } from "@/pages/Explore";
import { GroupDetails } from "@/pages/GroupDetails";
import { Groups } from "@/pages/Groups";
import { useAuthStore } from "@/store/auth-store";
import { Navigate, Route, Outlet } from "react-router-dom";

const SidebarLayout = () => (
  <SidebarProvider>
    <AppSidebar collapsible="icon" />
    <SidebarInset>
      <div className="p-2 md:hidden">
        <SidebarTrigger />
      </div>
      <Outlet />
    </SidebarInset>
  </SidebarProvider>
);

export const PrivateRoutes = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) {
    return (
      <Route
        path="*"
        element={
          <div className="h-screen w-full flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        }
      />
    );
  }

  if (!isAuthenticated) {
    return <Route path="*" element={<Navigate to="/auth" />} />;
  }

  return (
    <Route element={<SidebarLayout />}>
      <Route path="/" element={<Groups />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/group/:id" element={<GroupDetails />} />
    </Route>
  );
};
