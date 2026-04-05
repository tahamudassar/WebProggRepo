"use client";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import DisplayComment from "./DisplayComment";

function AddComment({ postId, placeholder = "Add a comment..." }) {
  const [Comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  console.log(postId,"postId");
  const handleInputChange = (e) => {
    setComment(e.target.value);
  };
  
  const handlePostComment = async () => {
    if (!Comment.trim()) return;

    try {
      setIsLoading(true);
      const token = localStorage.getItem("accessToken");
      console.log(token,"token")
      
      const response = await fetch("http://localhost:8000/api/createComment/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the authentication token
        },
        body: JSON.stringify({
          content: Comment,
          post: postId, // Include the post ID
        }),
      });

      if (response.ok) {
        const newComment = await response.json();
        setComments((prevComments) => [...prevComments, newComment]);
        setComment(""); // Clear the input field
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
      {comments.map((cmt, index) => (
        <DisplayComment key={index} comment={cmt.content} />
      ))}
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
