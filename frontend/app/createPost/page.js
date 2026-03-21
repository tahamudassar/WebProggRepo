'use client'
import React from "react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import StudyGuide from "@/components/StudyGuideCreatePost.jsx"
import CarPool from "@/components/CarPoolCreatePost";
import BloodDonation from "@/components/BloodDonationCreatePost";


function PostType() {
    return (
        <div className="w-full p-5">
            <Tabs defaultValue="studyGuide" className="w-full bg-color">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="studyGuide">Study Guide</TabsTrigger>
                    <TabsTrigger value="carPool">Car Pool</TabsTrigger>
                    <TabsTrigger value="bloodDonation">Blood Donation</TabsTrigger>
                </TabsList>
                <TabsContent value="studyGuide">
                    <StudyGuide />
                </TabsContent>
                <TabsContent value="carPool">
                    <CarPool />
                </TabsContent>
                <TabsContent value="bloodDonation">
                    <BloodDonation />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default PostType