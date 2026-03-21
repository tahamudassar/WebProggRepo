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
        <div className="space-y-1">
          <Label htmlFor="current">Current password</Label>
          <Input id="current" type="password" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="new">New password</Label>
          <Input id="new" type="password" />
        </div>
      </CardContent>
      <CustomCardFooter buttontext="Find a Donor" />
    </Card>
  );
}

export default BloodDonation;
