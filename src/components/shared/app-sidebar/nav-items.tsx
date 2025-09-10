import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { GlobeAltIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

type NavItem = {
  label: string;
  path: string;
  icon: React.ElementType;
};

export const NavItems = () => {
  const navItems: NavItem[] = [
    {
      label: "Meus grupos",
      path: "/",
      icon: UserGroupIcon,
    },
    {
      label: "Explorar",
      path: "/explore",
      icon: GlobeAltIcon,
    },
  ];

  const renderNavItems = (items: NavItem[]) => {
    return items.map((item) => (
      <SidebarMenuItem key={item.label}>
        <SidebarMenuButton asChild tooltip={item.label}>
          <Link to={item.path}>
            <item.icon className="text-primary hover:text-primary transition-all shrink-0" />
            <span className="text-lg">{item.label}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ));
  };

  return (
    <SidebarGroup>
      <SidebarMenu className="gap-4">{renderNavItems(navItems)}</SidebarMenu>
    </SidebarGroup>
  );
};
