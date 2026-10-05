import Link from "next/link";
import { Mail } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050b14] px-4 pt-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1.4fr]">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold text-white">
                Art<span className="text-[#F97316]">Hub</span>
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
              A creative marketplace where collectors discover original art and
              independent artists share their work with the world.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-300 transition hover:border-[#F97316]/50 hover:text-[#F97316]"
              >
                <FaFacebookF size={15} />
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-300 transition hover:border-[#F97316]/50 hover:text-[#F97316]"
              >
                <FaInstagram size={16} />
              </a>

              <a
                href="#"
                aria-label="Twitter"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-300 transition hover:border-[#F97316]/50 hover:text-[#F97316]"
              >
                <FaXTwitter size={15} />
              </a>

              <a
                href="#"
                aria-label="YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-300 transition hover:border-[#F97316]/50 hover:text-[#F97316]"
              >
                <FaYoutube size={17} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
              Quick Links
            </h3>

            <div className="mt-5 flex flex-col gap-3 text-sm text-slate-400">
              <Link href="/about" className="transition hover:text-white">
                About
              </Link>

              <Link href="/contact" className="transition hover:text-white">
                Contact
              </Link>

              <Link href="/privacy" className="transition hover:text-white">
                Privacy Policy
              </Link>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
              Explore
            </h3>

            <div className="mt-5 flex flex-col gap-3 text-sm text-slate-400">
              <Link href="/artworks" className="transition hover:text-white">
                Browse Artworks
              </Link>

              <Link href="/register" className="transition hover:text-white">
                Join as an Artist
              </Link>

              <Link href="/login" className="transition hover:text-white">
                Login
              </Link>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
              Newsletter
            </h3>

            <p className="mt-5 text-sm leading-6 text-slate-400">
              Get new artwork highlights and platform updates in your inbox.
            </p>

            <form className="mt-4 flex overflow-hidden rounded-xl border border-white/10 bg-white/[0.05] shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
              <div className="flex flex-1 items-center gap-2 px-3">
                <Mail size={16} className="text-slate-500" />

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-slate-500"
                />
              </div>

              <button
                type="button"
                className="bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] px-5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 ArtHub. All rights reserved.</p>

          <p>Original art. Independent creators. Thoughtful collecting.</p>
        </div>
      </div>
    </footer>
  );
}
