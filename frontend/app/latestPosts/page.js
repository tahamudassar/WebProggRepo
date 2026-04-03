"use client";  // This marks the file as a client component

import { useEffect, useState } from 'react';  // Import necessary hooks
import StudyPosts from "@/components/StudyDisplayPost";
import CarPoolPosts from "@/components/CarPoolDisplayPost";
import BloodDonationPosts from "@/components/BloodDonationDisplayPost";

function PostList() {
  const [posts, setPosts] = useState([]);  // State to hold posts
  const [loading, setLoading] = useState(true);  // State to track loading state

  useEffect(() => {
    // Function to fetch posts from the backend
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/posts/latest/');  // Replace with your backend URL
        const data = await response.json();
        setPosts(data);  // Set the posts state with the fetched data
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);  // Set loading to false after the data is fetched
      }
    };

    fetchPosts();  // Call the fetch function
  }, []);  // Empty dependency array means it runs once on component mount

  // If posts are still loading, show a loading message
  if (loading) {
    return <div>Loading posts...</div>;
  }

  return (
    <>
      {posts.map((post) => {
        // Conditional rendering based on post.community_id
        switch (post.community) {
          case 1:
            // If community_id is 1, render StudyPostDisplay
            return <StudyPosts key={post.id} post={post} />;
          
          case 2:
            // If community_id is 2, render CarPoolPostDisplay
            return <CarPoolPosts key={post.id} post={post} />;
          
          case 3:
            // If community_id is 3, render BloodDonationPostDisplay
            return <BloodDonationPosts key={post.id} post={post} />;
          
          default:
            // If community_id is not 1, 2, or 3, you can choose to render nothing or a default component
            return <div key={post.id}>No suitable community found for this post.</div>;
        }
      })}
    </>
  );
}

export default PostList;
