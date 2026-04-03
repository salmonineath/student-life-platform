"use client";

import { useEffect, useRef, useState } from "react";

function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
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

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
      }}
      className="transition-all duration-700"
    >
      {children}
    </div>
  );
}

export default function AIToolsSection() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&display=swap');
        .ai-card-glow::after {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(96,165,250,0.5), transparent);
          opacity: 0; transition: opacity 0.3s;
        }
        .ai-card-glow:hover::after { opacity: 1; }
        .ai-card-glow:hover { background: rgba(255,255,255,0.06) !important; border-color: rgba(96,165,250,0.3) !important; transform: translateY(-4px); }
        .ai-card-glow { transition: all 0.35s cubic-bezier(.16,1,.3,1); }
      `}</style>

      <section
        id="ai"
        className="py-24 md:py-32 px-6 relative overflow-hidden"
        style={{ background: "#080C14" }}
      >
        {/* Dot-grid texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="max-w-[1160px] mx-auto relative z-10">
          {/* Header */}
          <Reveal>
            <div className="max-w-[600px] mb-16">
              <span className="block text-[12px] font-bold uppercase tracking-[2px] text-[#60A5FA] mb-4">
                ✦ AI Features
              </span>
              <h2
                style={{
                  fontFamily: "'Sora', sans-serif",
                  letterSpacing: "-2px",
                }}
                className="text-[clamp(32px,4vw,52px)] font-extrabold text-white leading-[1.1] mb-5"
              >
                Study smarter,
                <br />
                not harder.
              </h2>
              <p className="text-[17px] text-slate-500 leading-[1.75]">
                Powerful AI tools built right in — always optional, never
                overwhelming.
              </p>
            </div>
          </Reveal>

          {/* Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Card 1 */}
            <Reveal delay={0}>
              <div
                className="ai-card-glow relative rounded-3xl p-10 overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <span
                  className="block text-[64px] font-extrabold leading-none mb-2 select-none"
                  style={{
                    fontFamily: "'Sora', sans-serif",
                    color: "rgba(255,255,255,0.04)",
                  }}
                >
                  01
                </span>
                <h3
                  style={{ fontFamily: "'Sora', sans-serif" }}
                  className="text-[22px] font-bold text-white mb-4"
                >
                  AI Study Plan Generator
                </h3>
                <p className="text-[15px] text-slate-500 leading-[1.7] mb-6">
                  Create an assignment, click "Generate Plan". Get a
                  personalized daily breakdown of what to study and when — built
                  around your actual deadlines.
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Accept or edit freely",
                    "Works with deadlines",
                    "Adjusts automatically",
                  ].map((chip) => (
                    <span
                      key={chip}
                      className="text-[12px] font-semibold px-3 py-1.5 rounded-full"
                      style={{
                        background: "rgba(96,165,250,0.1)",
                        color: "#60A5FA",
                        border: "1px solid rgba(96,165,250,0.2)",
                      }}
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Card 2 */}
            <Reveal delay={100}>
              <div
                className="ai-card-glow relative rounded-3xl p-10 overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <span
                  className="block text-[64px] font-extrabold leading-none mb-2 select-none"
                  style={{
                    fontFamily: "'Sora', sans-serif",
                    color: "rgba(255,255,255,0.04)",
                  }}
                >
                  02
                </span>
                <h3
                  style={{ fontFamily: "'Sora', sans-serif" }}
                  className="text-[22px] font-bold text-white mb-4"
                >
                  AI Chat Tutor & Summarizer
                </h3>
                <p className="text-[15px] text-slate-500 leading-[1.7] mb-6">
                  Upload your notes, ask questions, get step-by-step solutions,
                  or have the AI summarize your entire lecture in seconds.
                </p>
                <div
                  className="rounded-xl px-5 py-4 text-[14px] italic leading-relaxed"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    borderLeft: "3px solid #2563EB",
                    color: "#64748B",
                  }}
                >
                  "Explain Newton's second law with real examples from Cambodia"
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
