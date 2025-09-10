import { type ColumnDef } from "@tanstack/react-table";
import { type Member } from "@/types/group-types";
import { DataTable } from "@/components/ui/datatable";
import { Button } from "@/components/ui/button";

const columns: ColumnDef<Member>[] = [
  {
    accessorKey: "user",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome
        </Button>
      );
    },
    cell: ({ row }) => {
      const user = row.getValue("user") as { name: string };
      return <div>{user.name}</div>;
    },
  },
  {
    accessorKey: "user",
    id: "username",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Usuário
        </Button>
      );
    },
    cell: ({ row }) => {
      const user = row.getValue("user") as { username: string };
      return <div>{user.username}</div>;
    },
  },
  {
    accessorKey: "role",
    id: "role",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Perfil
        </Button>
      );
    },
    cell: ({ row }) => {
      const role = row.getValue("role") as string;

      const roleMap: Record<string, { label: string; color: string }> = {
        ADMIN: {
          label: "Administrador",
          color: "text-red-600 bg-red-100",
        },
        MEMBER: {
          label: "Membro",
          color: "text-blue-600 bg-blue-100",
        },
      };

      const { label, color } = roleMap[role] || {
        label: "Desconhecido",
        color: "text-gray-600 bg-gray-100",
      };

      return (
        <span className={`text-sm font-medium px-2 py-0.5 rounded-md ${color}`}>
          {label}
        </span>
      );
    },
  },
];

interface Props {
  members: Member[];
}

export default function MembersDataTable({ members }: Props) {
  return <DataTable columns={columns} data={members} />;
}
