"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

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

export default function CTASection() {
  const router = useRouter();

  return (
    <section className="py-28 px-6 bg-slate-900 text-white">
      <div className="max-w-2xl mx-auto text-center">
        <FadeUp>
          <h2 className="text-5xl font-bold tracking-tight">
            Ready to take control of your university life?
          </h2>
        </FadeUp>

        <FadeUp delay="delay-[100ms]">
          <p className="mt-6 text-xl text-slate-400">
            Join thousands of Cambodian students already organizing their
            academic life better.
          </p>
        </FadeUp>

        <FadeUp delay="delay-[200ms]">
          <button
            onClick={() => router.push("/register")}
            className="mt-10 bg-white text-slate-900 hover:bg-blue-50 hover:scale-[1.03] px-12 py-5 rounded-3xl font-semibold text-xl transition-all duration-200 active:scale-95 shadow-lg"
          >
            Create Your Free Account
          </button>
        </FadeUp>

        <FadeUp delay="delay-[250ms]">
          <p className="mt-6 text-sm text-slate-500">
            Takes less than 30 seconds • No credit card needed
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
