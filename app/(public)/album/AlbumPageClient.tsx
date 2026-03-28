"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/(public)/components/compo/Navbar";
import Footer from "@/app/(public)/components/compo/Footer";
import AlbumContent from "@/app/(public)/album/Albumcontent";
import type { GetPublishedAlbumsQuery } from "@/__generated__/graphql";

type AlbumPageClientProps = {
  data?: GetPublishedAlbumsQuery;
  loading: boolean;
};

export default function AlbumPageClient({ data, loading }: AlbumPageClientProps) {
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

  // Transform server data into the shape AlbumContent expects
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
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[200] pointer-events-none bg-black"
        style={overlayStyle}
        aria-hidden="true"
      />
      <Navbar visible={true} onNavigate={handleNavTransition} />
      <div ref={contentRef} style={contentStyle}>
        <AlbumContent albums={albums} loading={loading} />
        <Footer />
      </div>
    </div>
  );
}