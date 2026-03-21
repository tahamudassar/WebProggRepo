import React from "react";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
function CustomCardFooter({ buttontext = "Ask Now" }) {
  return (
    <CardFooter>
      <Button type="submit">{buttontext}</Button>
    </CardFooter>
  );
}

export default CustomCardFooter;
