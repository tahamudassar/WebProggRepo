"use client";
import { useState } from "react";
import { CardFooter } from "@/components/ui/card";
import { Separator } from "./ui/separator";
import { ThumbsUp, MessageSquareMore, Share2 } from "lucide-react";
import AddComment from "./AddComment";
function PostCardFooter() {
  const [CommentBoxOpen, setCommentBoxOpen] = useState(false);

  const handleLike = (e) => {
    setCommentBoxOpen(true);
    if (CommentBoxOpen) {
      setCommentBoxOpen(false);
    }
  };

  const handleComment = (e) => {
    setCommentBoxOpen(true);
    if (CommentBoxOpen) {
      setCommentBoxOpen(false);
    }
  };

  return (
    <div>
      <CardFooter className="p-0">
        <div className="px-5 pb-2 w-full">
          <div>
            <Separator className="my-2" />
            <div className="flex h-8 items-center space-x-4 text-sm justify-between">
              <div
                className="text-center w-full cursor-pointer hover:bg-[#262626] transition-all duration-200 rounded-md py-2 flex items-center justify-center gap-1"
                onClick={handleLike}
              >
                <ThumbsUp className="h-5" />
                Like
              </div>
              <Separator orientation="vertical" />
              <div
                className="text-center w-full cursor-pointer hover:bg-[#262626] transition-all duration-200 rounded-md py-2 flex items-center justify-center gap-1"
                onClick={handleComment}
              >
                <MessageSquareMore className="h-5" />
                Comment
              </div>
              <Separator orientation="vertical" />
              
            </div>
          </div>
          {CommentBoxOpen && <AddComment />}
        </div>
      </CardFooter>
    </div>
  );
}

export default PostCardFooter;
