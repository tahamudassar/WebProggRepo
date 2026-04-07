"use client";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

function AddComment({ postId, onNewComment, placeholder = "Add a comment..." }) {
  const [Comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setComment(e.target.value);
  };

  const handlePostComment = async () => {
    if (!Comment.trim()) return;

    try {
      setIsLoading(true);
      const token = localStorage.getItem("accessToken");

      const response = await fetch("http://localhost:8000/api/createComment/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: Comment,
          post: postId,
        }),
      });

      if (response.ok) {
        const newComment = await response.json();
        setComment(""); // Clear the input field

        // Pass the new comment to parent to update the comment list
        onNewComment(newComment);
      } else {
        const errorData = await response.json();
        console.error("Error posting comment:", errorData);
      }
    } catch (error) {
      console.error("Error in handlePostComment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-5">
      <div className="py-1">
        <Input
          type="text"
          placeholder={placeholder}
          className="rounded-lg"
          name="newComment"
          value={Comment}
          onChange={handleInputChange}
        />
      </div>
      <Button
        className="float-right px-4 py-0 text-[12px] h-7 rounded-2xl"
        onClick={handlePostComment}
        disabled={isLoading}
      >
        {isLoading ? "Posting..." : "Post"}
      </Button>
    </div>
  );
}

export default AddComment;
