"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "AI Tools", href: "#ai" },
  { label: "For Students", href: "#for-students" },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .drawer  { animation: slideInRight 0.32s cubic-bezier(0.32,0.72,0,1) forwards; }
        .overlay { animation: fadeIn 0.25s ease forwards; }
      `}</style>

      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${
            scrolled
              ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100"
              : "bg-white/70 backdrop-blur-sm"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 bg-blue-600 rounded-2xl flex items-center justify-center text-lg">
              🎓
            </div>
            <span className="font-semibold text-lg sm:text-xl text-slate-900 tracking-tight">
              Student Life
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative py-1 hover:text-slate-900 transition-colors after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => router.push("/login")}
              className="text-slate-700 hover:text-slate-900 font-medium px-4 py-2 transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => router.push("/register")}
              className="bg-slate-900 hover:bg-blue-600 text-white px-5 py-2.5 rounded-2xl font-semibold text-sm transition-all duration-200 active:scale-95"
            >
              Get Started Free
            </button>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden p-2 shrink-0 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {open && (
        <>
          <div
            className="overlay fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
            onClick={() => setOpen(false)}
          />
          <div className="drawer fixed top-0 right-0 bottom-0 z-50 w-[80%] max-w-[280px] bg-white shadow-2xl flex flex-col md:hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <Link
                href="/"
                className="flex items-center gap-2.5"
                onClick={() => setOpen(false)}
              >
                <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-base">
                  🎓
                </div>
                <span className="font-semibold text-slate-900 tracking-tight">
                  Student Life
                </span>
              </Link>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="py-3 px-3 rounded-xl text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="px-4 pb-6 pt-3 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => router.push("/login")}
                className="w-full py-2.5 rounded-2xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => router.push("/register")}
                className="w-full bg-slate-900 hover:bg-blue-600 text-white py-3 rounded-2xl font-semibold text-sm transition-all duration-200 active:scale-95"
              >
                Get Started Free
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;
