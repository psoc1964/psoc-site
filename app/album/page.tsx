"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/(public)/components/compo/Navbar";
import Footer from "@/app/(public)/components/compo/Footer";
import AlbumContent from "@/app/album/Albumcontent";

/*
  "Breath in" enter animation — three phases, all GPU-composited:

  Phase 1 — BLACK HOLD (0 → 400ms)
    The black overlay sits fully opaque. The content is rendered underneath
    but invisible (opacity 0, scale 0.96). This gives the previous page's
    exit blur a moment to linger in perception before anything new appears.

  Phase 2 — INHALE (400ms → 1600ms)
    The black overlay fades out while the content scales from 0.96 → 1 and
    fades from 0 → 1 simultaneously. The easing curve is a custom cubic-bezier
    that starts very slow (the "hesitation" at the beginning of a breath),
    accelerates through the middle, then decelerates gently into place —
    mimicking the organic feel of an inhale settling.

  Phase 3 — SETTLED
    Everything is at rest. The overlay is gone (opacity 0, pointer-events none).

  Only `opacity` and `transform: scale()` are animated. Both are composited
  properties — the browser moves them to the GPU and never triggers layout
  or paint during the transition.
*/

export default function AlbumPage() {
  // phase: "hold" → "inhale" → "settled"
  const [phase, setPhase] = useState<"hold" | "inhale" | "settled">("hold");
  const router = useRouter();

  useEffect(() => {
    // Phase 1 → 2: after a short hold, trigger the inhale.
    // requestAnimationFrame ensures the browser has painted the "hold"
    // frame before we flip to "inhale", so the transition actually runs.
    const holdTimer = setTimeout(() => {
      requestAnimationFrame(() => {
        setPhase("inhale");
      });
    }, 400);

    // Phase 2 → 3: mark as settled after the inhale transition completes.
    // 1200ms matches the CSS transition duration on the content wrapper.
    const settleTimer = setTimeout(() => {
      setPhase("settled");
    }, 400 + 1200);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(settleTimer);
    };
  }, []);

  const handleNavTransition = useCallback((targetId: string) => {
    if (targetId === "album") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    router.push(`/#${targetId}`);
  }, [router]);

  // Derived booleans — keeps the JSX readable without repeating conditionals.
  const overlayVisible = phase === "hold";
  const contentRevealed = phase !== "hold"; // true during "inhale" and "settled"

  return (
    <div className="bg-black text-white">
      {/*
        Black overlay — only animates opacity (composited).
        During "hold" it's fully opaque and covers everything.
        Once we flip to "inhale" it fades out over 800ms with a gentle
        ease-out so it doesn't disappear too fast and break the breath feel.
      */}
      <div
        className="fixed inset-0 z-[200] pointer-events-none bg-black"
        style={{
          opacity: overlayVisible ? 1 : 0,
          transition: "opacity 800ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
        aria-hidden="true"
      />

      {/*
        Content wrapper — only animates opacity + transform (both composited).

        "hold"    → opacity 0, scale 0.96  (invisible, slightly shrunk)
        "inhale"  → CSS transition kicks in, animates to opacity 1, scale 1
        "settled" → same final values, transition property removed so there's
                    zero ongoing transition cost once the page is at rest.

        The cubic-bezier is tuned to feel like an inhale:
          - 0.16, 0.1  → very slow start (the hesitation)
          - 0.3, 1     → gentle settle at the end (no overshoot)
        Duration 1200ms gives it enough time to feel unhurried.
      */}
      <div
        style={{
          opacity: contentRevealed ? 1 : 0,
          transform: contentRevealed ? "scale(1)" : "scale(0.96)",
          transition:
            phase === "inhale"
              ? "opacity 1200ms cubic-bezier(0.16, 0.1, 0.3, 1), transform 1200ms cubic-bezier(0.16, 0.1, 0.3, 1)"
              : "none",
        }}
      >
        <Navbar visible={true} onNavigate={handleNavTransition} />
        <AlbumContent />
        <Footer />
      </div>
    </div>
  );
}