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
            <Label htmlFor="name">Pickup Point</Label>
            <Input id="name" defaultValue="Pedro Duarte" />
          </div>
          <div className="space-y-1 w-full">
            <Label htmlFor="username">Dropoff Point</Label>
            <Input id="username" defaultValue="@peduarte" />
          </div>
        </div>
      </CardContent>
      <CustomCardFooter buttontext="Find Ride Partner" />
    </Card>
  );
}

export default CarPool;
