"use client"; // Add this directive at the top of the file

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import PostCardHeader from "./PostCardHeader";
import PostCardFooter from "./PostCardFooter";

function StudyPosts({ post }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user details using the user_id from the post
    fetch(`http://localhost:8000/api/user/${post.user}/`) // Assuming `post.user` holds the user_id
      .then((response) => response.json())
      .then((data) => setUser(data))
      .catch((error) => console.error("Error fetching user details:", error));
  }, [post.user]);

  return (
    <Card className="w-full bg-sub-color mb-2 border-none overflow-hidden">
      {user ? <PostCardHeader user={user} /> : <div>Loading user info...</div>}
      <CardContent className="gap-4">
        <h3 className="font-extrabold text-2xl mb-2">Lets Study Together!</h3>
        <p className="text-[14px] leading-7">
          Hello! I have a question from {post.main_topic} and {" "} would appereciate if someone could help me with it.
          <br />
          🏫Question: {post.question_asked}
          <br />
          Link: {post.link_url ? post.link_url : "None"}
          <br />
        </p>
      </CardContent>
      <PostCardFooter postId={post.post_id} userId={post.user} likesCount={post.likes_count} />
    </Card>
  );
}

export default StudyPosts;
