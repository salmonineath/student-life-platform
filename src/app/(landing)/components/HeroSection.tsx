"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TypeAnimation } from "react-type-animation";
import { motion } from "motion/react";
import { AnimatedBackground } from "./AnimatedBackground";

const ROTATING_WORDS = [
  "schedule",
  "assignments",
  "study groups",
  "AI tools",
];

export default function HeroSection() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center text-center px-6 overflow-hidden bg-white pt-[68px]">
      {/* Dot grid background */}
      {/* <div className="absolute inset-0 opacity-50 pointer-events-none hero-dot-grid" /> */}
      <AnimatedBackground/>

      <div className="relative z-10 max-w-4xl mx-auto py-20">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isMounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 bg-white border border-black/8 shadow-sm px-4 py-1.5 rounded-full text-sm font-medium text-slate-500">
            <span className="inline-flex items-center gap-1.5 bg-[#2563EB] text-white text-[11px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
              Beta
            </span>
            Built for Cambodian University Students 🇰🇭
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={isMounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          style={{ fontFamily: "'Sora', sans-serif", letterSpacing: "-3px" }}
          className="text-[clamp(42px,7vw,80px)] font-extrabold text-[#080C14] leading-[1.02] mb-6"
        >
          One app for your entire
          <br />
          <span className="text-[#2563EB]">university life</span>
        </motion.h1>

        {/* Interactive rotating line — feels more alive */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isMounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
          className="mb-12"
        >
          <p className="text-[clamp(17px,2.5vw,22px)] text-slate-400 font-light leading-relaxed">
            Your{" "}
            <span className="text-[#080C14] font-semibold border-b-2 border-[#2563EB] pb-0.5">
              <TypeAnimation
                sequence={[
                  ...ROTATING_WORDS.flatMap((word) => [word, 1800]),
                ]}
                wrapper="span"
                speed={55}
                deletionSpeed={40}
                repeat={Infinity}
                cursor={true}
              />
            </span>{" "}
            — finally under control.
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isMounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-14"
        >
          <motion.button
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/register")}
            className="group relative overflow-hidden inline-flex items-center gap-2 bg-[#080C14] hover:bg-[#2563EB] text-white px-9 py-4 rounded-2xl font-semibold text-[15px] transition-all duration-200 shadow-xl shadow-blue-500/20"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            Start for Free
            <span className="group-hover:translate-x-1 transition-transform">→</span>
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </motion.button>

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-3 bg-white border border-black/8 hover:border-blue-200 hover:bg-slate-50 text-[#080C14] px-8 py-4 rounded-2xl font-medium text-[15px] transition-all"
          >
            <span className="w-8 h-8 rounded-full bg-[#080C14] flex items-center justify-center text-white text-xs">
              ▶
            </span>
            Watch 1-min demo
          </motion.button>
        </motion.div>

        {/* Trust signals */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isMounted ? { opacity: 1 } : {}}
          transition={{ delay: 0.55 }}
          className="flex flex-wrap gap-6 justify-center text-sm text-slate-400"
        >
          {["Free to use", "Made for Cambodia", "No credit card"].map((text) => (
            <div key={text} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {text}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}