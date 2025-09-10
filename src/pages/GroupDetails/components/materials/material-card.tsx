import type { Material } from "@/types/group-types";
import { FileText, Video, Link as LinkIcon, User } from "lucide-react";

type MaterialCardProps = {
  material: Material;
};

const iconMap = {
  ARTICLE: <FileText className="w-5 h-5 text-primary" />,
  VIDEO: <Video className="w-5 h-5 text-primary" />,
  LINK: <LinkIcon className="w-5 h-5 text-primary" />,
};

export const MaterialCard = ({ material }: MaterialCardProps) => {
  return (
    <div
      className="max-w-md border border-border rounded p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-background
      flex flex-col justify-between h-[180px]"
    >
      <div>
        <div className="flex items-center gap-2 mb-2">
          {iconMap[material.type]}
          <h3 className="font-semibold text-lg">{material.title}</h3>
        </div>

        {material.description && (
          <p
            className="text-sm text-muted-foreground mb-2 overflow-hidden"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
            }}
            title={material.description}
          >
            {material.description}
          </p>
        )}

        <a
          href={material.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary text-sm font-medium underline"
          onClick={(e) => e.stopPropagation()}
        >
          Abrir material
        </a>
      </div>

      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-auto">
        <User className="w-3 h-3" />
        Criado por <span className="font-medium">
          {material.user.name}
        </span> em{" "}
        {new Date(material.createdAt).toLocaleDateString(undefined, {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </p>
    </div>
  );
};
