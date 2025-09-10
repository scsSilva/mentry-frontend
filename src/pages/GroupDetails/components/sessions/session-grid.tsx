import { CreateSessionDialog } from "./create-session-dialog";
import { SessionCard } from "./session-card";
import { useGroupStore } from "@/store/group-store";

export const SessionGrid = () => {
  const group = useGroupStore((state) => state.group);

  if (!group) {
    return (
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    );
  }

  const { id: groupId, sessions } = group;

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-4">
      <CreateSessionDialog groupId={groupId} />
      {sessions.length > 0 &&
        sessions.map((session) => (
          <SessionCard key={session.id} session={session} />
        ))}
    </div>
  );
};
