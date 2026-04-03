"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "AI Tools", href: "#ai" },
  { label: "For Students", href: "#for-students" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const scrollToSection = (href: string) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes fadeInOverlay { from { opacity: 0; } to { opacity: 1; } }
        .mobile-drawer  { animation: slideInRight 0.32s cubic-bezier(0.32,0.72,0,1) forwards; }
        .mobile-overlay { animation: fadeInOverlay 0.25s ease forwards; }
        .nav-link-underline::after {
          content: ''; display: block;
          height: 2px; width: 0;
          background: #2563EB;
          border-radius: 99px;
          transition: width 0.25s ease;
        }
        .nav-link-underline:hover::after { width: 100%; }
      `}</style>

      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-sm border-b border-black/5"
            : "bg-white/70 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-[68px] flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 bg-[#080C14] rounded-[10px] flex items-center justify-center text-lg">
              🎓
            </div>
            <span
              style={{ fontFamily: "'Sora', sans-serif" }}
              className="font-bold text-base text-[#080C14] tracking-tight"
            >
              Student Life
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-9">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="nav-link-underline text-sm font-medium text-slate-500 hover:text-[#080C14] transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => router.push("/login")}
              className="text-sm font-medium text-slate-500 hover:text-[#080C14] px-4 py-2 rounded-lg hover:bg-slate-100 transition-all"
            >
              Login
            </button>
            <button
              onClick={() => router.push("/register")}
              className="text-sm font-semibold text-white bg-[#080C14] hover:bg-[#2563EB] px-5 py-2.5 rounded-xl transition-all duration-200 hover:-translate-y-px hover:shadow-lg hover:shadow-blue-500/20"
            >
              Get Started Free
            </button>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <>
          <div
            className="mobile-overlay fixed inset-0 z-40 bg-black/25 backdrop-blur-sm md:hidden"
            onClick={() => setOpen(false)}
          />
          <div className="mobile-drawer fixed top-0 right-0 bottom-0 z-50 w-[80%] max-w-[300px] bg-white shadow-2xl flex flex-col md:hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-black/5">
              <Link
                href="/"
                className="flex items-center gap-2.5"
                onClick={() => setOpen(false)}
              >
                <div className="w-8 h-8 bg-[#080C14] rounded-[10px] flex items-center justify-center text-base">
                  🎓
                </div>
                <span className="font-bold text-[#080C14]">Student Life</span>
              </Link>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            <div className="flex-1 px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="py-3 px-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#080C14] transition-colors text-left"
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="px-4 pb-6 pt-3 border-t border-black/5 flex flex-col gap-2">
              <button
                onClick={() => {
                  setOpen(false);
                  router.push("/login");
                }}
                className="w-full py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setOpen(false);
                  router.push("/register");
                }}
                className="w-full bg-[#080C14] hover:bg-[#2563EB] text-white py-3 rounded-xl font-semibold text-sm transition-all duration-200"
              >
                Get Started Free
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
