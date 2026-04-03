"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

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
        transform: visible ? "translateY(0)" : "translateY(28px)",
      }}
      className="transition-all duration-700"
    >
      {children}
    </div>
  );
}

export default function CTASection() {
  const router = useRouter();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&display=swap');
        @keyframes spinSlow { to { transform: translate(-50%,-50%) rotate(360deg); } }
        .cta-spin {
          animation: spinSlow 22s linear infinite;
          background: conic-gradient(
            from 0deg,
            transparent 0deg,
            rgba(37,99,235,0.09) 60deg,
            transparent 120deg,
            rgba(99,102,241,0.09) 180deg,
            transparent 240deg,
            rgba(37,99,235,0.05) 300deg,
            transparent 360deg
          );
        }
        .btn-cta-white:hover {
          background: #EFF6FF;
          color: #2563EB;
          transform: translateY(-3px);
          box-shadow: 0 0 60px rgba(255,255,255,0.1);
        }
        .btn-cta-white { transition: all 0.25s; }
      `}</style>

      <section
        className="py-32 md:py-40 px-6 text-center relative overflow-hidden"
        style={{ background: "#080C14" }}
      >
        {/* Spinning conic glow */}
        <div
          className="cta-spin absolute w-[800px] h-[800px] rounded-full pointer-events-none"
          style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}
        />

        <div className="relative z-10 max-w-[720px] mx-auto">
          <Reveal>
            <h2
              style={{
                fontFamily: "'Sora', sans-serif",
                letterSpacing: "-2.5px",
              }}
              className="text-[clamp(36px,5vw,64px)] font-extrabold text-white leading-[1.05] mb-6"
            >
              Ready to actually
              <br />
              organize your life?
            </h2>
          </Reveal>

          <Reveal delay={100}>
            <p className="text-[18px] text-slate-500 mb-14">
              Join thousands of Cambodian students who already have their
              academic life under control.
            </p>
          </Reveal>

          <Reveal delay={200}>
            <button
              onClick={() => router.push("/register")}
              className="btn-cta-white inline-flex items-center gap-3 bg-white text-[#080C14] px-12 py-5 rounded-2xl font-bold text-[17px]"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              Create Your Free Account
              <span>→</span>
            </button>
          </Reveal>

          <Reveal delay={300}>
            <p className="mt-5 text-[13px] text-slate-700">
              Takes less than 30 seconds · No credit card needed
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
