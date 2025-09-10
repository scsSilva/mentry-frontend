import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { RectangleEllipsis } from "lucide-react";
import { useState } from "react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useJoinGroupByCode } from "@/hooks/api/use-group-data";

export const JoinGroupByCodeDialog = () => {
  const { mutate, isPending, error } = useJoinGroupByCode();
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState("");

  const isCodeComplete = code.length === 5;

  const handleJoin = async () => {
    try {
      mutate(code);
      setIsOpen(false);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        setCode("");
      }}
    >
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 px-4 py-2 mt-2 sm:mt-0 cursor-pointer">
          <RectangleEllipsis className="w-4 h-4" />
          <span>Entrar via código</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[300px] flex flex-col items-center justify-between gap-6">
        <DialogHeader>
          <DialogTitle>Entrar via código</DialogTitle>
        </DialogHeader>
        <InputOTP
          maxLength={5}
          pattern={REGEXP_ONLY_DIGITS}
          value={code}
          onChange={setCode}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
          </InputOTPGroup>
        </InputOTP>
        <Button
          className="w-full cursor-pointer"
          disabled={!isCodeComplete}
          onClick={handleJoin}
        >
          Acessar
        </Button>
      </DialogContent>
    </Dialog>
  );
};
