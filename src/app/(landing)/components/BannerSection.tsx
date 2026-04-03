"use client";

import { useEffect, useRef, useState } from "react";

function Reveal({
  children,
  direction = "up",
  delay = 0,
}: {
  children: React.ReactNode;
  direction?: "up" | "left" | "right";
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const base = "transition-all duration-700";
  const hidden: Record<string, string> = {
    up: "opacity-0 translate-y-10",
    left: "opacity-0 -translate-x-10",
    right: "opacity-0 translate-x-10",
  };
  const shown = "opacity-100 translate-y-0 translate-x-0";

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`${base} ${visible ? shown : hidden[direction]}`}
    >
      {children}
    </div>
  );
}

const UNIVERSITIES = ["CADT", "ITC", "RUPP", "UEC", "AUPP", "PUC"];

export default function BannerSection() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&display=swap');
        .uni-card:hover {
          border-color: #BFDBFE;
          background: #EFF6FF;
          color: #2563EB;
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(37,99,235,0.12);
        }
        .uni-card { transition: all 0.25s cubic-bezier(.16,1,.3,1); }
      `}</style>

      <section
        id="for-students"
        className="py-24 md:py-32 px-6 relative overflow-hidden"
        style={{ background: "#F4F7FF" }}
      >
        {/* Decorative glow */}
        <div
          className="absolute right-[-200px] top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%)",
          }}
        />

        <div className="max-w-[1160px] mx-auto relative z-10 grid md:grid-cols-2 gap-16 md:gap-24 items-center">
          {/* Left text */}
          <Reveal direction="left">
            <span className="block text-[12px] font-bold uppercase tracking-[2px] text-[#2563EB] mb-4">
              For Students
            </span>
            <h2
              style={{
                fontFamily: "'Sora', sans-serif",
                letterSpacing: "-2px",
              }}
              className="text-[clamp(32px,4vw,52px)] font-extrabold text-[#080C14] leading-[1.1] mb-6"
            >
              Built for
              <br />
              university life
              <br />
              in Cambodia.
            </h2>
            <p className="text-[17px] text-slate-500 leading-[1.75]">
              Managing university is hard when everything is scattered across
              Telegram, Facebook groups, and notebooks. Student Life brings it
              all into one clean, reliable platform — built with Cambodian
              students in mind.
            </p>
          </Reveal>

          {/* Right university grid */}
          <Reveal direction="right">
            <div className="grid grid-cols-3 gap-3">
              {UNIVERSITIES.map((uni) => (
                <div
                  key={uni}
                  className="uni-card bg-white border-[1.5px] border-black/8 rounded-2xl py-5 flex items-center justify-center cursor-default"
                  style={{ fontFamily: "'Sora', sans-serif" }}
                >
                  <span className="text-[18px] font-bold text-[#080C14]">
                    {uni}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
