"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const WORDS = ["schedule", "assignments", "study groups", "AI tools"];

export default function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Trigger entrance animation after mount
  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  // Typewriter rotation
  useEffect(() => {
    const id = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % WORDS.length);
        setFading(false);
      }, 320);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&display=swap');

        .hero-dot-grid {
          background-image: radial-gradient(circle, #CBD5E1 1px, transparent 1px);
          background-size: 28px 28px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
        }
        .hero-blob {
          background: radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%);
          animation: blobPulse 6s ease-in-out infinite;
        }
        @keyframes blobPulse {
          0%,100% { transform: translate(-50%,-50%) scale(1);    opacity: 0.8; }
          50%      { transform: translate(-50%,-52%) scale(1.08); opacity: 1; }
        }
        .btn-shimmer::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%);
          transform: translateX(-100%);
        }
        .btn-shimmer:hover::after { transform: translateX(100%); transition: transform 0.6s; }
        .tw-word { transition: opacity 0.32s ease, transform 0.32s ease; }
        .tw-word.out { opacity: 0; transform: translateY(-8px); }

        /* Staggered entrance */
        .hero-item { opacity: 0; transform: translateY(28px); transition: opacity 0.7s cubic-bezier(.16,1,.3,1), transform 0.7s cubic-bezier(.16,1,.3,1); }
        .hero-item.show { opacity: 1; transform: translateY(0); }
      `}</style>

      <section className="relative min-h-screen flex items-center justify-center text-center px-6 overflow-hidden bg-white pt-[68px]">
        {/* Dot-grid texture */}
        <div className="hero-dot-grid absolute inset-0 opacity-50 pointer-events-none" />

        {/* Blue glow blob */}
        <div
          className="hero-blob absolute w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}
        />

        <div className="relative z-10 max-w-4xl mx-auto py-20">
          {/* Badge */}
          <div
            className={`hero-item ${mounted ? "show" : ""}`}
            style={{ transitionDelay: "0ms" }}
          >
            <span className="inline-flex items-center gap-2 bg-white border border-black/8 shadow-sm px-4 py-1.5 rounded-full text-sm font-medium text-slate-500 mb-8">
              <span className="inline-flex items-center gap-1.5 bg-[#2563EB] text-white text-[11px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse inline-block" />
                Beta
              </span>
              Built for Cambodian University Students 🇰🇭
            </span>
          </div>

          {/* Headline */}
          <div
            className={`hero-item ${mounted ? "show" : ""}`}
            style={{ transitionDelay: "100ms" }}
          >
            <h1
              style={{
                fontFamily: "'Sora', sans-serif",
                letterSpacing: "-3px",
              }}
              className="text-[clamp(42px,7vw,80px)] font-extrabold text-[#080C14] leading-[1.02] mb-7"
            >
              One app for your entire
              <br />
              <span className="text-[#2563EB]">university life</span>
            </h1>
          </div>

          {/* Typewriter line */}
          <div
            className={`hero-item ${mounted ? "show" : ""}`}
            style={{ transitionDelay: "200ms" }}
          >
            <p className="text-[clamp(17px,2.5vw,22px)] text-slate-400 font-light mb-12 leading-relaxed">
              Your{" "}
              <span
                className={`tw-word text-[#080C14] font-semibold border-b-2 border-[#2563EB] ${fading ? "out" : ""}`}
              >
                {WORDS[wordIndex]}
              </span>{" "}
              — finally under control.
            </p>
          </div>

          {/* CTAs */}
          <div
            className={`hero-item ${mounted ? "show" : ""} flex flex-col sm:flex-row gap-4 justify-center mb-14`}
            style={{ transitionDelay: "300ms" }}
          >
            <button
              onClick={() => router.push("/register")}
              className="btn-shimmer relative overflow-hidden inline-flex items-center gap-2 bg-[#080C14] hover:bg-[#2563EB] text-white px-9 py-4 rounded-2xl font-semibold text-[15px] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/25"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              Start for Free
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </button>
            <button className="inline-flex items-center gap-3 bg-white border-[1.5px] border-black/8 text-[#080C14] px-8 py-4 rounded-2xl font-medium text-[15px] hover:border-blue-200 hover:bg-slate-50 transition-all duration-200">
              <span className="w-8 h-8 rounded-full bg-[#080C14] flex items-center justify-center text-white text-[10px]">
                ▶
              </span>
              Watch 1-min demo
            </button>
          </div>

          {/* Trust row */}
          <div
            className={`hero-item ${mounted ? "show" : ""} flex flex-wrap gap-6 justify-center text-sm text-slate-400`}
            style={{ transitionDelay: "400ms" }}
          >
            {["Free to use", "Made for Cambodia", "No credit card"].map((t) => (
              <span key={t} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
