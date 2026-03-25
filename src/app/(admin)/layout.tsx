import React from "react";
import AdminSidebar from "./components/adminSidebar";
import AdminHeader from "./components/adminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 h-full">
        <AdminSidebar />
      </div>

      {/* Right Side */}
      <div className="flex-1 flex flex-col h-full">
        {/* Header (NOT fixed) */}
        <div className="h-16 flex-shrink-0 bg-white border-b">
          <AdminHeader />
        </div>

        {/* Content (starts BELOW header automatically) */}
        <main className="flex-1 overflow-y-auto p-8 ">{children}</main>
      </div>
    </div>
  );
}
