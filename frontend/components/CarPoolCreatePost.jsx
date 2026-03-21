import React from "react";
import CustomCardHeader from "./CustomCardHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CustomCardFooter from "./CustomCardFooter";

function CarPool() {
  return (
    <Card>
      <CustomCardHeader
        title="Car Pool"
        description="Find a partner for a safe journey!"
      />
      <CardContent className="space-y-2">
        <div className="flex items-center justify-center gap-4">
          <div className="space-y-1 w-full">
            <Label htmlFor="pickup">Pickup Point</Label>
            <Input id="pickup" defaultValue="Bahawalpur" />
          </div>
          <div className="space-y-1 w-full">
            <Label htmlFor="dropoff">Dropoff Point</Label>
            <Input id="dropoff" defaultValue="Siraiki Town" />
          </div>
        </div>
        <div className="flex items-center justify-center gap-4">
          <div className="space-y-1 w-full">
            <Label htmlFor="picktime">Pickup Time</Label>
              <input
                id="picktime"
                type="datetime-local"
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
          </div>
          <div className="space-y-1 w-full">
            <label htmlFor="gender"  
            className="block text-black-300 font-semibold">Gender</label>
            <select
              id="gender"
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </CardContent>
      <CustomCardFooter buttontext="Find Ride Partner" />
    </Card>
  );
}

export default CarPool;
