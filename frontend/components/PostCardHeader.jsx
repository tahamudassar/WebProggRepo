"use client";
import { CardHeader } from "@/components/ui/card";
import { useUserData } from "@/store";
import { Ellipsis } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function PostCardHeader() {
  const user = useUserData((state) => state.user);
  return (
    <CardHeader className="flex items-start justify-between w-full flex-row">
      <div className="flex items-center gap-1">
        <Avatar>
          {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
          <AvatarFallback>
            {user.username
              ? user.username[0].toUpperCase() + user.username[1].toUpperCase()
              : "FL"}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-bold text-[14px]">{user.username}</h3>
          <p className="text-[10px] text-white/50">{user.email}</p>
        </div>
      </div>
      <div>
        <Ellipsis />
      </div>
    </CardHeader>
  );
}

export default PostCardHeader;
