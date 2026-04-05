"use client";
import { useState } from "react";
import { useUserData } from "@/store";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { ThumbsUp, MessageSquareMore } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AddReply from "./AddReply";

function DisplayComment({ comment }) {
  const user = comment.user;
  const [Replybox, setReplybox] = useState(false);

  const handleReply = () => {
    setReplybox(!Replybox);
  };

  return (
    <div className="mb-2">
      <Card className="w-full bg-sub-color my-2 p-2 flex items-center justify-start gap-3">
        <Avatar>
          <AvatarFallback>
            {comment.username ? comment.username[0].toUpperCase() + comment.username[1].toUpperCase() : "FL"}
          </AvatarFallback>
        </Avatar>
        <div className="text-[14px]">{comment}</div>
      </Card>
      <div className="flex items-center h-5 gap-2">
        <div className="cursor-pointer hover:bg-[#262626] transition-all duration-200 rounded-md flex items-center justify-center text-[10px] px-2 py-1">
          <ThumbsUp className="h-3" />
          Like
        </div>
        <Separator orientation="vertical" />
        <div
          className="cursor-pointer hover:bg-[#262626] transition-all duration-200 rounded-md flex items-center justify-center text-[10px] px-2 py-1"
          onClick={handleReply}
        >
          <MessageSquareMore className="h-3" />
          Reply
        </div>
      </div>

      {Replybox && (
        <div className="ml-16 mb-10">
          <AddReply />
        </div>
      )}
    </div>
  );
}

export default DisplayComment;
