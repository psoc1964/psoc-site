
"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/(public)/components/compo/Navbar";
import Footer from "@/app/(public)/components/compo/Footer";
import AlbumContent from "@/app/(public)/album/Albumcontent";
import type { GetPublishedAlbumsQuery } from "@/__generated__/graphql";

<<<<<<< HEAD:app/album/page.tsx
export default function AlbumPage() {
=======
/*
  Client-side wrapper for the album page.
  - Handles the intro "breath in" animation
  - Receives pre-fetched album data from the server via Injector
*/

type AlbumPageClientProps = {
  data?: GetPublishedAlbumsQuery;
  loading: boolean;
};

export default function AlbumPageClient({
  data,
  loading,
}: AlbumPageClientProps) {
>>>>>>> origin/main:app/(public)/album/AlbumPageClient.tsx
  const [phase, setPhase] = useState<"hold" | "inhale" | "settled">("hold");
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const content = contentRef.current;
    const overlay = overlayRef.current;

    if (content) content.style.willChange = "opacity, transform";
    if (overlay) overlay.style.willChange = "opacity";

    requestAnimationFrame(() => {
      const holdTimer = setTimeout(() => {
        requestAnimationFrame(() => setPhase("inhale"));
      }, 400);

      const settleTimer = setTimeout(() => {
        setPhase("settled");
<<<<<<< HEAD:app/album/page.tsx
=======

        // Clean up will-change after animation to reduce memory
>>>>>>> origin/main:app/(public)/album/AlbumPageClient.tsx
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
    [router],
  );

<<<<<<< HEAD:app/album/page.tsx
  const overlayStyle: React.CSSProperties = {
    opacity: phase === "hold" ? 1 : 0,
    transition:
      phase !== "hold"
        ? "opacity 800ms cubic-bezier(0.25, 0.46, 0.45, 0.94)"
        : "none",
    transform: "translate3d(0, 0, 0)",
  };
=======
  const overlayStyle: React.CSSProperties = useMemo(
    () => ({
      opacity: phase === "hold" ? 1 : 0,
      transition:
        phase !== "hold"
          ? "opacity 800ms cubic-bezier(0.25, 0.46, 0.45, 0.94)"
          : "none",
      transform: "translate3d(0, 0, 0)",
    }),
    [phase],
  );
>>>>>>> origin/main:app/(public)/album/AlbumPageClient.tsx

  const contentStyle: React.CSSProperties = useMemo(
    () => ({
      opacity: phase !== "hold" ? 1 : 0,
      transform:
        phase !== "hold"
          ? "scale(1) translate3d(0, 0, 0)"
          : "scale(0.96) translate3d(0, 0, 0)",
      transition:
        phase === "inhale"
          ? "opacity 1200ms cubic-bezier(0.16, 0.1, 0.3, 1), transform 1200ms cubic-bezier(0.16, 0.1, 0.3, 1)"
          : "none",
    }),
    [phase],
  );

  const albums = useMemo(
    () =>
      (data?.getPublishedAlbums ?? []).map((a) => ({
        id: a.id,
        name: a.name,
        albumUrl: a.albumUrl ?? undefined,
        thumbnailUrl: a.thumbnailUrl ?? undefined,
        createdAt: a.createdAt as unknown as string,
      })),
    [data],
  );

  return (
    <div className="bg-black text-white">
      {/* Black intro overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[200] pointer-events-none bg-black"
        style={overlayStyle}
        aria-hidden="true"
      />

      {/*
        Navbar sits OUTSIDE the animated content wrapper so it is never
        affected by the scale/opacity entrance animation.
        Your Navbar already has position:fixed internally, so it will
        always sit at the top of the viewport.
      */}
      <Navbar visible={true} onNavigate={handleNavTransition} />

      {/* Page content — fades/scales in on load */}
      <div ref={contentRef} style={contentStyle}>
<<<<<<< HEAD:app/album/page.tsx
        <AlbumContent />
=======
        <Navbar visible={true} onNavigate={handleNavTransition} />
        <AlbumContent albums={albums} loading={loading} />
>>>>>>> origin/main:app/(public)/album/AlbumPageClient.tsx
        <Footer />
      </div>
    </div>
  );
}
