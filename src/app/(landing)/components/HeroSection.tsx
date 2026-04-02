import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-illustration.jpg";

const WORDS = ["schedule", "assignments", "study groups", "AI tools"];

export default function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const navigate = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % WORDS.length);
        setFading(false);
      }, 300);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const base = "transition-all duration-700";
  const show = "opacity-100 translate-y-0";
  const hide = "opacity-0 translate-y-4";

  return (
    <section className="pt-28 pb-16 md:pt-36 md:pb-24 px-6 bg-gradient-hero overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-card border border-border px-4 py-1.5 rounded-full mb-6 shadow-soft"
            >
              <span className="text-xs font-bold text-primary uppercase tracking-[2px]">
                Now in Beta
              </span>
              <div className="w-px h-3 bg-border" />
              <p className="text-sm text-foreground/70 font-medium flex items-center gap-1">
                Built for Cambodian Students{" "}
                <span className="text-base">🇰🇭</span>
              </p>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground leading-[1.08] tracking-tight"
            >
              One app for your entire{" "}
              <span className="text-gradient-primary">university life</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 h-10 flex items-center justify-center md:justify-start"
            >
              <span className="text-xl sm:text-2xl font-semibold text-foreground/70 tracking-tight">
                Your{" "}
                <span
                  className="text-primary font-bold inline-block min-w-[140px] text-left transition-all duration-300"
                  style={{
                    opacity: fading ? 0 : 1,
                    transform: fading ? "translateY(-6px)" : "translateY(0)",
                  }}
                >
                  {WORDS[wordIndex]}
                </span>
                , sorted.
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-5 text-lg text-foreground/60 max-w-lg leading-relaxed"
            >
              No more jumping between apps and platforms. Student Life keeps
              your schedule, assignments, study groups, and AI tools all in one
              place.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="mt-8 flex flex-col sm:flex-row gap-3 justify-center md:justify-start"
            >
              <button
                onClick={() => navigate.push("/register")}
                className="group relative bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3.5 rounded-2xl font-semibold text-base shadow-glow transition-all active:scale-[0.97] overflow-hidden"
              >
                <span className="absolute inset-0 -skew-x-12 -translate-x-full group-hover:translate-x-full bg-primary-foreground/15 transition-transform duration-700 w-3/5" />
                <span className="relative">Start for Free</span>
              </button>
              <button className="group border-2 border-border hover:border-primary/40 px-6 py-3.5 rounded-2xl font-medium text-base text-foreground transition-all flex items-center gap-2 justify-center bg-card">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <svg
                    className="w-3.5 h-3.5 text-primary"
                    viewBox="0 0 12 12"
                    fill="currentColor"
                  >
                    <path d="M2 1.5l8 4.5-8 4.5V1.5z" />
                  </svg>
                </span>
                Watch 1-min demo
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-8 text-sm text-foreground/60 flex items-center justify-center md:justify-start gap-5 font-medium"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-primary font-bold">✓</span> Free to use
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-primary font-bold">✓</span> Made for
                Cambodian universities
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="hidden md:block"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/8 rounded-[2rem] blur-2xl" />
              <img
                src={heroImage}
                alt="Students collaborating together"
                className="relative w-full rounded-3xl shadow-soft animate-float border border-border"
                width={1280}
                height={800}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
