import { CardHeader } from "@/components/ui/card";
import { Ellipsis } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function PostCardHeader({ user }) {
  return (
    <CardHeader className="flex items-start justify-between w-full flex-row">
      <div className="flex items-center gap-1">
        <Avatar>
          <AvatarFallback>
            {user?.username
              ? user.username[0].toUpperCase() + user.username[1].toUpperCase()
              : "FL"}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-bold text-[14px]">{user?.username || "Guest"}</h3>
          <p className="text-[10px] text-white/50">{user?.email || "N/A"}</p>
        </div>
      </div>
      <div>
        <Ellipsis />
      </div>
    </CardHeader>
  );
}

export default PostCardHeader;
