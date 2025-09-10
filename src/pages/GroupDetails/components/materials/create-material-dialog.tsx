import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  addMaterialSchema,
  type AddMaterialSchema,
} from "@/validators/material-validators";
import { useCreateMaterial } from "@/hooks/api/use-material-data";
import { useAuthStore } from "@/store/auth-store";
import { useFindGroupById } from "@/hooks/api/use-group-data";

interface Props {
  groupId: string;
}

export const CreateMaterialDialog = ({ groupId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuthStore.getState();
  const { refetch } = useFindGroupById(groupId);

  const form = useForm<AddMaterialSchema>({
    resolver: zodResolver(addMaterialSchema),
    defaultValues: {
      title: "",
      type: undefined,
      url: "",
      description: "",
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  const { mutate, isPending } = useCreateMaterial();

  const onSubmit = (data: AddMaterialSchema) => {
    if (!user?.id) {
      return;
    }

    const groupData = { ...data, userId: user.id, groupId };

    mutate(groupData, {
      onSuccess: () => {
        setIsOpen(false);
        reset();
        refetch();
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
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="cursor-pointer border-2 border-dashed border-primary rounded p-4 flex items-center justify-center h-[180px] hover:bg-muted transition-colors"
      >
        <div className="flex flex-col items-center text-primary">
          <Plus className="w-8 h-8" />
          <span className="font-semibold mt-2">Adicionar material</span>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo material</DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >
            <div>
              <Input placeholder="Título do material" {...register("title")} />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div>
              <Select onValueChange={(value) => setValue("type", value as any)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Escolha o tipo do material" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Tipo do material</SelectLabel>
                    <SelectItem value="ARTICLE">Artigo</SelectItem>
                    <SelectItem value="VIDEO">Vídeo</SelectItem>
                    <SelectItem value="LINK">Link</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>

            <div>
              <Input placeholder="Link para o material" {...register("url")} />
              {errors.url && (
                <p className="text-sm text-red-500">{errors.url.message}</p>
              )}
            </div>

            <div>
              <Textarea
                placeholder="Descrição do material"
                className="resize-none"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting || isPending}>
              {isSubmitting || isPending
                ? "Adicionando..."
                : "Adicionar material"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
