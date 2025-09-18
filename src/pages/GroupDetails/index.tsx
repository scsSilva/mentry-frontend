import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { SessionGrid } from "./components/sessions/session-grid";
import { MaterialGrid } from "./components/materials/material-grid";
import { ChatBox } from "./components/chat/chat-box";
import { GroupSettings } from "./components/settings";
import { useNavigate, useParams } from "react-router-dom";
import { useFindGroupById } from "@/hooks/api/use-group-data";
import { useGroupStore } from "@/store/group-store";
import { DeleteGroupDialog } from "./components/delete-group-dialog";
import { useAuthStore } from "@/store/auth-store";

const TABS = ["sessions", "materials", "chat", "settings"] as const;
type TabType = (typeof TABS)[number];

export const GroupDetails = () => {
  const { user } = useAuthStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("sessions");
  const params = useParams();
  const navigate = useNavigate();

  const { data } = useFindGroupById(params.id!);

  const setGroup = useGroupStore((state) => state.setGroup);
  const resetGroup = useGroupStore((state) => state.resetGroup);

  useEffect(() => {
    if (data) {
      setGroup(data);
    }
    return () => {
      resetGroup();
    };
  }, [data]);

  const fullDescription = data?.description || "Sem descrição.";
  const maxLength = 140;
  const isLong = fullDescription.length > maxLength;
  const shortDescription = fullDescription.slice(0, maxLength).trim() + "...";

  const toggleDescription = () => {
    if (isLong) setIsExpanded(!isExpanded);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "sessions":
        return <SessionGrid />;
      case "materials":
        return <MaterialGrid />;
      case "chat":
        return <ChatBox />;
      case "settings":
        return <GroupSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full p-4">
      <header className="sticky top-0 z-30 bg-background pb-4 pt-4 border-b border-border/40 mb-4">
        <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4 w-full">
          <div className="flex gap-3 items-start sm:items-center">
            <button
              className="w-fit cursor-pointer"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-semibold leading-tight">
                {data?.name || "Carregando..."}
              </h1>

              <p
                className="text-sm text-muted-foreground cursor-pointer transition-all duration-300"
                onClick={toggleDescription}
              >
                {isExpanded || !isLong ? fullDescription : shortDescription}
              </p>
            </div>
          </div>

          <DeleteGroupDialog isAdmin={data?.creatorId === user?.id} />
        </div>
      </header>

      <div className="flex gap-4 overflow-x-auto no-scrollbar border-b border-border mb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors hover:cursor-pointer ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-primary"
            }`}
          >
            {tab === "sessions" && "Sessões"}
            {tab === "materials" && "Materiais"}
            {tab === "chat" && "Chat"}
            {tab === "settings" && "Configurações"}
          </button>
        ))}
      </div>

      <div>{renderTabContent()}</div>
    </div>
  );
};
