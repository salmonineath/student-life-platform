"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const WORDS = ["schedule", "assignments", "study groups", "AI tools"];

export default function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

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
    <section className="pt-32 pb-24 px-6 bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
      <div className="max-w-5xl mx-auto text-center">
        <div
          className={`${base} delay-[0ms] ${visible ? show : hide} inline-flex items-center gap-2 bg-white border border-blue-100 px-4 py-1.5 rounded-3xl mb-6 shadow-sm`}
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
          className={`${base} delay-[100ms] ${visible ? show : hide} text-5xl md:text-7xl font-bold text-slate-900 leading-[1.05] tracking-tighter max-w-4xl mx-auto`}
        >
          One app for your entire
          <br />
          <span className="text-blue-600">university life</span>
        </h1>

        <div
          className={`${base} delay-[150ms] ${visible ? show : hide} mt-4 h-10 flex items-center justify-center`}
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
          className={`${base} delay-[200ms] ${visible ? show : hide} mt-6 text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed`}
        >
          No more jumping between apps. Student Life keeps your schedule,
          assignments, study groups, and AI tools all in one place.
        </p>

        <div
          className={`${base} delay-[250ms] ${visible ? show : hide} mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center`}
        >
          <button
            onClick={() => router.push("/register")}
            className="group relative bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-3xl font-semibold text-lg shadow-xl shadow-blue-200 transition-all duration-200 active:scale-[0.97] overflow-hidden"
          >
            <span className="absolute inset-0 -skew-x-12 -translate-x-full group-hover:translate-x-full bg-white/20 transition-transform duration-700 w-3/5" />
            <span className="relative">Start for Free</span>
          </button>
          <button className="group border border-slate-300 hover:border-blue-300 px-8 py-4 rounded-3xl font-medium text-lg text-slate-700 transition-all duration-200 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 group-hover:bg-blue-100 transition-colors duration-200">
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
          className={`${base} delay-[300ms] ${visible ? show : hide} mt-10 text-xs text-slate-500 flex items-center justify-center gap-6`}
        >
          <div>✓ Free to use</div>
          <div>✓ Made for Cambodian universities</div>
        </div>
      </div>
    </section>
  );
}
