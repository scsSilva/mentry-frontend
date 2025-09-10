import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import type { ComponentProps } from "react";
import { Link } from "react-router-dom";
import { NavItems } from "./nav-items";
import Logo from "@/assets/logo.svg?react";
import LogoDark from "@/assets/logo-dark.svg?react";
import IconLogo from "@/assets/icon-logo.svg?react";
import {
  ArrowLeftStartOnRectangleIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import { useAuthStore } from "@/store/auth-store";
import { useTheme } from "@/components/theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleChevronDown } from "lucide-react";

type AppSidebarProps = ComponentProps<typeof Sidebar>;

export const AppSidebar = ({ ...props }: AppSidebarProps) => {
  const { logout, user } = useAuthStore();
  const { theme, setTheme } = useTheme();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="py-4">
        <Link to="/" className="flex items-center justify-center pt-3 pb-4">
          {theme === "light" ? (
            <>
              <LogoDark className="w-full max-w-[150px] group-data-[collapsible=icon]:hidden" />
              <IconLogo className="w-full max-w-[20px] hidden group-data-[collapsible=icon]:block" />
            </>
          ) : (
            <>
              <Logo className="w-full max-w-[150px] group-data-[collapsible=icon]:hidden" />
              <IconLogo className="w-full max-w-[20px] hidden group-data-[collapsible=icon]:block" />
            </>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <NavItems />
      </SidebarContent>

      <SidebarFooter className="flex flex-col gap-2 p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="bg-input hover:bg-input/80 transition-colors">
              <div className="flex items-center justify-between w-full">
                <p className="font-medium text-sm">Opções</p>
                <CircleChevronDown className="w-5 h-5 text-muted-foreground" />
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-[220px] rounded-lg bg-background shadow-lg border border-border p-2">
            <DropdownMenuLabel className="text-sm font-semibold text-foreground truncate">
              {user?.name ?? user?.username ?? "Usuário"}
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground cursor-pointer"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <SunIcon className="w-5 h-5" />
              ) : (
                <MoonIcon className="w-5 h-5" />
              )}
              <span className="text-sm font-medium">
                {theme === "dark" ? "Claro" : "Escuro"}
              </span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-destructive/90 hover:text-destructive-foreground cursor-pointer"
              onClick={logout}
            >
              <ArrowLeftStartOnRectangleIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};
