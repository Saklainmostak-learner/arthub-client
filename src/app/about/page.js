import Link from "next/link";
import {
  Heart,
  Palette,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

export const metadata = {
  title: "About | ArtHub",
};

export default function AboutPage() {
  const values = [
    {
      icon: Palette,
      title: "Original Creativity",
      description:
        "ArtHub celebrates original work and gives independent artists a place to share their creative voice.",
    },
    {
      icon: Users,
      title: "Artist & Collector Community",
      description:
        "We connect people who create meaningful work with people who want to discover and collect it.",
    },
    {
      icon: ShieldCheck,
      title: "Thoughtful Marketplace",
      description:
        "Clear ownership states, secure checkout, and role-based experiences make collecting more dependable.",
    },
    {
      icon: Heart,
      title: "Art Worth Remembering",
      description:
        "Collectors can save favorites, build a personal collection, and return to the work that inspires them.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#07111f] px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-[2rem] border border-white/10 bg-[#0b1625] px-6 py-14 text-center sm:px-10 lg:px-16 lg:py-20">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F97316]/10 text-[#F97316]">
            <Sparkles size={25} />
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.28em] text-[#F97316]">
            About ArtHub
          </p>

          <h1 className="mx-auto mt-4 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            A marketplace built around original art and
            the people behind it.
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">
            ArtHub brings independent artists and art
            collectors together in one modern marketplace.
            Artists can publish and manage original work,
            while collectors can discover, save, and
            purchase pieces they connect with.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/artworks"
              className="rounded-xl bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] px-6 py-3 text-sm font-semibold text-white"
            >
              Explore Artworks
            </Link>

            <Link
              href="/register"
              className="rounded-xl border border-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.05]"
            >
              Join ArtHub
            </Link>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#F97316]">
              What We Believe
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Creativity deserves a thoughtful home.
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
              ArtHub is designed to make discovering and
              sharing original work simple, visual, and
              personal. The platform gives artists useful
              publishing tools and gives collectors a
              focused experience without unnecessary
              clutter.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => {
              const Icon =
                value.icon;

              return (
                <article
                  key={value.title}
                  className="rounded-2xl border border-white/10 bg-[#0d1928] p-6"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F97316]/10 text-[#F97316]">
                    <Icon size={20} />
                  </div>

                  <h3 className="mt-5 text-lg font-bold">
                    {value.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {
                      value.description
                    }
                  </p>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}