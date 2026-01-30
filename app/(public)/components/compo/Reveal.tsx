"use client";

import { useEffect, useRef, useState } from "react";

type Direction = "up" | "down" | "left" | "right" | "none" | "scale";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
}

export default function Reveal({
  children,
  className = "",
  direction = "up",
  delay = 0,
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const hiddenStyles: Record<Direction, string> = {
    up: "opacity-0 translate-y-8",
    down: "opacity-0 -translate-y-8",
    left: "opacity-0 translate-x-8",
    right: "opacity-0 -translate-x-8",
    none: "opacity-0",
    scale: "opacity-0 scale-[0.96]",
  };

  const visibleStyles: Record<Direction, string> = {
    up: "opacity-100 translate-y-0",
    down: "opacity-100 translate-y-0",
    left: "opacity-100 translate-x-0",
    right: "opacity-100 translate-x-0",
    none: "opacity-100",
    scale: "opacity-100 scale-100",
  };

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`
        transition-all duration-[900ms]
        ease-[cubic-bezier(0.22,1,0.36,1)]
        ${visible ? visibleStyles[direction] : hiddenStyles[direction]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
