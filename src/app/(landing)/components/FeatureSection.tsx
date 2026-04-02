"use client";

import { useEffect, useRef, useState } from "react";

const FEATURES = [
  {
    icon: "📅",
    iconBg: "bg-blue-100",
    title: "Smart Schedule",
    description:
      "Weekly timetable with your classes. Add, edit, and get smart reminders so you never miss a lecture.",
    delay: "delay-[0ms]",
  },
  {
    icon: "📝",
    iconBg: "bg-amber-100",
    title: "Assignment Tracker",
    description:
      "Never miss a deadline again. Track assignments, set due dates, mark as done, and see everything at a glance.",
    delay: "delay-[100ms]",
  },
  {
    icon: "👥",
    iconBg: "bg-emerald-100",
    title: "Study Groups",
    description:
      "Create or join study groups for your subjects. Chat, share files, and collaborate easily.",
    delay: "delay-[200ms]",
  },
];

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

export default function Features() {
  return (
    <section id="features" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <FadeUp>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900">
              Manage Your Student Life in One Place
            </h2>
            <p className="mt-4 text-slate-600 text-lg">
              Plan your schedule, track assignments, and study with friends
              without stress.
            </p>
          </div>
        </FadeUp>

        <div className="grid md:grid-cols-3 gap-8">
          {FEATURES.map((f) => (
            <FadeUp key={f.title} delay={f.delay}>
              <div className="bg-white border border-slate-100 rounded-3xl p-8 hover:border-blue-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group h-full">
                <div
                  className={`w-12 h-12 ${f.iconBg} rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  {f.icon}
                </div>
                <h3 className="text-2xl font-semibold text-slate-900">
                  {f.title}
                </h3>
                <p className="mt-3 text-slate-600 leading-relaxed">
                  {f.description}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
