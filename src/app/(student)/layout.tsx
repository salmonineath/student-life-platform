import React from "react";
import Sidebar from "./components/sidebar";
import TopNav from "./components/topnav";
import ClientAuthWrapper from "@/app/ClientAuthWrapper";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientAuthWrapper>
      <div className="min-h-screen bg-gray-100 flex">
        {/* Left Sidebar (Fixed width) */}
        <Sidebar />

        {/* Main Content Wrapper */}
        <div className="flex-1 ml-64 flex flex-col">
          {/* Top Navigation Bar */}
          <TopNav />

          {/* Page Content */}
          <main className="p-6">{children}</main>
        </div>
      </div>
    </ClientAuthWrapper>
  );
}