import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-[680px] overflow-hidden">
      <Image
        src="/arthub-hero.png"
        alt="Expressive original artwork featured on ArtHub"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#050b14]/95 via-[#07111f]/75 to-[#07111f]/20" />

      {/* Bottom overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050b14]/70 via-transparent to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-[680px] max-w-7xl items-center px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="max-w-2xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-[#F97316] sm:text-sm">
            Original Art. Real Artists.
          </p>

          <h1 className="max-w-3xl text-4xl font-bold leading-[1.05] text-white sm:text-5xl lg:text-7xl">
            Discover & Buy{" "}
            <span className="bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] bg-clip-text text-transparent">
              Original Art
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-6 text-slate-200 sm:mt-6 sm:text-lg sm:leading-7">
            Explore one-of-a-kind artworks from independent creators and find
            pieces that bring character, emotion, and story into your space.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/artworks"
              className="rounded-full bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Browse Artworks
            </Link>

            <Link
              href="/register"
              className="rounded-full border border-white/25 bg-black/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
            >
              Join as an Artist
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
