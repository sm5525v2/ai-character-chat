"use client";

import axios from "axios";
import { Character, Message } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import {
  ChevronLeft,
  Edit,
  MessagesSquare,
  MoreVertical,
  Trash,
} from "lucide-react";
import { BotAvatar } from "./bot-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { toast, useToast } from "./ui/use-toast";
import { useUser } from "@clerk/nextjs";

interface ChatHeaderProps {
  character: Character & {
    messages: Message[];
    _count: {
      messages: number;
    };
  };
}

const ChatHeader = ({ character }: ChatHeaderProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();

  const onDelete = async () => {
    try {
      await axios.delete(`/api/character/${character.id}`);
      toast({
        description: "Success.",
      });
      router.refresh();
      router.push("/");
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Something went wrong.",
      });
    }
  };

  return (
    <div className="flex w-full justify-between items-center border-b border-primary/10 pb-4">
      <div className="flex gap-x-2 items-center">
        <Button onClick={() => router.back()} size="icon" variant="ghost">
          <ChevronLeft className="h-8 w-8" />
        </Button>
        <BotAvatar src={character.src} />
        <div className="flex flex-col gap-y-1">
          <div className="flex items-center gap-x-2">
            <p className="font-bold">{character.name}</p>
            <div className="flex items-center text-xs text-muted-foreground">
              <MessagesSquare className="w-3 h-3 mr-1" />
              {character._count.messages}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Created by {character.userName}
          </p>
        </div>
      </div>
      {user?.id === character.userId && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon">
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => router.push(`/character/${character.id}`)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete}>
              <Trash className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default ChatHeader;
