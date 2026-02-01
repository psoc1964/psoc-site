"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

export default function IntroLogo({
  onFinish,
}: {
  onFinish: () => void;
}) {
  const logoRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!logoRef.current || !wrapperRef.current) return;

    const ctx = gsap.context(() => {
      // Logo is VISIBLE from the start (no fade in)
      gsap.set(logoRef.current, { opacity: 1, scale: 1 });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      // HOLD: Keep logo visible
      tl.to({}, { duration: 2 })
        
        // EXIT: Zoom and fade out logo
        .to(logoRef.current, {
          scale: 1.5,
          opacity: 0,
          duration: 1,
          ease: "power2.in",
        })
        
        // Fade out wrapper
        .to(wrapperRef.current, {
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
          onComplete: () => {
            onFinish();
          },
        });
    });

    return () => ctx.revert();
  }, [onFinish]);

  return (
    <div
      ref={wrapperRef}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black"
    >
      <div ref={logoRef} className="flex flex-col items-center gap-6">
        {/* Text fallback - visible immediately */}
       
        
        {/* Try to load the logo */}
        <Image
          src="/psoc-logo-white.png"
          alt="PSOC Logo"
          width={200}
          height={200}
          priority
          sizes="200px"
          className="opacity-0 absolute"
          onLoad={(e) => {
            // If logo loads successfully, show it and hide text
            e.currentTarget.classList.remove('opacity-0', 'absolute');
            const textElement = e.currentTarget.previousElementSibling as HTMLElement;
            if (textElement) textElement.classList.add('hidden');
          }}
          onError={() => {
            console.log("Logo failed to load, using text fallback");
          }}
        />
      </div>
    </div>
  );
}