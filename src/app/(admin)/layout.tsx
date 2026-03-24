import type { ReactNode } from "react";
import React from "react";
import AdminSidebar from "./components/adminSidebar";
import AdminHeader from "./components/adminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 1. Left Sidebar (Fixed width) */}
      <AdminSidebar />

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* 3. Top Navigation Bar */}
        <AdminHeader />

        {/* 4. Page Content (This changes based on the URL) */}
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
