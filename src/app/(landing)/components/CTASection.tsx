"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function CTASection() {
  useEffect(() => {
    AOS.init({ once: true, duration: 700, easing: "ease-out" });
  }, []);

  return (
    <section className="py-28 px-6 bg-slate-900 text-white">
      <div className="max-w-2xl mx-auto text-center">
        <h2 data-aos="fade-up" className="text-5xl font-bold tracking-tight">
          Ready to take control of your university life?
        </h2>

        <p
          data-aos="fade-up"
          data-aos-delay="100"
          className="mt-6 text-xl text-slate-400"
        >
          Join thousands of Cambodian students already organizing their academic
          life better.
        </p>

        <div data-aos="fade-up" data-aos-delay="200">
          <button className="mt-10 bg-white text-slate-900 hover:bg-blue-50 hover:scale-[1.03] px-12 py-5 rounded-3xl font-semibold text-xl transition-all active:scale-95 shadow-lg">
            Create Your Free Account
          </button>
        </div>

        <p
          data-aos="fade-up"
          data-aos-delay="250"
          className="mt-6 text-sm text-slate-500"
        >
          Takes less than 30 seconds • No credit card needed
        </p>
      </div>
    </section>
  );
}
