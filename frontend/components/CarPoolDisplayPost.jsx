import { Card, CardContent } from "@/components/ui/card";
import PostCardHeader from "./PostCardHeader";
import PostCardFooter from "./PostCardFooter";

function CarPoolPosts() {
  return (
    <Card className="w-full bg-sub-color mb-2 border-none overflow-hidden">
      <PostCardHeader />
      <CardContent className="gap-4">
        <h3 className="font-extrabold text-2xl mb-2">Travel Buddy Wanted!</h3>
        <p className="text-[14px] leading-7">
          Hello! I’m looking for a carpool from BWP to LHR at 12 p.m .
          <br />
          👫Preferred Gender: Female
          <br />
          🚘 Seats Required: 1
          <br />
          🚘 Preffered Vehicle: Car
          <br />
          If you’re headed the same way, let’s connect for a safer and more
          cost-effective trip! 🌟
        </p>
      </CardContent>
      <PostCardFooter />
    </Card>
  );
}

export default CarPoolPosts;
