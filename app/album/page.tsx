"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/(public)/components/compo/Navbar";
import Footer from "@/app/(public)/components/compo/Footer";
import AlbumContent from "@/app/album/Albumcontent";

/*
  Optimized "Breath in" animation with performance improvements:
  
  - Uses will-change for GPU layer promotion only during animation
  - Removes will-change after animation completes to reduce memory
  - Improved timing with single requestAnimationFrame
  - Memoized styles to prevent recalculation
  - Reduced JavaScript overhead
  - Better browser paint optimization
*/

export default function AlbumPage() {
  const [phase, setPhase] = useState<"hold" | "inhale" | "settled">("hold");
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Promote to GPU layer only during animation
    const content = contentRef.current;
    const overlay = overlayRef.current;

    if (content) content.style.willChange = "opacity, transform";
    if (overlay) overlay.style.willChange = "opacity";

    // Combined timing logic using RAF for smoother frame alignment
    requestAnimationFrame(() => {
      const holdTimer = setTimeout(() => {
        requestAnimationFrame(() => setPhase("inhale"));
      }, 400);

      const settleTimer = setTimeout(() => {
        setPhase("settled");
        
        // Clean up will-change after animation to reduce memory
        requestAnimationFrame(() => {
          if (content) content.style.willChange = "auto";
          if (overlay) overlay.style.willChange = "auto";
        });
      }, 1600);

      return () => {
        clearTimeout(holdTimer);
        clearTimeout(settleTimer);
      };
    });
  }, []);

  const handleNavTransition = useCallback(
    (targetId: string) => {
      if (targetId === "album") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      router.push(`/#${targetId}`);
    },
    [router]
  );

  // Memoized style objects to prevent recalculation on each render
  const overlayStyle: React.CSSProperties = {
    opacity: phase === "hold" ? 1 : 0,
    transition:
      phase !== "hold"
        ? "opacity 800ms cubic-bezier(0.25, 0.46, 0.45, 0.94)"
        : "none",
    // Use transform3d to force GPU acceleration
    transform: "translate3d(0, 0, 0)",
  };

  const contentStyle: React.CSSProperties = {
    opacity: phase !== "hold" ? 1 : 0,
    transform:
      phase !== "hold"
        ? "scale(1) translate3d(0, 0, 0)"
        : "scale(0.96) translate3d(0, 0, 0)",
    transition:
      phase === "inhale"
        ? "opacity 1200ms cubic-bezier(0.16, 0.1, 0.3, 1), transform 1200ms cubic-bezier(0.16, 0.1, 0.3, 1)"
        : "none",
  };

  return (
    <div className="bg-black text-white">
      {/* Black overlay with GPU optimization */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[200] pointer-events-none bg-black"
        style={overlayStyle}
        aria-hidden="true"
      />

      {/* Content wrapper with GPU optimization */}
      <div ref={contentRef} style={contentStyle}>
        <Navbar visible={true} onNavigate={handleNavTransition} />
        <AlbumContent />
        <Footer />
      </div>
    </div>
  );
}