import { useState, useEffect, useMemo } from "react";
import { Earth } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { GroupItem } from "../Groups/components/group-item";
import { useFindAllGroups } from "@/hooks/api/use-group-data";
import { useAuthStore } from "@/store/auth-store";
import { JoinGroupByCodeDialog } from "./components/join-group-by-code-dialog";
import toast from "react-hot-toast";

const sortOptions: Record<string, any> = {
  az: { name: "asc" },
  za: { name: "desc" },
  newest: { createdAt: "desc" },
  oldest: { createdAt: "asc" },
};

export const Explore = () => {
  const { user } = useAuthStore.getState();
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState("az");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const where = useMemo(() => {
    if (!debouncedSearch.trim()) return undefined;
    return {
      name: { contains: debouncedSearch.trim(), mode: "insensitive" },
    };
  }, [debouncedSearch]);

  const { data, isPending, isFetching, error } = useFindAllGroups({
    page,
    orderBy: sortOptions[order],
    where,
  });
  const isLoadingGrid = isPending || (isFetching && data);

  useEffect(() => {
    if (error) {
      toast.error("Erro ao carregar grupos!");
    }
  }, [error]);

  return (
    <div className="flex flex-col min-h-[100dvh] w-full p-4">
      <header className="sticky top-0 z-30 bg-background pb-4 pt-4 border-b border-border/40 mb-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Earth className="w-5 h-5 text-muted-foreground" />
              <h1 className="text-2xl font-semibold leading-tight">Explorar</h1>
              <span className="text-sm font-medium text-primary/80 bg-primary/10 px-2 py-0.5 rounded-md">
                {data?.total ?? 0} grupos
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Descubra comunidades públicas de estudo disponíveis.
            </p>
          </div>
          <JoinGroupByCodeDialog />
        </div>
      </header>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
        <Input
          placeholder="Buscar grupo por nome..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:max-w-sm"
        />

        <Select value={order} onValueChange={setOrder}>
          <SelectTrigger className="w-full sm:w-[220px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="az">Nome (A–Z)</SelectItem>
            <SelectItem value="za">Nome (Z–A)</SelectItem>
            <SelectItem value="newest">Mais recente</SelectItem>
            <SelectItem value="oldest">Mais antigo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <main className="flex flex-col flex-1">
        {isLoadingGrid ? (
          <div className="flex flex-1 items-center justify-center min-h-[300px]">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : data?.data.length ? (
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {data.data.map((group) => (
              <GroupItem
                key={group.id}
                id={group.id}
                title={group.name}
                description={group.description}
                isMember={group.members.some((m) => m.userId === user?.id)}
                membersCount={group.members.length}
              />
            ))}
          </section>
        ) : (
          <p className="text-muted-foreground">Nenhum grupo encontrado.</p>
        )}

        {data?.totalPages && (
          <div className="flex items-center justify-end gap-4 mt-auto pt-8 w-full">
            <Button
              variant="outline"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1 || isFetching}
            >
              Anterior
            </Button>

            <span className="text-sm text-muted-foreground flex items-center gap-2">
              Página {page} de {data.totalPages}
            </span>

            <Button
              variant="outline"
              onClick={() =>
                setPage((prev) => (prev < data.totalPages ? prev + 1 : prev))
              }
              disabled={page === data.totalPages || isFetching}
            >
              Próxima
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};
