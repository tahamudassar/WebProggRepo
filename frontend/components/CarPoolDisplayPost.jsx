"use client"; // Add this directive at the top of the file

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import PostCardHeader from "./PostCardHeader";
import PostCardFooter from "./PostCardFooter";
import { apiUrl } from "@/lib/api";

function CarPoolPosts({ post }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user details using the user_id from the post
    fetch(apiUrl(`/api/user/${post.user}/`)) // Assuming `post.user` holds the user_id
      .then((response) => response.json())
      .then((data) => setUser(data))
      .catch((error) => console.error("Error fetching user details:", error));
  }, [post.user]);

  return (
    <Card className="w-full bg-sub-color mb-2 border-none overflow-hidden">
      {user ? <PostCardHeader user={user} /> : <div>Loading user info...</div>}
      <CardContent className="gap-4">
        <h3 className="font-extrabold text-2xl mb-2">Travel Buddy Wanted!</h3>
        <p className="text-[14px] leading-7">
          Hello! I’m looking for a carpool from {post.pickup_point} to{" "}
          {post.dropoff_point}.
          <br />
          👫Preferred Gender: {post.preferred_gender}
          <br />
          🚘 Seats Required: {post.capacity}
          <br />
          🕰️ Pickup Time: {post.pickup_time}
          <br />
          If you’re headed the same way, let’s connect for a safer and more
          cost-effective trip! 🌟
        </p>
      </CardContent>
      <PostCardFooter postId={post.post_id} userId={post.user} likesCount={post.likes_count} />
    </Card>
  );
}

export default CarPoolPosts;
