"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import CustomCardHeader from "./CustomCardHeader";
import CustomCardFooter from "./CustomCardFooter";

function StudyGuide() {
  return (
    <Card>
      <CustomCardHeader
        title="Ask a Question!"
        description="Ask anything regarding studies."
      />
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Label htmlFor="studytitle">Title</Label>
          <Input id="studytitle" type="text" required />
        </div>
        <div className="space-y-1 flex flex-col">
          <Label htmlFor="studyquestion">Question</Label>
          <Textarea
            placeholder="Type your message here."
            id="studyquestion"
            className="resize-none"
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="questionlink">Question Link</Label>
          <Input id="questionlink" type="url" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="questionimage">Upload Image</Label>
          <Input
            id="questionimage"
            type="file"
            accept="image/*"
            // onChange={handleQuestionImage}
          />
        </div>
      </CardContent>
      <CustomCardFooter buttontext="Ask Now" />
    </Card>
  );
}

export default StudyGuide;
