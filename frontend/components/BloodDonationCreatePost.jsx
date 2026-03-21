import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CustomCardHeader from "./CustomCardHeader";
import CustomCardFooter from "./CustomCardFooter";

function BloodDonation() {
  return (
    <Card>
      <CustomCardHeader
        title="Blood Donation"
        description="Find & Donate to save lives!"
      />
      <CardContent className="space-y-2">
        <div className="space-y-1 w-full">
          <label htmlFor="bloodType" className="block text-black-300 font-semibold">Blood Type</label>
            <select
              id="bloodType"
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
        </div>
        <div className="space-y-1 w-full">
          <label htmlFor="urgency" className="block text-black-300 font-semibold">Urgency</label>
            <select
              id="urgency"
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
        </div>
        <div className="space-y-1 w-full">
          <label htmlFor="requiredWithin" className="block text-black-300 font-semibold">Required Within (Weeks)</label>
            <input
              id="requiredWithin"
              type="number"
              min="1"   
              max="8"  
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter number of weeks (1-8)"
            />
        </div>
      </CardContent>
      <CustomCardFooter buttontext="Find a Donor" />
    </Card>
  );
}

export default BloodDonation;
