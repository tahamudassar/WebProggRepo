import * as React from "react";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { ProfileSkeleton } from "./UserProfileSkeleton";

export function RightSidebar({ ...props }) {
  return (
    <Sidebar {...props} className="mt-10 ">
      <SidebarContent className="gap-5 mt-10">
        <div className="flex flex-col gap-2 mx-1 border-gray-700/50 border-b-[1px] pb-4">
          <ProfileSkeleton/>
          <ProfileSkeleton/>
          <ProfileSkeleton/>
          <ProfileSkeleton/>
          <ProfileSkeleton/>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
