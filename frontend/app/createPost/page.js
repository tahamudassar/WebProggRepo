'use client';
import React, { useState } from "react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import StudyGuide from "@/components/StudyGuideCreatePost.jsx";
import CarPool from "@/components/CarPoolCreatePost";
import BloodDonation from "@/components/BloodDonationCreatePost";
import DefaultLayout from "@/components/DefaultLayout";

function PostType() {
    const [activeTab, setActiveTab] = useState("studyGuide"); // Track active tab state

    // Handle tab change and set active tab
    const handleTabChange = (value) => {
        setActiveTab(value);
    };

    return (
        <DefaultLayout>
            <div className="w-full p-5">
                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full mt-5">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="studyGuide">Study Guide</TabsTrigger>
                        <TabsTrigger value="carPool">Car Pool</TabsTrigger>
                        <TabsTrigger value="bloodDonation">Blood Donation</TabsTrigger>
                    </TabsList>
                    <TabsContent value="studyGuide">
                        <StudyGuide community="Study Guide" />
                    </TabsContent>
                    <TabsContent value="carPool">
                        <CarPool community="Carpool" />
                    </TabsContent>
                    <TabsContent value="bloodDonation">
                        <BloodDonation community="Blood Donation" />
                    </TabsContent>
                </Tabs>
            </div>
        </DefaultLayout>
    );
}

export default PostType;
