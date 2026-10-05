import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Palette,
  ShoppingBag,
  UserRound,
} from "lucide-react";

const artworks = [
  {
    id: "1",
    title: "Golden Horizon",
    artist: "Arian Khan",
    artistEmail: "arian@example.com",
    price: 120,
    category: "Painting",
    image: "/featured/artwork-1.png",
    uploadedAt: "October 6, 2026",
    description:
      "Golden Horizon captures the quiet warmth of an evening landscape through expressive color and layered brushwork. The piece is designed to bring a calm, luminous presence into a modern interior.",
  },
  {
    id: "2",
    title: "Bloom Within",
    artist: "Sara Ahmed",
    artistEmail: "sara@example.com",
    price: 200,
    category: "Painting",
    image: "/featured/artwork-2.png",
    uploadedAt: "October 5, 2026",
    description:
      "Bloom Within explores softness, identity, and growth through a floral portrait composition. Detailed textures and muted natural tones give the artwork an elegant gallery-inspired character.",
  },
  {
    id: "3",
    title: "Urban Rhythm",
    artist: "Fahim Rahman",
    artistEmail: "fahim@example.com",
    price: 150,
    category: "Digital Art",
    image: "/featured/artwork-3.png",
    uploadedAt: "October 4, 2026",
    description:
      "Urban Rhythm reflects the energy of a rainy city night, combining vivid reflections, dramatic lighting, and a cinematic atmosphere inspired by life after dark.",
  },
  {
    id: "4",
    title: "Silent Retreat",
    artist: "Nabila Noor",
    artistEmail: "nabila@example.com",
    price: 180,
    category: "Painting",
    image: "/featured/artwork-4.png",
    uploadedAt: "October 3, 2026",
    description:
      "Silent Retreat is an expressive portrait built from layered shapes, textured color, and quiet emotion. The work balances modern abstraction with a strong human presence.",
  },
  {
    id: "5",
    title: "Curious Soul",
    artist: "Tanvir Hasan",
    artistEmail: "tanvir@example.com",
    price: 100,
    category: "Digital Art",
    image: "/featured/artwork-5.png",
    uploadedAt: "October 2, 2026",
    description:
      "Curious Soul draws inspiration from untouched forests and flowing water. Rich greens, warm sunlight, and intricate natural details create a peaceful sense of discovery.",
  },
  {
    id: "6",
    title: "Color Beyond",
    artist: "Maya Sen",
    artistEmail: "maya@example.com",
    price: 220,
    category: "Mixed Media",
    image: "/featured/artwork-6.png",
    uploadedAt: "October 1, 2026",
    description:
      "Color Beyond celebrates movement and imagination through bold abstract forms. Strong orange, teal, blue, and neutral tones create a vibrant composition with contemporary energy.",
  },
];

export default async function ArtworkDetailsPage({ params }) {
  const { id } = await params;

  const artwork = artworks.find((item) => item.id === id);

  if (!artwork) {
    return (
      <main className="min-h-screen bg-[#07111f] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[500px] max-w-3xl flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.03] px-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F97316]/10 text-[#F97316]">
            <Palette size={28} />
          </div>

          <h1 className="mt-6 text-3xl font-bold text-white">
            Artwork not found
          </h1>

          <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
            The artwork you are looking for may have been removed or the link
            may be incorrect.
          </p>

          <Link
            href="/artworks"
            className="mt-7 rounded-full bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Browse Artworks
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07111f] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Back Link */}
        <Link
          href="/artworks"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to Artworks
        </Link>

        {/* Details */}
        <section className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          {/* Artwork Image */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-[0_30px_80px_rgba(0,0,0,0.28)]">
            <div className="relative aspect-[4/5]">
              <Image
                src={artwork.image}
                alt={artwork.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Artwork Information */}
          <div className="lg:sticky lg:top-28">
            <div className="inline-flex rounded-full border border-[#F97316]/30 bg-[#F97316]/10 px-3 py-1.5 text-xs font-semibold text-[#F97316]">
              {artwork.category}
            </div>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {artwork.title}
            </h1>

            <div className="mt-5 flex items-center gap-3 text-sm text-slate-400">
              <UserRound size={17} />

              <span>Created by</span>

              <Link
                href="/artworks"
                className="font-semibold text-white transition hover:text-[#F97316]"
              >
                {artwork.artist}
              </Link>
            </div>

            <p className="mt-7 text-3xl font-bold text-[#F97316]">
              ${artwork.price}
            </p>

            <div className="mt-8 border-y border-white/10 py-7">
              <h2 className="text-lg font-semibold text-white">
                About this artwork
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                {artwork.description}
              </p>
            </div>

            {/* Metadata */}
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <Palette size={17} className="text-[#F97316]" />
                  <span className="text-xs uppercase tracking-[0.18em]">
                    Category
                  </span>
                </div>

                <p className="mt-2 text-sm font-semibold text-white">
                  {artwork.category}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <CalendarDays size={17} className="text-[#F97316]" />
                  <span className="text-xs uppercase tracking-[0.18em]">
                    Uploaded
                  </span>
                </div>

                <p className="mt-2 text-sm font-semibold text-white">
                  {artwork.uploadedAt}
                </p>
              </div>
            </div>

            {/* Purchase */}
            <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-sm leading-6 text-slate-400">
                Own this original piece and add it to your ArtHub collection.
              </p>

              <button
                type="button"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] px-6 py-3.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                <ShoppingBag size={18} />
                Buy Artwork
              </button>

              <p className="mt-3 text-center text-xs text-slate-500">
                Secure checkout will be connected through Stripe.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}