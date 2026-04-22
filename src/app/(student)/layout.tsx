"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./components/sidebar";
import TopNav from "./components/topnav";
import ClientAuthWrapper from "@/app/ClientAuthWrapper";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isChat = pathname?.startsWith("/group");

  return (
    <ClientAuthWrapper>
      <div className="min-h-screen bg-gray-100 flex">
        <Sidebar />

        <div className="flex-1 ml-64 flex flex-col">
          <TopNav />

          {isChat ? (
            // Chat page: no padding, fills exactly the remaining height, no scroll
            <div className="flex-1 overflow-hidden">
              {children}
            </div>
          ) : (
            <main className="p-6">{children}</main>
          )}
        </div>
      </div>
    </ClientAuthWrapper>
  );
}