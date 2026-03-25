"use client";

import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const WORDS = ["schedule", "assignments", "study groups", "AI tools"];

export default function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    AOS.init({ once: true, duration: 700, easing: "ease-out" });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % WORDS.length);
        setFading(false);
      }, 300);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="pt-32 pb-24 px-6 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-5xl mx-auto text-center">
        <div
          data-aos="fade-down"
          className="inline-flex items-center gap-2 bg-white border border-blue-100 px-4 py-1.5 rounded-3xl mb-6 shadow-sm"
        >
          <span className="text-xs font-bold text-blue-600 uppercase tracking-[2px]">
            Now in Beta
          </span>
          <div className="w-px h-3 bg-blue-200" />
          <p className="text-sm text-slate-600 font-medium flex items-center gap-1">
            Built for Cambodian University Students{" "}
            <span className="text-base">🇰🇭</span>
          </p>
        </div>

        <h1
          data-aos="fade-up"
          data-aos-delay="100"
          className="text-5xl md:text-7xl font-bold text-slate-900 leading-[1.05] tracking-tighter max-w-4xl mx-auto"
        >
          One app for your entire
          <br />
          <span className="text-blue-600">university life</span>
        </h1>

        <div
          data-aos="fade-up"
          data-aos-delay="150"
          className="mt-4 h-10 flex items-center justify-center"
        >
          <span className="text-2xl md:text-3xl font-semibold text-slate-400 tracking-tight">
            Your{" "}
            <span
              className="text-blue-500 inline-block min-w-[180px] text-left transition-all duration-300"
              style={{
                opacity: fading ? 0 : 1,
                transform: fading ? "translateY(-6px)" : "translateY(0)",
              }}
            >
              {WORDS[wordIndex]}
            </span>
            , sorted.
          </span>
        </div>

        <p
          data-aos="fade-up"
          data-aos-delay="200"
          className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed"
        >
          Stop jumping between Telegram, Facebook groups, and notebooks. Manage
          your schedule, assignments, study groups, and AI-powered study tools —
          all in one beautiful place.
        </p>

        <div
          data-aos="fade-up"
          data-aos-delay="250"
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button className="group relative bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-3xl font-semibold text-lg shadow-xl shadow-blue-200 transition-all active:scale-[0.97] overflow-hidden">
            <span className="absolute inset-0 -skew-x-12 -translate-x-full group-hover:translate-x-full bg-white/20 transition-transform duration-700 w-3/5" />
            <span className="relative">Start for Free</span>
          </button>
          <button className="group border border-slate-300 hover:border-blue-300 px-8 py-4 rounded-3xl font-medium text-lg text-slate-700 transition-all flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 group-hover:bg-blue-100 transition-colors">
              <svg
                className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-600 transition-colors"
                viewBox="0 0 12 12"
                fill="currentColor"
              >
                <path d="M2 1.5l8 4.5-8 4.5V1.5z" />
              </svg>
            </span>
            Watch 1-min demo
          </button>
        </div>

        <div
          data-aos="fade-up"
          data-aos-delay="300"
          className="mt-10 text-xs text-slate-500 flex items-center justify-center gap-6"
        >
          <div>✓ Free to use</div>
          <div>✓ Made for Cambodian universities</div>
          {/* <div>✓ Free to use</div> */}
        </div>
      </div>
    </section>
  );
}
