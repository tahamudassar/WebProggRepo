import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/App-Sidebar";
import Header from "@/components/CustomHeader";
import { RightSidebar } from "./Right-Sidebar";

const DefaultLayout = ({ children }) => {
  return (
    <div>
      <Header />
      <div className="relative ">
        <SidebarProvider
          style={{
            "--sidebar-width": "15rem",
            "--sidebar-width-mobile": "10rem",
          }}
        >
          <AppSidebar />
          <main className="mx-auto max-w-[1200px] w-full relative overflow-hidden mt-10 ">
            {children}
          </main>
          <RightSidebar side="right" />
        </SidebarProvider>
      </div>
    </div>
  );
};

export default DefaultLayout;
