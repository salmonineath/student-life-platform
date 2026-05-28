"use client";

import { createContext, useContext, useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { GraduationCap } from "lucide-react";

// Four phases:
//  idle     → no overlay
//  entering → overlay slides up from bottom; navigate fires when complete
//  holding  → overlay covers screen; waiting for destination page to signal ready
//  exiting  → overlay slides up off screen; unmounts when complete

type Phase = "idle" | "entering" | "holding" | "exiting";

interface TransitionContextType {
  navigate: (href: string) => void;
  transitionReady: () => void;
}

const TransitionContext = createContext<TransitionContextType>({
  navigate: () => {},
  transitionReady: () => {},
});

export const usePageTransition = () => useContext(TransitionContext);

export default function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const pendingHref = useRef<string | null>(null);
  const readyPending = useRef(false);
  const phaseRef = useRef<Phase>("idle");
  phaseRef.current = phase;
  const router = useRouter();

  const navigate = useCallback((href: string) => {
    if (phaseRef.current !== "idle") return;
    pendingHref.current = href;
    readyPending.current = false;
    setPhase("entering");
  }, []);

  // Destination pages call this after their first paint
  const transitionReady = useCallback(() => {
    setPhase((prev) => {
      if (prev === "holding") return "exiting";
      if (prev === "entering") readyPending.current = true;
      return prev;
    });
  }, []);

  // Safety fallback: if a page never calls transitionReady, exit after 900ms
  useEffect(() => {
    if (phase !== "holding") return;
    const t = setTimeout(() => setPhase((p) => (p === "holding" ? "exiting" : p)), 900);
    return () => clearTimeout(t);
  }, [phase]);

  const handleAnimationComplete = useCallback(() => {
    const p = phaseRef.current;
    if (p === "entering") {
      if (pendingHref.current) {
        router.push(pendingHref.current);
        pendingHref.current = null;
      }
      if (readyPending.current) {
        readyPending.current = false;
        setPhase("exiting");
      } else {
        setPhase("holding");
      }
    } else if (p === "exiting") {
      setPhase("idle");
    }
  }, [router]);

  return (
    <TransitionContext.Provider value={{ navigate, transitionReady }}>
      {children}
      {phase !== "idle" && (
        <motion.div
          key="page-transition"
          className="fixed inset-0 z-[9999] flex items-center justify-center select-none pointer-events-all"
          style={{ background: "#080C14" }}
          initial={{ y: "100%" }}
          animate={phase === "exiting" ? { y: "-100%" } : { y: 0 }}
          transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
          onAnimationComplete={handleAnimationComplete}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.82, y: 14 }}
            animate={
              phase === "exiting"
                ? { opacity: 0, scale: 0.9, y: -8 }
                : { opacity: 1, scale: 1, y: 0 }
            }
            transition={
              phase === "exiting"
                ? { duration: 0.18, ease: "easeIn" }
                : { delay: 0.16, duration: 0.38, ease: [0.16, 1, 0.3, 1] }
            }
            className="flex flex-col items-center gap-3"
          >
            <div className="w-[60px] h-[60px] bg-gradient-to-br from-blue-500 to-sky-400 rounded-[18px] flex items-center justify-center shadow-2xl shadow-blue-500/40">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <span
              className="text-white font-bold text-[17px] tracking-tight"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              Student Life
            </span>
            <div className="flex gap-1.5 mt-0.5">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="block w-1.5 h-1.5 rounded-full bg-sky-400"
                  animate={
                    phase === "exiting"
                      ? { opacity: 0 }
                      : { opacity: [0.25, 1, 0.25], scale: [0.7, 1, 0.7] }
                  }
                  transition={
                    phase === "exiting"
                      ? { duration: 0.1 }
                      : { duration: 1.1, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }
                  }
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </TransitionContext.Provider>
  );
}
