import Link from "next/link";
import type { PropsWithChildren } from "react";
import SocialBar from "./social-bar";

export default function AuthLayout({ title, bottomHeading, children, redirectURL }: PropsWithChildren<{
  title: string;
  bottomHeading?: { question: string; answer: string; link: string; };
  redirectURL?: string;
}>) {
  return (
    <section className="min-h-screen bg-[#050505] flex flex-col items-center justify-center px-4 sm:px-6 py-10 sm:py-16">
      <p className="text-[9px] sm:text-[10px] tracking-[0.45em] uppercase text-white/22 mb-10 sm:mb-14 font-medium text-center">
        PSOC — Photographic Society
      </p>
      <div className="w-full max-w-[360px] sm:max-w-[420px]">
        <div className="mb-7 sm:mb-9">
          <p className="text-[9px] sm:text-[10px] tracking-[0.5em] uppercase text-white/22 mb-2">
            Visual Archives
          </p>
          <h1 className="font-serif text-[2rem] sm:text-[2.6rem] text-white/90 font-normal leading-tight">
            {title}
          </h1>
        </div>
        <div className="space-y-3 sm:space-y-4">
          {children}
          {redirectURL && (
            <>
              <div className="flex items-center gap-3 py-1">
                <div className="flex-1 h-px bg-white/[0.08]" />
                <span className="text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-white/20">or</span>
                <div className="flex-1 h-px bg-white/[0.08]" />
              </div>
              <SocialBar redirectURL={redirectURL} />
              
            </>
          )}
        </div>
        {bottomHeading && (
          <p className="mt-6 sm:mt-8 text-center text-[11px] sm:text-[12px] text-white/22">
            {bottomHeading.question}&nbsp;
            <Link className="text-white/50 border-b border-white/20 pb-px hover:text-white/70 transition-colors" href={bottomHeading.link}>
              {bottomHeading.answer}
            </Link>
          </p>
        )}
      </div>
    </section>
  );
}