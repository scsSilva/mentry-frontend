import { CreateMaterialDialog } from "./create-material-dialog";
import { MaterialCard } from "./material-card";
import { useGroupStore } from "@/store/group-store";

export const MaterialGrid = () => {
  const group = useGroupStore((state) => state.group);

  if (!group) {
    return (
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    );
  }

  const { id: groupId, materials } = group;

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-4">
      <CreateMaterialDialog groupId={groupId} />
      {materials.length > 0 &&
        materials.map((material) => (
          <MaterialCard key={material.id} material={material} />
        ))}
    </div>
  );
};
