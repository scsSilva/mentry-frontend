import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { UserGroupIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useJoinPublicGroup } from "@/hooks/api/use-group-data";
import { Loader2 } from "lucide-react";

type GroupItemProps = {
  title: string;
  description: string;
  isMember: boolean;
  membersCount: number;
  id: string;
};

function formatMemberCountLabel(count: number) {
  if (count <= 1000) return `${count} membro${count !== 1 ? "s" : ""}`;
  const milhares = Math.floor(count / 1000);
  return `Mais de ${milhares} mil membros`;
}

export const GroupItem = ({
  title,
  description,
  isMember,
  membersCount,
  id,
}: GroupItemProps) => {
  const navigate = useNavigate();
  const { mutate: join, isPending: joining } = useJoinPublicGroup();

  const handleClick = () => {
    if (isMember) {
      navigate(`/group/${id}`);
    } else {
      join(id, {
        onSuccess: () => navigate(`/group/${id}`),
      });
    }
  };

  return (
    <Card className="h-[180px] flex flex-col justify-between rounded-xl border border-border/30 bg-card shadow-sm hover:shadow-md hover:border-border/60 transition-all duration-200">
      <CardHeader className="flex items-start justify-between gap-4 pb-2">
        <p className="font-semibold text-lg leading-tight truncate select-none">
          {title}
        </p>
        <Button
          size="sm"
          variant={isMember ? "secondary" : "default"}
          className="shrink-0 flex items-center gap-1 rounded-lg px-3 py-1 cursor-pointer"
          onClick={handleClick}
          disabled={joining}
        >
          {joining ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Entrando...
            </>
          ) : isMember ? (
            <p>Acessar</p>
          ) : (
            <>
              <UserPlusIcon width={16} />
              Participar
            </>
          )}
        </Button>
      </CardHeader>

      <CardContent className="px-6 pt-0 pb-0">
        <p className="text-sm text-muted-foreground line-clamp-1 select-none">
          {description}
        </p>
      </CardContent>

      <CardFooter className="px-6 pb-4 pt-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground select-none">
          <UserGroupIcon width={20} />
          <span>{formatMemberCountLabel(membersCount)}</span>
        </div>
      </CardFooter>
    </Card>
  );
};
