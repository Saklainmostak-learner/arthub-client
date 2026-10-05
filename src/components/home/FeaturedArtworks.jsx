import Image from "next/image";
import Link from "next/link";

const artworks = [
  {
    id: 1,
    title: "Golden Horizon",
    artist: "Arian Khan",
    price: 120,
    image: "/featured/artwork-1.png",
  },
  {
    id: 2,
    title: "Bloom Within",
    artist: "Sara Ahmed",
    price: 200,
    image: "/featured/artwork-2.png",
  },
  {
    id: 3,
    title: "Urban Rhythm",
    artist: "Fahim Rahman",
    price: 150,
    image: "/featured/artwork-3.png",
  },
  {
    id: 4,
    title: "Silent Retreat",
    artist: "Nabila Noor",
    price: 180,
    image: "/featured/artwork-4.png",
  },
  {
    id: 5,
    title: "Curious Soul",
    artist: "Tanvir Hasan",
    price: 100,
    image: "/featured/artwork-5.png",
  },
  {
    id: 6,
    title: "Color Beyond",
    artist: "Maya Sen",
    price: 220,
    image: "/featured/artwork-6.png",
  },
];

export default function FeaturedArtworks() {
  return (
    <section className="bg-[#07111f] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-[#F97316]">
              Curated for You
            </p>

            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Featured Artworks
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              Discover a selection of original pieces from artists across
              different styles and mediums.
            </p>
          </div>

          <Link
            href="/artworks"
            className="text-sm font-semibold text-[#F97316] transition hover:text-white"
          >
            View All Artworks →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-6">
          {artworks.map((artwork) => (
            <article
              key={artwork.id}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_12px_35px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1 hover:border-[#F97316]/40 hover:bg-white/[0.06]"
            >
              <Link href={`/artworks/${artwork.id}`}>
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={artwork.image}
                    alt={artwork.title}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-3.5 sm:p-4">
                  <h3 className="truncate text-sm font-semibold tracking-tight text-white">
                    {artwork.title}
                  </h3>

                  <p className="mt-1 truncate text-xs text-slate-400">
                    by {artwork.artist}
                  </p>

                  <p className="mt-3 text-sm font-bold text-[#F97316]">
                    ${artwork.price}
                  </p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
