"use client";

import { Linkedin, Instagram, Facebook, Mail, MapPin } from "lucide-react";
import { useEffect, useRef, memo } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SocialLink = memo(
  ({ href, icon: Icon }: { href: string; icon: React.ElementType }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center transition-all duration-300 hover:bg-white/[0.09] hover:border-white/25 hover:-translate-y-0.5 active:scale-95"
      aria-label={href}
    >
      <Icon
        size={16}
        className="text-white/50 transition-all duration-300 group-hover:text-white"
      />
    </a>
  )
);

SocialLink.displayName = "SocialLink";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!footerRef.current) return;

    const ctx = gsap.context(() => {
      const elements = footerRef.current!.querySelectorAll(".footer-item");

      if (elements.length > 0) {
        gsap.fromTo(
          elements,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top 88%",
            },
          }
        );
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden text-white"
      style={{ background: "linear-gradient(to bottom, #0a0a0a, #111111)" }}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-16">

        {/* Logo */}
        <div className="footer-item pt-14 sm:pt-16 md:pt-20 pb-10 sm:pb-12 md:pb-14 flex flex-col items-center text-center border-b border-white/[0.06]">
          <img
            src="/psoc-logo-white.png"
            alt="PSOC Logo"
            className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain mb-4 sm:mb-6 opacity-90"
            style={{ filter: "drop-shadow(0 0 24px rgba(255,255,255,0.18))" }}
          />
          <p className="text-[8px] sm:text-[9px] tracking-[0.45em] sm:tracking-[0.55em] uppercase text-white/30 font-medium mb-3">
            Photographic Society · BIT Mesra
          </p>
        </div>

        {/* Two Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-12 md:gap-14 py-10 sm:py-12 md:py-14">

          {/* Social */}
          <div className="footer-item space-y-4 sm:space-y-5">
            <p className="text-[9px] tracking-[0.45em] uppercase text-white/25 font-medium">
              Follow Us
            </p>

            <div className="flex gap-2 sm:gap-2.5">
              <SocialLink
                href="https://www.linkedin.com/company/photographic-society-bit-mesra/"
                icon={Linkedin}
              />
              <SocialLink
                href="https://www.instagram.com/psoc.bitm/"
                icon={Instagram}
              />
              <SocialLink
                href="https://www.facebook.com/psocbitm/"
                icon={Facebook}
              />
            </div>

            <div className="pt-3 sm:pt-4 border-l border-white/[0.07] pl-4 sm:pl-5">
              <p className="text-white/20 text-xs leading-relaxed italic font-serif">
                "Photography is the art of frozen time — the ability to store emotion and retrieve it."
              </p>
            </div>
          </div>

          {/* Contact — left-aligned on mobile, right-aligned on sm+ */}
          <div className="footer-item flex flex-col items-start sm:items-end space-y-4 sm:space-y-5 sm:ml-auto">
            <p className="text-[9px] tracking-[0.45em] uppercase text-white/25 font-medium w-full">
              Get in Touch
            </p>

            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-white/45 text-sm hover:text-white/75 transition-colors duration-300 group">
                <MapPin
                  size={14}
                  className="mt-1 flex-shrink-0 text-white/25 group-hover:text-white/50 transition-colors duration-300"
                />
                <a href="https://www.google.com/maps?sca_esv=0cefd7cacdd99c8f&rlz=1C1RXQR_en-GBIN1079IN1079&sxsrf=ANbL-n52COtNi6GD4r7gdKKWfmhiF7ZgFQ:1780941910655&biw=1536&bih=695&uact=5&gs_lp=Egxnd3Mtd2l6LXNlcnAiCmJpdCBtZXNyYSAyBBAjGCcyChAjGIAEGIoFGCcyBBAjGCcyChAAGIAEGBQYhwIyBRAAGIAEMgsQLhiABBixAxiDATILEC4YgAQYxwEYrwEyBRAAGIAEMg4QABiABBiKBRiRAhixAzIFEAAYgARIsw5QaFipCnABeAGQAQCYAaQBoAHODKoBBDAuMTG4AQPIAQD4AQGYAgSgAugDwgIKEAAYRxjWBBiwA8ICDhAAGOQCGNYEGLAD2AEBwgIXEC4Y3AYYuAYY2gYY2AIYyAMYsAPYAQHCAgYQABgWGB7CAgUQABjvBcICCBAAGIAEGKIEwgILEAAYgAQYigUYhgOYAwCIBgGQBg-6BgYIARABGAmSBwMxLjOgB5FMsgcDMC4zuAfbA8IHBTItMS4zyAcjgAgB&um=1&ie=UTF-8&fb=1&gl=in&sa=X&geocode=Ked7wvBT-_Q5MQTnxfMcDBhm&daddr=Mesra,+Jharkhand+835215">
                <span className="leading-relaxed">
                  BIT Mesra, Ranchi <br />
                  Jharkhand, India — 835215
                </span>
                </a>
              </li>

              <li className="flex items-center gap-2 text-white/45 text-sm hover:text-white/75 transition-colors duration-300 group">
                <Mail
                  size={14}
                  className="flex-shrink-0 text-white/25 group-hover:text-white/50 transition-colors duration-300"
                />
                <a
                  href="mailto:psoc@bitmesra.ac.in"
                  className="hover:underline underline-offset-2 break-all"
                >
                  psoc@bitmesra.ac.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

        <div className="footer-item py-5 sm:py-6 md:py-7 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center sm:text-left">
          <p className="text-white/20 text-[10px] sm:text-xs leading-relaxed">
            © {new Date().getFullYear()} PSoc · Photographic Society, Birla Institute of Technology, Mesra
          </p>
        </div>

      </div>
    </footer>
  );
}