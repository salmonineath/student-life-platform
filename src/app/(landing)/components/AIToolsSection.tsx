"use client";

import { useEffect, useRef, useState } from "react";

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

export default function AIToolSection() {
  return (
    <section id="ai" className="py-24 px-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <FadeUp>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-1 rounded-full text-sm font-medium mb-4">
              ✨ Optional AI Features
            </div>
            <h2 className="text-4xl font-bold text-slate-900">
              Study smarter with AI
            </h2>
            <p className="mt-4 text-slate-600 text-lg max-w-xl mx-auto">
              Use AI when you need. Stay in full control over your learning.
            </p>
          </div>
        </FadeUp>

        <div className="grid md:grid-cols-2 gap-8">
          <FadeUp delay="delay-[0ms]">
            <div className="bg-white rounded-3xl p-10 border border-slate-100 hover:border-blue-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
              <h3 className="text-2xl font-semibold">
                AI Study Plan Generator
              </h3>
              <p className="mt-4 text-slate-600">
                Create an assignment → click "Generate Study Plan". Get a
                personalized breakdown of what to study and when.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-slate-600">
                <li>✅ Accept, edit, or ignore the plan</li>
                <li>✅ Works with your real deadlines</li>
              </ul>
            </div>
          </FadeUp>

          <FadeUp delay="delay-[100ms]">
            <div className="bg-white rounded-3xl p-10 border border-slate-100 hover:border-blue-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
              <h3 className="text-2xl font-semibold">
                AI Chat Tutor + Summarizer
              </h3>
              <p className="mt-4 text-slate-600">
                Upload notes, ask questions, get step-by-step solutions, or ask
                the AI to summarize your lecture.
              </p>
              <div className="mt-8 p-6 bg-slate-50 rounded-2xl text-sm border border-slate-200 text-slate-500 italic">
                "Explain Newton's second law with examples from daily life in
                Cambodia"
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
