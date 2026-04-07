"use client";
import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { ThumbsUp, MessageSquareMore } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AddReply from "./AddReply";

function DisplayComment({ comment, postId }) {
  const [Replybox, setReplybox] = useState(false);
  const [userDetails, setUserDetails] = useState(null); // To store fetched user details

  const handleReply = () => {
    setReplybox(!Replybox);
  };

  // Fetch user details when component mounts
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/user/${comment.user}/`);
        if (response.ok) {
          const data = await response.json();
          setUserDetails(data); // Store fetched user details
        } else {
          console.error("Error fetching user details:", response.status);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [comment.user]); // Run effect when comment.user changes

  // Handle new comment submission and update UI immediately
  const handleNewComment = async (newCommentContent) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("http://localhost:8000/api/addComment/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          post_id: postId,
          content: newCommentContent,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Immediately add the new comment to the list without needing to refetch all comments
        setUserDetails({
          ...userDetails,
          comments: [...userDetails.comments, data.comment], // Add new comment to local state
        });
      } else {
        console.error("Error adding new comment:", response.status);
      }
    } catch (error) {
      console.error("Error adding new comment:", error);
    }
  };

  return (
    <div className="mb-2">
      <Card className="w-full bg-sub-color my-2 p-2 flex items-center justify-start gap-3">
        {/* Display the user's profile image if available */}
        <Avatar>
          {userDetails?.profile_image ? (
            <AvatarImage src={userDetails.profile_image} alt={userDetails.username} />
          ) : (
            <AvatarFallback>
              {userDetails?.username
                ? userDetails.username[0].toUpperCase() + userDetails.username[1].toUpperCase()
                : "FL"}
            </AvatarFallback>
          )}
        </Avatar>

        {/* Display the username next to the avatar */}
        <div className="ml-2 text-sm font-semibold">{userDetails?.username}</div>

        {/* Display the comment content */}
        <p>🗣️:</p>
        <div className="text-[14px]">{comment.content}</div>
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
          <AddReply onSubmit={handleNewComment} /> {/* Pass the handleNewComment to AddReply */}
        </div>
      )}
    </div>
  );
}

export default DisplayComment;
