"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const FEATURES = [
  {
    icon: "📅",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    title: "Smart Schedule",
    description:
      "Weekly timetable with your classes. Add, edit, and get smart reminders so you never miss a lecture.",
    delay: 0,
  },
  {
    icon: "📝",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    title: "Assignment Tracker",
    description:
      "Never miss a deadline again. Track assignments, set due dates, mark as done, and see everything at a glance.",
    delay: 100,
  },
  {
    icon: "👥",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    title: "Study Groups",
    description:
      "Create or join study groups for your subjects. Chat, share files, and collaborate easily.",
    delay: 200,
  },
];

export default function Features() {
  useEffect(() => {
    AOS.init({ once: true, duration: 700, easing: "ease-out" });
  }, []);

  return (
    <section id="features" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl font-bold text-slate-900">
            Manage Your Student Life in One Place
          </h2>
          <p className="mt-4 text-slate-600 text-lg">
            Plan your schedule, track assignments, and study with friends
            without stress.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              data-aos="fade-up"
              data-aos-delay={f.delay}
              className="bg-white border border-slate-100 rounded-3xl p-8 hover:border-blue-200 hover:shadow-lg transition-all group"
            >
              <div
                className={`w-12 h-12 ${f.iconBg} rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform`}
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
          ))}
        </div>
      </div>
    </section>
  );
}
