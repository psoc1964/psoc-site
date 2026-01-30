"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

export default function IntroLogo({ onFinish }: { onFinish: () => void }) {
  const logoRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const logo = logoRef.current;
    if (!logo) return;

    const tl = gsap.timeline();

    tl.fromTo(
      logo,
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: "power2.out" }
    )
      .to(logo, {
        opacity: 0,
        duration: 1,
        delay: 0.8,
        ease: "power2.inOut",
      })
      .add(() => onFinish());

    return () => {
      tl.kill();
    };
  }, [onFinish]);

  return (
    <div className="min-h-screen flex items-center justify-center">

      <div ref={logoRef}>
        <Image
          src="/Psoc logo white.png"
          alt="PSOC Logo"
          width={220}
          height={220}
          priority
        />
      </div>
    </div>
  );
}
