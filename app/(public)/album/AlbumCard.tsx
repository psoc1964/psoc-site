"use client";

import { memo, useCallback, useMemo, useState } from "react";

import Modal from "@/components/ui/modal";
import { useUser } from "@/lib/auth-client";

const NEXT_PUBLIC_BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "";

type Album = {
  id: number;
  name: string;
  albumUrl?: string;
  thumbnailUrl?: string;
  createdAt: string;
};

type AlbumCardProps = {
  album: Album;
  index: number;
  isVisible: boolean;
};

const GATED_ALBUMS = ["utkrisht", "batch photography"];

const AlbumThumbnail = memo(({ src, alt }: { src: string; alt: string }) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
      loading="lazy"
      decoding="async"
      onError={() => setImgSrc("/fallback.jpg")}
    />
  );
});
AlbumThumbnail.displayName = "AlbumThumbnail";

function AlbumCardInner({ album, index, isVisible }: AlbumCardProps) {
  const [user] = useUser();
  const [open, setOpen] = useState(false);

  const dateLabel = useMemo(
    () =>
      new Date(album.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
    [album.createdAt],
  );

  const delay = Math.min(index * 60, 540);

  const handleClick = useCallback(() => {
    const isGated = GATED_ALBUMS.includes(album.name.trim().toLowerCase());
    if (!isGated || user) {
      if (album.albumUrl)
        window.open(
          album.albumUrl,
          "_blank",
          "noopener,noreferrer",
        );
      return;
    }
    setOpen(true);
  }, [user, album.albumUrl, album.name]);

  return (
    <>
      <div
        className="album-card-animate group relative overflow-hidden rounded-2xl bg-white/[0.02] border border-white/[0.07] hover:border-white/20 transition-[border-color] duration-500 cursor-pointer"
        onClick={handleClick}
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible
            ? "translateY(0px) translateZ(0)"
            : "translateY(24px) translateZ(0)",
          transition: `opacity 550ms cubic-bezier(0.25,0.46,0.45,0.94) ${delay}ms, transform 550ms cubic-bezier(0.25,0.46,0.45,0.94) ${delay}ms`,
          willChange: "opacity, transform",
        }}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-white/[0.03]">
          <AlbumThumbnail src={album.thumbnailUrl ?? ""} alt={album.name} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/[0.03] to-transparent" />
        </div>

        <div className="p-5 md:p-6 space-y-1.5">
          <span className="text-[11px] tracking-[0.3em] uppercase text-white/30 font-medium">
            {dateLabel}
          </span>
          <h3 className="text-lg md:text-xl font-serif text-white/85 group-hover:text-white transition-colors duration-300 leading-snug">
            {album.name}
          </h3>
        </div>

        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
      </div>

      <Modal
        open={open}
        close={() => setOpen(false)}
        title="Sign in to view albums"
        panelClassName="bg-[#050505] border border-white/10 text-white max-w-md"
      >
        <div className="mt-4 space-y-4">
          <p className="text-sm text-white/70 leading-relaxed">
            These albums are reserved for faculty and students of the BIT Mesra
            only. Sign in to unlock full-resolution galleries on our Drive.
          </p>
          <div className="flex items-center gap-3 text-xs text-white/40">
            <span className="inline-flex h-10 items-center justify-center rounded-full border border-white/15 bg-white/5 px-2 font-mono uppercase tracking-[0.18em] text-center">
              Private Collection
            </span>
            <span className="h-px w-10 bg-white/10" />
            <span>Curated photo stories, behind the scenes & more.</span>
          </div>
          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xs font-medium text-white/50 hover:text-white/80 transition-colors"
            >
              Maybe later
            </button>
            <a
              href="/login"
              className="inline-flex items-center gap-2 rounded-full bg-white text-black px-4 py-2 text-xs font-semibold tracking-[0.18em] uppercase hover:bg-white/90 transition-colors"
            >
              Sign in to continue
            </a>
          </div>
        </div>
      </Modal>
    </>
  );
}

const AlbumCard = memo(AlbumCardInner, (prev, next) => {
  return (
    prev.isVisible === next.isVisible &&
    prev.index === next.index &&
    prev.album.id === next.album.id
  );
});

AlbumCard.displayName = "AlbumCard";

export default AlbumCard;
