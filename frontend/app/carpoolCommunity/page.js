"use client";
import { useState, useEffect } from "react";
import CarPoolPosts from "@/components/CarPoolDisplayPost";
import DefaultLayout from "@/components/DefaultLayout";
import { apiUrl, asArray } from "@/lib/api";

function Page() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(apiUrl("/api/posts/carpool/"));
        const data = await res.json();
        console.log("Fetched Data:", data); // Log the data
        setPosts(asArray(data));
      } catch (error) {
        console.error("Failed to fetch posts:", error.message);
      }
    };
  
    fetchPosts();
  }, []);
  return (
    <DefaultLayout>
      <div className="relative w-full mt-10 px-5">
        {posts.map((post) => (
          <CarPoolPosts post={post} key={post.post_id} />
        ))}
      </div>
    </DefaultLayout>
  );
}

export default Page;
