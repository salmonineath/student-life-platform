"use client";

import { Bell, MessageCircle, Search } from "lucide-react";

const TopNav = () => {
  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
      {/* 1. Page Title */}
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800"></h1>
      </div>

      {/* 2. Right Side Actions (Search, Notifications, Profile) */}
      <div className="flex items-center gap-6">
        {/* Icons Group */}
        <div className="flex items-center gap-3">
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative">
            <Bell className="w-6 h-6" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
            <MessageCircle className="w-6 h-6" />
          </button>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-800 leading-none">
              Sal Monineath
            </p>
            <p className="text-xs text-gray-500 mt-1">Year 3 Student</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-blue-50 overflow-hidden">
            {/* Replace with an actual image tag later */}
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
