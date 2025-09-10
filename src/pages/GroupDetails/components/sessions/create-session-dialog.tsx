import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  createStudySessionSchema,
  type CreateStudySessionSchema,
} from "@/validators/session-validators";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { useCreateSession } from "@/hooks/api/use-session-data";
import { useAuthStore } from "@/store/auth-store";
import { useFindGroupById } from "@/hooks/api/use-group-data";
import toast from "react-hot-toast";

interface Props {
  groupId: string;
}

export const CreateSessionDialog = ({ groupId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuthStore.getState();
  const { refetch } = useFindGroupById(groupId);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateStudySessionSchema>({
    resolver: zodResolver(createStudySessionSchema),
    defaultValues: {
      title: "",
      description: "",
      link: "",
      date: undefined,
    },
  });

  const { mutate, isPending } = useCreateSession();

  const onSubmit = (data: CreateStudySessionSchema) => {
    if (!user?.id) return;

    const sessionData = { ...data, creatorId: user.id, groupId };

    mutate(sessionData, {
      onSuccess: () => {
        setIsOpen(false);
        reset();
        refetch();
      },
      onError: () => {
        toast.error("Houve um erro ao criar sessão de estudo.");
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
          <span className="font-semibold mt-2">Criar nova sessão</span>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova sessão</DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >
            <div>
              <Input placeholder="Título da sessão" {...register("title")} />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div>
              <Textarea
                placeholder="Descrição da sessão"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <Input placeholder="Link (opcional)" {...register("link")} />
              {errors.link && (
                <p className="text-sm text-red-500">{errors.link.message}</p>
              )}
            </div>

            <div>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className={`w-full justify-between font-normal ${
                          field.value
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {field.value
                          ? format(field.value, "dd 'de' MMMM 'de' yyyy", {
                              locale: ptBR,
                            })
                          : "Escolha a data"}
                        <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      side="bottom"
                      align="start"
                      className="w-auto p-0 z-50"
                    >
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        captionLayout="dropdown"
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.date && (
                <p className="text-sm text-red-500">{errors.date.message}</p>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting || isPending}>
              {isSubmitting || isPending ? "Criando..." : "Criar sessão"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
