import React from "react";
import CarPoolPosts from "./CarPoolDisplayPost";
import BloodDonationPosts from "./BloodDonationDisplayPost";

function DisplayPosts() {
  return (
    <div>
      {/* i am displying all posts */}
     
      <BloodDonationPosts />
      
      <BloodDonationPosts />
      
      <BloodDonationPosts />
    </div>
  );
}

export default DisplayPosts;
