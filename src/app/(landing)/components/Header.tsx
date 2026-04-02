import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "AI Tools", href: "#ai" },
  { label: "For Students", href: "#for-students" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

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
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-soft border-b border-border"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-primary rounded-2xl flex items-center justify-center text-lg">
              🎓
            </div>
            <span className="font-bold text-lg text-foreground tracking-tight">
              Student Life
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-foreground/70">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="hover:text-primary transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary rounded-full group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="text-foreground/70 hover:text-foreground font-semibold px-4 py-2 transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-2xl font-semibold text-sm transition-all active:scale-95 shadow-glow"
            >
              Get Started Free
            </button>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden p-2 rounded-xl text-foreground hover:bg-muted transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[80%] max-w-[300px] bg-white shadow-2xl flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <Link
                  to="/"
                  className="flex items-center gap-2.5"
                  onClick={() => setOpen(false)}
                >
                  <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-base">
                    🎓
                  </div>
                  <span className="font-semibold text-foreground tracking-tight">
                    Student Life
                  </span>
                </Link>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-xl text-foreground hover:bg-muted transition-colors"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => scrollToSection(link.href)}
                    className="py-3 px-3 rounded-xl text-sm font-semibold text-foreground hover:bg-muted transition-colors text-left"
                  >
                    {link.label}
                  </button>
                ))}
              </div>

              <div className="px-4 pb-6 pt-3 border-t border-border flex flex-col gap-2">
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate("/login");
                  }}
                  className="w-full py-2.5 rounded-2xl text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate("/register");
                  }}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-2xl font-semibold text-sm transition-all active:scale-95"
                >
                  Get Started Free
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
