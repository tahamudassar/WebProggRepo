"use client";
import { useState } from "react";
import { CardFooter } from "@/components/ui/card";
import { Separator } from "./ui/separator";
import { ThumbsUp, MessageSquareMore } from "lucide-react";
import AddComment from "./AddComment";
import DisplayComment from "./DisplayComment";

function PostCardFooter({ postId, userId, likesCount, alreadyLiked }) {
  const [CommentBoxOpen, setCommentBoxOpen] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(likesCount);
  const [isLiked, setIsLiked] = useState(alreadyLiked);
  const [comments, setComments] = useState([]);

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
        setCurrentLikes(data.updated_like_count);
        setIsLiked(!isLiked);
      } else {
        const errorData = await response.json();
        console.error("Error toggling like:", errorData);
      }
    } catch (error) {
      console.error("Error in handleLike:", error);
    }
  };

  const handleComment = async () => {
    setCommentBoxOpen(!CommentBoxOpen);

    if (!CommentBoxOpen) {
      try {
        const response = await fetch(`http://localhost:8000/api/fetchComments/${postId}/`);
        if (response.ok) {
          const data = await response.json();
          setComments(data); // Set the fetched comments in the state
        } else {
          const errorData = await response.json();
          console.error("Error fetching comments:", errorData);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    } else {
      setComments([]);
    }
  };

  // Handle the new comment and update the state immediately
  const handleNewComment = (newComment) => {
    setComments((prevComments) => [newComment, ...prevComments]);
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
                <ThumbsUp />
                Like ({currentLikes})
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
          {CommentBoxOpen && <AddComment postId={postId} onNewComment={handleNewComment} />}
        </div>
      </CardFooter>

      {CommentBoxOpen && comments.length > 0 && (
        <div>
          {comments.map((comment) => (
            <DisplayComment key={comment.id} comment={comment} postId={postId} />
          ))}
        </div>
      )}
    </div>
  );
}

export default PostCardFooter;
