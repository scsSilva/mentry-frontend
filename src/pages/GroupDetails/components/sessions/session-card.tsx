import type { Session } from "@/types/group-types";
import { User, Calendar, BookMarked } from "lucide-react";

type SessionCardProps = {
  session: Session;
};

export const SessionCard = ({ session }: SessionCardProps) => {
  return (
    <div
      className="max-w-md border border-border rounded p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-background
        flex flex-col justify-between h-[180px]
        "
    >
      <div>
        <div className="flex items-center gap-2 mb-2">
          <BookMarked className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg">{session.title}</h3>
        </div>

        <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {new Date(session.date).toLocaleDateString(undefined, {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>

        {session.description && (
          <p
            className="text-sm text-muted-foreground mb-2 overflow-hidden"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
            }}
            title={session.description}
          >
            {session.description}
          </p>
        )}
      </div>

      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-auto">
        <User className="w-3 h-3" />
        Criado por <span className="font-medium">
          {session.creator.name}
        </span>{" "}
        em{" "}
        {new Date(session.createdAt).toLocaleDateString(undefined, {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </p>
    </div>
  );
};
