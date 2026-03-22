"use client";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import DisplayComment from "./DisplayComment";

function AddReply() {
  const [Reply, setReply] = useState("");
  const [hideBox, sethideBox] = useState(false);
  const [replies, setReplies] = useState([]);

  const handleInputChange = (e) => {
    setReply(e.target.value);
  };

  const handlePostReply = () => {
    if (Reply.trim()) {
      setReplies((prevReplies) => [...prevReplies, Reply]);
      setReply("");
      sethideBox(true);
    }
  };

  return (
    <div className="mt-5">
      {replies.map((cmt, index) => (
        <DisplayComment key={index} comment={cmt} />
      ))}
      {!hideBox && (
        <div>
          <div className="py-1">
            <Input
              type="text"
              placeholder="Add a reply..."
              className="rounded-lg "
              name="newReply"
              value={Reply}
              onChange={handleInputChange}
            />
          </div>
          <Button
            className="float-right px-4 py-0 text-[12px] h-7 rounded-2xl"
            onClick={handlePostReply}
          >
            Post
          </Button>
        </div>
      )}
    </div>
  );
}

export default AddReply;
