"use client";

import { useEffect, useRef, useState } from "react";

const UNIVERSITIES = ["CADT", "ITC", "RUPP", "UEC", "AUPP", "PUC"];

function FadeUp({
  children,
  delay = "",
}: {
  children: React.ReactNode;
  delay?: string;
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
      { threshold: 0.15 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${delay} ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
    >
      {children}
    </div>
  );
}

export default function BannerSection() {
  return (
    <section id="for-students" className="py-24 px-6 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <FadeUp>
          <h2 className="text-4xl font-bold text-slate-900">
            Built for University Students
          </h2>
        </FadeUp>

        <FadeUp delay="delay-[100ms]">
          <p className="mt-8 text-lg text-slate-600 leading-relaxed">
            Managing university life is difficult when information is scattered
            across Telegram, Facebook groups, and notebooks.
          </p>
        </FadeUp>

        <FadeUp delay="delay-[150ms]">
          <p className="mt-4 text-slate-600">
            Student Life brings everything together into one simple, clean, and
            reliable platform.
          </p>
        </FadeUp>

        <FadeUp delay="delay-[200ms]">
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {UNIVERSITIES.map((uni, i) => (
              <span
                key={uni}
                className="px-4 py-1.5 rounded-full border border-slate-200 text-sm font-medium text-slate-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 hover:scale-105 transition-all duration-200 cursor-default"
                style={{ transitionDelay: `${i * 40}ms` }}
              >
                {uni}
              </span>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
