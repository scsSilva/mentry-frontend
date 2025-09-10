import { UserGroupIcon } from "@heroicons/react/24/outline";
import { GroupItem } from "./components/group-item";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CreateGroupDialog } from "./components/create-group-dialog";
import { useFindMyGroupsData } from "@/hooks/api/use-group-data";

export const Groups = () => {
  const { data, isLoading } = useFindMyGroupsData();
  const groupLimit = 6;

  if (isLoading) {
    return (
      <div className="w-full h-dvh flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full p-4">
        <header className="sticky top-0 z-30 bg-background pb-4 pt-4 border-b border-border/40 mb-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <UserGroupIcon className="w-5 h-5 text-muted-foreground" />
                <h1 className="text-2xl font-semibold leading-tight">
                  Meus Grupos
                </h1>
              </div>
              <p className="text-sm text-muted-foreground">
                Gerencie suas comunidades e participe ativamente.
              </p>
            </div>

            <CreateGroupDialog isEnabledButton={true} />
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center h-[calc(100dvh-150px)]">
          <p className="text-muted-foreground text-base text-center">
            Você ainda não participa de nenhum grupo.
          </p>
        </main>
      </div>
    );
  }

  const userGroups = data.length;

  return (
    <div className="w-full p-4">
      <header className="sticky top-0 z-30 bg-background pb-4 pt-4 border-b border-border/40 mb-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <UserGroupIcon className="w-5 h-5 text-muted-foreground" />
              <h1 className="text-2xl font-semibold leading-tight">
                Meus Grupos
              </h1>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-primary/10 px-2 py-0.5 rounded-md">
                    <span className="text-sm font-medium text-primary/80">
                      {userGroups}/{groupLimit}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Para manter o foco e participação, você só pode participar
                    de, no máximo, 6 grupos.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="text-sm text-muted-foreground">
              Gerencie suas comunidades e participe ativamente.
            </p>
          </div>

          <CreateGroupDialog isEnabledButton={userGroups < groupLimit} />
        </div>
      </header>

      <main className="w-full flex flex-col">
        <section className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-4">
          {data.map((item) => {
            const totalMembers = item.members.length;
            return (
              <GroupItem
                key={item.id}
                title={item.name}
                description={item.name}
                isMember={true}
                membersCount={totalMembers}
                id={item.id}
              />
            );
          })}
        </section>
      </main>
    </div>
  );
};
