import { Linkedin, Instagram, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative z-50 pointer-events-auto bg-black border-t border-white/10 py-12 px-6">

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left */}
        <p className="text-white/60 text-sm">
          © {new Date().getFullYear()} PSOC · Birla Institute of Technology, Mesra
        </p>

        {/* Social Icons */}
        <div className="flex gap-6">
          <a
            href="https://www.linkedin.com/company/photographic-society-bit-mesra/posts/?feedView=all"
            target="_blank"
            className="text-white/60 hover:text-white transition"
          >
            <Linkedin size={20} />
          </a>
          <a
            href="https://www.instagram.com/psoc.bitm/"
            target="_blank"
            className="text-white/60 hover:text-white transition"
          >
            <Instagram size={20} />
          </a>
          <a
            href="https://www.facebook.com/psocbitm/"
            target="_blank"
            className="text-white/60 hover:text-white transition"
          >
            <Facebook size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
