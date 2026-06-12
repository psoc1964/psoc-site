"use client";
import { GoogleLogo } from "@phosphor-icons/react/dist/ssr";

export default function SocialBar({ redirectURL }: { redirectURL?: string }) {
  const handleGoogleLogin = () => {
    const redirect = redirectURL || "/";
    window.location.href = `/api/google?redirectURL=${encodeURIComponent(redirect)}`;
  };

  return (
  <div className="space-y-2">
    <button
      onClick={handleGoogleLogin}
      className="w-full h-[44px] sm:h-[48px] bg-transparent border border-white/[0.15] rounded-xl text-white/60 text-[12px] sm:text-[13px] font-medium flex items-center justify-center gap-2.5 hover:border-white/30 hover:text-white/85 transition-all duration-200 cursor-pointer"
    >
      <GoogleLogo weight="bold" size={17} />
      Continue with Google
    </button>
    <p className="text-center text-[10px] sm:text-[11px] text-white/25">
      Use your BIT Mesra email (@bitmesra.ac.in)
    </p>
  </div>
);
}