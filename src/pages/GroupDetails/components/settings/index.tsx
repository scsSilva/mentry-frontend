import { useState } from "react";
import { useGroupStore } from "@/store/group-store";
import { useAuthStore } from "@/store/auth-store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import MembersDataTable from "./members-table";
import { useUpdateGroup } from "@/hooks/api/use-group-data";
import { Loader2, Clipboard } from "lucide-react";
import toast from "react-hot-toast";

export const GroupSettings = () => {
  const { user } = useAuthStore();
  const group = useGroupStore((state) => state.group);
  const setGroup = useGroupStore((s) => s.setGroup);

  const [name, setName] = useState(group?.name || "");
  const [description, setDescription] = useState(group?.description || "");

  const isAdmin = group?.creatorId === user?.id;
  const { mutate: updateGroup, isPending } = useUpdateGroup();

  const dirty =
    name.trim() !== (group?.name ?? "") ||
    description.trim() !== (group?.description ?? "");

  const handleSubmit = () => {
    if (!group?.id || !user?.id) return;
    updateGroup(
      {
        id: group.id,
        payload: {
          userId: user.id,
          name: name.trim(),
          description: description.trim(),
        },
      },
      {
        onSuccess: (updated) => {
          setGroup({ ...group, ...updated });
          toast.success("Informações do grupo atualizadas com sucesso.");
        },
        onError: () => {
          toast.error("Houve um erro ao atualizar as informações do grupo.");
        },
      }
    );
  };

  const [copied, setCopied] = useState(false);
  const handleCopyCode = async () => {
    if (!group?.joinCode) return;
    try {
      await navigator.clipboard.writeText(String(group.joinCode));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  if (!group) return null;

  const joinCode = String(group.joinCode ?? "");
  const digits = joinCode.split("").slice(0, 5);

  return (
    <div className="p-6 px-2 w-full space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,420px] gap-6">
        <div className="space-y-6">
          {isAdmin && (
            <div className="bg-background rounded-2xl border border-border shadow-sm p-6">
              <div className="mb-4">
                <div>
                  <h2 className="text-lg font-semibold">
                    Configurações do grupo
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Edite informações básicas do grupo.
                  </p>
                </div>
              </div>

              <div className="divide-y divide-border/60 space-y-4">
                <div className="pb-4">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Nome do grupo
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="pt-4">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Descrição
                  </label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full resize-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3 flex-wrap">
                <Button
                  onClick={handleSubmit}
                  disabled={!dirty || isPending}
                  className="w-full sm:w-auto"
                >
                  {isPending ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Salvando...
                    </span>
                  ) : (
                    "Salvar alterações"
                  )}
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => {
                    setName(group?.name ?? "");
                    setDescription(group?.description ?? "");
                  }}
                  disabled={!dirty}
                  className="w-full sm:w-auto"
                >
                  Resetar
                </Button>

                <span className="text-sm text-muted-foreground ml-auto">
                  Última alteração:{" "}
                  <strong className="text-foreground/90">
                    {group.updatedAt
                      ? new Date(group.updatedAt).toLocaleString()
                      : "—"}
                  </strong>
                </span>
              </div>
            </div>
          )}

          <aside className="space-y-6">
            <div className="bg-background rounded-2xl border border-border shadow-sm p-5">
              <div className="mb-3">
                <h3 className="text-md font-semibold">Código do Grupo</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Use este código para convidar novos membros.
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex-1 flex items-center justify-between bg-surface/60 border border-border rounded-lg px-3 py-2">
                  <div>
                    <span className="block text-xs text-muted-foreground">
                      Código
                    </span>

                    <div className="mt-2 flex items-center gap-2" aria-hidden>
                      {digits.length === 5 ? (
                        digits.map((d, i) => (
                          <span
                            key={i}
                            className="w-10 h-10 flex items-center justify-center rounded-md bg-white/5 border border-border font-mono text-lg tracking-widest select-none"
                          >
                            {d}
                          </span>
                        ))
                      ) : (
                        <code className="font-mono text-sm select-all block mt-1">
                          {joinCode || "—"}
                        </code>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-stretch gap-2">
                  <Button
                    onClick={handleCopyCode}
                    className="inline-flex items-center gap-2"
                  >
                    <Clipboard className="w-4 h-4" />
                    <span className="text-sm">
                      {copied ? "Copiado!" : "Copiar"}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </aside>

          <div className="bg-background rounded-2xl border border-border shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">Membros</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Gerencie os membros do grupo.
                </p>
              </div>

              <div className="text-sm text-muted-foreground">
                Total:{" "}
                <strong className="text-foreground">
                  {group.members.length}
                </strong>
              </div>
            </div>

            <div>
              <MembersDataTable members={group.members} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
