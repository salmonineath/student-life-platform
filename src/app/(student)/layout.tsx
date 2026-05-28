"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./components/sidebar";
import TopNav from "./components/topnav";
import ClientAuthWrapper from "@/app/ClientAuthWrapper";

const EXPANDED_W  = 256;
const COLLAPSED_W = 64;

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname   = usePathname();
  const isChat     = pathname?.startsWith("/groups");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    // Prevent the browser from restoring a non-zero scroll position on refresh.
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  const ml = collapsed ? COLLAPSED_W : EXPANDED_W;

  return (
    <ClientAuthWrapper>
      <div className="h-screen bg-gray-100 flex">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />

        {/* Main content — margin auto-adjusts with smooth transition */}
        <div
          className="flex-1 flex flex-col min-h-screen"
          style={{ marginLeft: ml, transition: "margin-left 320ms cubic-bezier(0.22, 1, 0.36, 1)" }}
        >
          <TopNav />

          {isChat ? (
            // Chat: fills remaining height exactly, no padding, no scroll on this container
            <div className="flex-1 overflow-hidden flex flex-col">
              {children}
            </div>
          ) : (
            <main className="p-6 flex-1">{children}</main>
          )}
        </div>
      </div>
    </ClientAuthWrapper>
  );
}