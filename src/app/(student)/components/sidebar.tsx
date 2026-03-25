import React from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  CalendarDays, 
  ClipboardList, 
  Users, 
  StickyNote, 
  BotMessageSquare, 
  Settings, 
  LogOut,
  GraduationCap
} from 'lucide-react';

const Sidebar = () => {
  // Navigation items array for easy management
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Schedule', icon: CalendarDays, href: '/schedule' },
    { name: 'Assignment', icon: ClipboardList, href: '/assignment' },
    { name: 'Study Group', icon: Users, href: '/groups' },
    { name: 'Notes', icon: StickyNote, href: '/notes' },
    { name: 'AI Chat', icon: BotMessageSquare, href: '/chat' },
    { name: 'Settings', icon: Settings, href: '/settings' },
  ];

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-[#0F172A] text-slate-300 flex flex-col z-50">
      
      {/* 1. Logo Section */}
      <div className="p-6 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg">
          <GraduationCap className="text-white w-6 h-6" />
        </div>
        <span className="text-xl font-bold text-white tracking-tight">Welcome</span>
      </div>

      {/* 2. Navigation Menu */}
      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-all group"
          >
            <item.icon className="w-5 h-5 text-slate-400 group-hover:text-blue-400" />
            <span className="font-medium text-sm">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* 3. Bottom Logout Button */}
      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center justify-center gap-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all shadow-lg shadow-blue-900/20 text-sm">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;