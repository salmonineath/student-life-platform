import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  GraduationCap,
} from "lucide-react";

const AdminSidebar = () => {
  // Navigation items array for easy management
  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    { name: "Users management", icon: Users, href: "/users" },
    { name: "Settings", icon: Settings, href: "/settings" },
  ];

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-slate-300 text-slate-300 flex flex-col z-50">
      {/* 1. Logo Section */}
      <div className="p-6 flex items-center gap-3">
        <div className="bg-blue-500 p-2 rounded-lg">
          <GraduationCap className="text-white w-6 h-6" />
        </div>
        <span className="text-xl font-bold text-black tracking-tight">
          Welcome
        </span>
      </div>

      {/* 2. Navigation Menu */}
      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-500 transition-all group"
          >
            <item.icon className="w-5 h-5 text-black group-hover:text-white" />
            <span className="font-medium text-sm text-black hover:text-white group-hover:text-white">
              {item.name}
            </span>
          </Link>
        ))}
      </nav>

      {/* 3. Bottom Logout Button */}
      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center justify-center gap-3 w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold transition-all shadow-lg shadow-blue-900/20 text-sm cursor-pointer">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
