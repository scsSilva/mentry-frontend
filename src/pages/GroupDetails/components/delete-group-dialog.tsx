import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useDeleteGroup, useLeaveGroup } from "@/hooks/api/use-group-data";
import { useGroupStore } from "@/store/group-store";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

type DeleteGroupDialogProps = {
  isAdmin: boolean;
};

export const DeleteGroupDialog = ({ isAdmin }: DeleteGroupDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const group = useGroupStore((s) => s.group);
  const navigate = useNavigate();

  const { mutate: deleteGroup, isPending: deleting } = useDeleteGroup();
  const { mutate: leaveGroup, isPending: leaving } = useLeaveGroup();

  const handleConfirm = () => {
    if (!group?.id) return;
    if (isAdmin) {
      deleteGroup(
        { groupId: group.id },
        {
          onSuccess: () => {
            setIsOpen(false);
            navigate("/groups");
          },
        }
      );
    } else {
      leaveGroup(group.id, {
        onSuccess: () => {
          setIsOpen(false);
          navigate("/groups");
        },
      });
    }
  };

  const loading = deleting || leaving;

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          {isAdmin ? "Excluir grupo" : "Sair do grupo"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isAdmin ? "Excluir grupo" : "Sair do grupo"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isAdmin
              ? "Tem certeza que deseja excluir o grupo? Essa ação não pode ser revertida."
              : "Tem certeza que deseja sair do grupo?"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-white hover:bg-destructive"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Confirmando...
              </span>
            ) : (
              "Confirmar"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
