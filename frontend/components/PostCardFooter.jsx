"use client";
import { useState } from "react";
import { CardFooter } from "@/components/ui/card";
import { Separator } from "./ui/separator";
import { ThumbsUp, MessageSquareMore } from "lucide-react";
import AddComment from "./AddComment";

function PostCardFooter({ postId, userId, likesCount, alreadyLiked }) {
  const [CommentBoxOpen, setCommentBoxOpen] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(likesCount);
  const [isLiked, setIsLiked] = useState(alreadyLiked); // Set initial liked state based on props

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("http://localhost:8000/api/toggleLike/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          post_id: postId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);

        // Update the likes count with the value returned by the server
        setCurrentLikes(data.updated_like_count);

        // Toggle like/unlike state
        setIsLiked(!isLiked);
      } else {
        const errorData = await response.json();
        console.error("Error toggling like:", errorData);
      }
    } catch (error) {
      console.error("Error in handleLike:", error);
    }
  };

  const handleComment = () => {
    setCommentBoxOpen(!CommentBoxOpen);
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
                <ThumbsUp/>
                Like ({currentLikes}) {/* Display the current likes */}
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
