"use client";
import { useState, useEffect } from "react";
import BloodDonationPosts from "@/components/BloodDonationDisplayPost";
import DefaultLayout from "@/components/DefaultLayout";

function page() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/posts/blood-donation/");
        const data = await res.json();
        console.log("Fetched Data:", data); // Log the data
        setPosts(data);
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
          <BloodDonationPosts post={post} key={post.post_id} />
        ))}
      </div>
    </DefaultLayout>
  );
}

export default page;