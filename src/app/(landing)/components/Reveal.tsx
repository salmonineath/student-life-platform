"use client";

import { useEffect, useRef, useState } from "react";

export default function Reveal({
  children,
  direction = "up",
  delay = 0,
}: {
  children: React.ReactNode;
  direction?: "up" | "left" | "right";
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

  const hidden: Record<string, string> = {
    up: "opacity-0 translate-y-10",
    left: "opacity-0 -translate-x-10",
    right: "opacity-0 translate-x-10",
  };

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0 translate-x-0" : hidden[direction]}`}
    >
      {children}
    </div>
  );
}
