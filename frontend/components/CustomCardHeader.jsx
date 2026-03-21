import React from "react";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function CustomCardHeader({ title, description }) {
  return (
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
  );
}

export default CustomCardHeader;
