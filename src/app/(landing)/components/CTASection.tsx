"use client";

import { motion } from "motion/react";
import { usePageTransition } from "@/app/PageTransitionProvider";
import Reveal from "./Reveal";

const AVATARS = [
  { initial: "D", color: "#3B82F6" },
  { initial: "S", color: "#10B981" },
  { initial: "R", color: "#F59E0B" },
  { initial: "V", color: "#6366F1" },
  { initial: "K", color: "#EC4899" },
];

export default function CTASection() {
  const { navigate } = usePageTransition();

  return (
    <section
      className="py-32 md:py-40 px-6 text-center relative overflow-hidden"
      style={{ background: "#080C14" }}
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Glow orbs */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 500, height: 500,
          top: "50%", left: "50%",
          translate: "-50% -50%",
          background: "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 65%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 320, height: 320,
          top: "30%", left: "60%",
          background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 65%)",
          filter: "blur(30px)",
        }}
      />

      <div className="relative z-10 max-w-[680px] mx-auto">

        {/* Avatar stack */}
        <Reveal>
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="flex -space-x-2.5">
              {AVATARS.map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.7, x: -10 }}
                  whileInView={{ opacity: 1, scale: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-white text-[12px] font-bold"
                  style={{ background: a.color, borderColor: "#080C14" }}
                >
                  {a.initial}
                </motion.div>
              ))}
            </div>
            <p className="text-[13px] text-slate-500">
              Students from <span className="text-slate-300 font-semibold">CADT, EHT & more</span> already here
            </p>
          </div>
        </Reveal>

        {/* Headline */}
        <Reveal delay={60}>
          <h2
            className="font-sora text-[clamp(34px,5vw,62px)] font-extrabold text-white leading-[1.07] mb-5"
            style={{ letterSpacing: "-2.5px" }}
          >
            No more exam panic.
            <br />
            <span className="text-[#60A5FA]">Start organized.</span>
          </h2>
        </Reveal>

        <Reveal delay={120}>
          <p className="text-[17px] text-slate-500 mb-12 leading-[1.75]">
            Everything you need for a successful semester —
            schedule, assignments, groups, and AI — all free, forever.
          </p>
        </Reveal>

        {/* CTA button */}
        <Reveal delay={180}>
          <motion.button
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/register")}
            className="font-sora group relative overflow-hidden inline-flex items-center gap-3 bg-white text-[#080C14] px-12 py-5 rounded-2xl font-bold text-[17px] shadow-[0_0_60px_rgba(255,255,255,0.08)] hover:shadow-[0_0_80px_rgba(96,165,250,0.15)] transition-all duration-300"
          >
            Create Your Free Account
            <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </motion.button>
        </Reveal>

        <Reveal delay={240}>
          <p className="mt-5 text-[13px] text-slate-600">
            Takes less than 30 seconds · No credit card · Free forever
          </p>
        </Reveal>
      </div>
    </section>
  );
}
