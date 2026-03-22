import { Card, CardContent } from "@/components/ui/card";
import PostCardHeader from "./PostCardHeader";
import PostCardFooter from "./PostCardFooter";

function BloodDonationPosts() {
  return (
    <Card className="w-full bg-sub-color mb-2 border-none overflow-hidden">
      <PostCardHeader />
      <CardContent className="gap-4">
        <h3 className="font-extrabold text-2xl mb-2">Be Someone’s Lifeline!</h3>
        <p className="text-[14px] leading-7">
          Immediate Call for Blood Donation!
          <br />
          Blood Type Required: A+
          <br />
          Urgency Level: High
          <br />
          Time Frame: Today
          <br />
          Your small act of kindness could save someone’s life. 🙏
        </p>
      </CardContent>
      <PostCardFooter />
    </Card>
  );
}

export default BloodDonationPosts;
