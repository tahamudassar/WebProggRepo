"use client";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import DisplayComment from "./DisplayComment";

function AddComment({placeholder = "Add a comment..."}) {
  const [Comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  const handleInputChange = (e) => {
    setComment(e.target.value);
  };

  const handlePostComment = () => {
    if (Comment.trim()) {
      setComments((prevComments) => [...prevComments, Comment]);
      setComment("");
    }
  };

  return (
    <div className="mt-5">
      {comments.map((cmt, index) => (
        <DisplayComment key={index} comment={cmt} />
      ))}
      <div className="py-1">
        <Input
          type="text"
          placeholder={placeholder}
          className="rounded-lg "
          name="newComment"
          value={Comment}
          onChange={handleInputChange}
        />
      </div>
      <Button
        className="float-right px-4 py-0 text-[12px] h-7 rounded-2xl"
        onClick={handlePostComment}
      >
        Post
      </Button>
    </div>
  );
}

export default AddComment;
