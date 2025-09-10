import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  createGroupSchema,
  type CreateGroupSchema,
} from "@/validators/group-validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useCreateGroup } from "@/hooks/api/use-group-data";
import { useAuthStore } from "@/store/auth-store";

type CreateGroupDialogProps = {
  isEnabledButton: boolean;
};

export const CreateGroupDialog = ({
  isEnabledButton,
}: CreateGroupDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const { user } = useAuthStore.getState();

  const createGroupForm = useForm<CreateGroupSchema>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      isPrivate: false,
    },
  });

  const { reset, watch, register, handleSubmit, formState } = createGroupForm;

  const { mutate, isPending } = useCreateGroup();

  const name = watch("name");
  const description = watch("description");

  const onSubmit = (data: CreateGroupSchema) => {
    if (!user?.id) {
      return;
    }

    const groupData = { ...data, creatorId: user.id };

    mutate(groupData, {
      onSuccess: () => {
        setIsOpen(false);
        reset();
      },
      onError: (e: any) => {
        try {
          const errors = JSON.parse(e?.message);
          console.error(errors);
        } catch {
          console.error(e);
        }
      },
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          className="flex items-center gap-2 px-4 py-2 mt-2 sm:mt-0 cursor-pointer"
          disabled={!isEnabledButton}
        >
          <PlusIcon className="w-4 h-4" />
          <span>Novo grupo</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo grupo</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-2.5 h-full"
        >
          <Input type="text" placeholder="Nome" {...register("name")} />
          {formState.errors.name && (
            <p className="text-red-500 text-sm">
              {formState.errors.name.message}
            </p>
          )}
          <Textarea
            placeholder="Descrição"
            className="resize-none"
            {...register("description")}
          />
          {formState.errors.description && (
            <p className="text-red-500 text-sm">
              {formState.errors.description.message}
            </p>
          )}
          <div className="flex items-center gap-1">
            <Label htmlFor="is-private-field">Grupo privado</Label>
            <Switch
              id="is-private-field"
              checked={watch("isPrivate") ?? false}
              onCheckedChange={(checked) =>
                createGroupForm.setValue("isPrivate", checked)
              }
            />
          </div>
          <Button
            type="submit"
            disabled={!name || !description || isPending}
            className="cursor-pointer"
          >
            {isPending ? "Criando..." : "Criar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
