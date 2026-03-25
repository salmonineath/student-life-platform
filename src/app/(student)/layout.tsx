import React from 'react';
import Sidebar from './components/sidebar';
import TopNav from './components/topnav';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 1. Left Sidebar (Fixed width) */}
      <Sidebar />

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 ml-64 flex flex-col">
        
        {/* 3. Top Navigation Bar */}
        <TopNav />

        {/* 4. Page Content (This changes based on the URL) */}
        <main className="p-8">
          {children}
        </main>
        
      </div>
    </div>
  );
}
