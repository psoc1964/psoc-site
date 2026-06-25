"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Shared "lazy visible" hook.
 *
 * Attach the returned `ref` to the element you want to watch. `visible`
 * flips to `true` the first time that element enters (or is already in)
 * the viewport, and stays `true` forever after — we never need to
 * re-hide something that has already loaded.
 *
 * Why this exists (vs. the ad-hoc IntersectionObserver code that used
 * to live in each component):
 *  - Single source of truth, so mobile list cards and desktop grid
 *    cards behave identically.
 *  - Graceful fallback to "always visible" when IntersectionObserver
 *    isn't available (older iOS Safari, some in-app webviews, SSR) —
 *    without this, those devices would show skeletons forever.
 *  - No manual getBoundingClientRect() double-check: IntersectionObserver
 *    already reports the initial intersection state on observe(), so a
 *    second manual check just risks firing twice / reading stale layout
 *    before transforms have settled.
 */
export function useLazyVisible(mobileMargin = "150px", desktopMargin = "300px") {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      // No IO support — don't leave the element stuck on a skeleton forever.
      setVisible(true);
      return;
    }

    const margin = window.innerWidth < 768 ? mobileMargin : desktopMargin;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: margin, threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
    // mobileMargin/desktopMargin are expected to be stable string literals
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, visible };
}