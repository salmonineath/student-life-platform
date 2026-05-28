"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ComingSoon() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex flex-col">
      {/* Animated gradient blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/20 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/20 blur-[120px] animate-pulse delay-1000" />
      <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] rounded-full bg-fuchsia-600/10 blur-[100px] animate-pulse delay-500" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-white/40 hover:text-white text-sm transition-all duration-300"
        >
          <span className="inline-block group-hover:-translate-x-1 transition-transform duration-300">←</span>
          <span className="tracking-wide">Go Back</span>
        </button>
        <span className="text-white/20 text-xs tracking-[0.3em] uppercase">Lumière</span>
        <div className="w-20" />
      </nav>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 text-center">

        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 border border-white/10 bg-white/5 backdrop-blur-sm rounded-full px-4 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          <span className="text-white/50 text-xs tracking-widest uppercase">In Development</span>
        </div>

        {/* Heading */}
        <h1 className="text-[clamp(56px,10vw,140px)] font-black leading-none tracking-tighter text-white mb-4">
          Coming
          <br />
          <span
            className="text-transparent bg-clip-text"
            style={{
              backgroundImage: "linear-gradient(135deg, #a78bfa 0%, #818cf8 40%, #f0abfc 100%)",
            }}
          >
            Soon.
          </span>
        </h1>

        {/* Subtext */}
        <p className="text-white/30 text-lg max-w-md leading-relaxed mb-12">
          We&apos;re building something worth waiting for.
          Drop your email and we&apos;ll let you know the moment it&apos;s live.
        </p>

        {/* Email form */}
        {!submitted ? (
          <div className="w-full max-w-md">
            <div className="flex rounded-xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm focus-within:border-violet-500/50 transition-colors duration-300">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && email.trim() && setSubmitted(true)}
                placeholder="Enter your email address"
                className="flex-1 bg-transparent px-5 py-4 text-white placeholder-white/20 outline-none text-sm"
              />
              <button
                onClick={() => email.trim() && setSubmitted(true)}
                className="m-1.5 px-5 rounded-lg font-semibold text-sm text-white transition-all duration-300 hover:opacity-90 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #6366f1)",
                }}
              >
                Notify Me
              </button>
            </div>
            <p className="text-white/15 text-xs mt-3">No spam. Unsubscribe anytime.</p>
          </div>
        ) : (
          <div className="flex items-center gap-3 border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-sm rounded-xl px-8 py-4">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5L4 7L8 3" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-emerald-400 text-sm">You&apos;re on the list — we&apos;ll be in touch.</span>
          </div>
        )}

        {/* Social links */}
        <div className="flex items-center gap-6 mt-16">
          {["Twitter", "Instagram", "LinkedIn"].map((s) => (
            <a
              key={s}
              href="#"
              className="text-white/20 hover:text-white/60 text-xs tracking-widest uppercase transition-colors duration-300"
            >
              {s}
            </a>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center py-6">
        <p className="text-white/10 text-xs tracking-widest uppercase">
          © 2025 Lumière Studio
        </p>
      </div>
    </div>
  );
}