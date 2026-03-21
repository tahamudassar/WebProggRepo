'use client';
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import CustomCardHeader from "./CustomCardHeader";
import CustomCardFooter from "./CustomCardFooter";

function StudyGuide({ community }) { // Accept community as a prop
  const [formData, setFormData] = useState({
    studytitle: "",
    studyquestion: "",
    questionlink: "",
    questionimage: null,
  });

  // Handle input changes for text, URL, and textarea
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Handle file input for image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      questionimage: file,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare the data to be sent to the backend
    const formDataToSend = new FormData();
    formDataToSend.append("studytitle", formData.studytitle);
    formDataToSend.append("studyquestion", formData.studyquestion);
    formDataToSend.append("questionlink", formData.questionlink);
    if (formData.questionlink) {
      formDataToSend.append("questionlink", formData.questionlink);
    }
    if (formData.questionimage) {
      formDataToSend.append("questionimage", formData.questionimage);
    }
    formDataToSend.append("community", community); // Add the community to the request

      // Example: Sending formDataToSend to the backend
      const token = localStorage.getItem('accessToken');
      console.log(token)
      // Perform the fetch with FormData
      fetch('http://localhost:8000/api/createStudyPost', {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`, // Include JWT token in header
        },
        body: formDataToSend,  // Send the FormData directly as the body
      })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        // Reset form after successful submission
        setFormData({
          studytitle: "",
          studyquestion: "",
          questionlink: "",
          questionimage: null,
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CustomCardHeader
          title="Ask a Question!"
          description="Ask anything regarding studies."
        />
        <CardContent className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor="studytitle">Title</Label>
            <Input
              id="studytitle"
              type="text"
              value={formData.studytitle}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-1 flex flex-col">
            <Label htmlFor="studyquestion">Question</Label>
            <Textarea
              id="studyquestion"
              placeholder="Type your message here."
              value={formData.studyquestion}
              onChange={handleInputChange}
              className="resize-none"
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="questionlink">Question Link</Label>
            <Input
              id="questionlink"
              type="url"
              value={formData.questionlink}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="questionimage">Upload Image</Label>
            <Input
              id="questionimage"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        </CardContent>
        <CustomCardFooter buttontext="Ask Now" />
      </form>
    </Card>
  );
}

export default StudyGuide;
