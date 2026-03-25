"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const UNIVERSITIES = ["NUM", "ITC", "RUPP", "UEC", "AUPP", "PUC"];

export default function BannerSection() {
  useEffect(() => {
    AOS.init({ once: true, duration: 700, easing: "ease-out" });
  }, []);

  return (
    <section id="for-students" className="py-24 px-6 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 data-aos="fade-up" className="text-4xl font-bold text-slate-900">
          Made for Cambodian university students,
          <br />
          by someone who understands the struggle
        </h2>

        <p
          data-aos="fade-up"
          data-aos-delay="100"
          className="mt-8 text-lg text-slate-600 leading-relaxed"
        >
          We know how hard it is to keep everything organized when information
          is spread across Telegram, Facebook, and paper notebooks.
        </p>

        <p
          data-aos="fade-up"
          data-aos-delay="150"
          className="mt-4 text-slate-600"
        >
          Student Life brings it all together in one clean, fast, and reliable
          platform.
        </p>

        <div
          data-aos="fade-up"
          data-aos-delay="200"
          className="mt-10 flex flex-wrap justify-center gap-3"
        >
          {UNIVERSITIES.map((uni) => (
            <span
              key={uni}
              className="px-4 py-1.5 rounded-full border border-slate-200 text-sm font-medium text-slate-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all"
            >
              {uni}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
