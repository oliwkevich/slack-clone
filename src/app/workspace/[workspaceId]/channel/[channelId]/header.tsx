import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/features/auth/api/use-current-user";
import { useRemoveChannel } from "@/features/channels/api/use-remove-channel";
import { useUpdateChannel } from "@/features/channels/api/use-update-channel";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useChannelId } from "@/hooks/use-channel-id";
import { useConfirm } from "@/hooks/use-confirm";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { toast } from "sonner";

type Props = {
  title: string;
};

export const Header = ({ title }: Props) => {
  const router = useRouter();
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();
  const [value, setValue] = useState(title);
  const [editOpen, setEditOpen] = useState(false);
  const { ConfrimDialog, confirm } = useConfirm();

  const { data: member } = useCurrentMember({ workspaceId });

  const handleEditOpen = (value: boolean) => {
    if (member?.role !== "admin") return;
    setEditOpen(value);
  };

  const { mutate: updateChannel, isPending: isUpdatingChannel } =
    useUpdateChannel();

  const { mutate: removeChannel, isPending: isRemovingChannel } =
    useRemoveChannel();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setValue(value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateChannel(
      { id: channelId, name: value },
      {
        onSuccess: () => {
          toast.success("Назву успішно змінено!");
          setEditOpen(false);
        },
        onError: () => toast.error("Помилка при зміні назви!"),
      }
    );
  };

  const handleRemove = async () => {
    const ok = await confirm();
    if (!ok) return;

    removeChannel(
      { id: channelId },
      {
        onSuccess: () => {
          toast.success("Канал успішео видалений");
          router.replace(`/workspace/${workspaceId}`);
        },
        onError: () => toast.error("Помилка при видаленні каналу"),
      }
    );
  };

  return (
    <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
      <ConfrimDialog />
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="text-lg font-semibold overflow-hidden px-2 w-auto"
            size="sm"
          >
            <span className="truncate"># {title}</span>
            <FaChevronDown className="size-2.5 ml-2" />
          </Button>
        </DialogTrigger>
        <DialogContent className="p-0 bg-gray-50 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-white">
            <DialogTitle># {title}</DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4 flex flex-col gap-y-2">
            <Dialog open={editOpen} onOpenChange={handleEditOpen}>
              <DialogTrigger asChild>
                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Назва каналу</p>
                    {member?.role === "admin" && (
                      <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                        Змінити
                      </p>
                    )}
                  </div>
                  <p className="text-sm">#{title}</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Змінити назву канала</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <Input
                    required
                    value={value}
                    minLength={3}
                    maxLength={24}
                    disabled={isUpdatingChannel || isRemovingChannel}
                    onChange={handleChange}
                    placeholder="main-channel, home-channel..."
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        variant="outline"
                        disabled={isUpdatingChannel || isRemovingChannel}
                      >
                        Відмінити
                      </Button>
                    </DialogClose>
                    <Button disabled={isUpdatingChannel || isRemovingChannel}>
                      Зберегти
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            {member?.role === "admin" && (
              <button
                onClick={handleRemove}
                className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50 text-rose-600"
              >
                <Trash className="size-4" />
                <p className="text-sm font-semibold">Видалити канал</p>
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
