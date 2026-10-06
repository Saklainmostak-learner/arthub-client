import Link from "next/link";
import {
  ArrowLeft,
  Home,
  Palette,
} from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-[#07111f] px-4 py-16 text-white">
      <div className="w-full max-w-2xl text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-[#F97316]/20 bg-[#F97316]/10 text-[#F97316]">
          <Palette size={36} />
        </div>

        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-[#F97316]">
          Error 404
        </p>

        <h1 className="mt-3 text-5xl font-bold tracking-tight sm:text-6xl">
          This canvas is empty.
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
          The page you are looking for may have moved,
          been removed, or never existed. There is still
          plenty of art waiting to be discovered.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] px-6 py-3 text-sm font-semibold text-white"
          >
            <Home size={17} />
            Back Home
          </Link>

          <Link
            href="/artworks"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.05]"
          >
            <ArrowLeft size={17} />
            Browse Artworks
          </Link>
        </div>
      </div>
    </main>
  );
}