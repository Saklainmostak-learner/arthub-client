import Image from "next/image";

const artists = [
  {
    id: 1,
    name: "Sara Ahmed",
    specialty: "Contemporary Painter",
    sales: 28,
    image: "/artists/artist-1.png",
  },
  {
    id: 2,
    name: "Arian Khan",
    specialty: "Digital Artist",
    sales: 24,
    image: "/artists/artist-2.png",
  },
  {
    id: 3,
    name: "Fahim Rahman",
    specialty: "Mixed Media Artist",
    sales: 19,
    image: "/artists/artist-3.png",
  },
];

export default function TopArtists() {
  return (
    <section className="bg-[#0a1422] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-[#F97316]">
            Meet the Creators
          </p>

          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Top Artists
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            Discover artists whose work is connecting with collectors across the
            ArtHub community.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {artists.map((artist) => (
            <article
              key={artist.id}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition duration-300 hover:-translate-y-1 hover:border-[#F97316]/40 hover:bg-white/[0.06]"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-[#F97316]/30">
                <Image
                  src={artist.image}
                  alt={artist.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">
                  {artist.name}
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  {artist.specialty}
                </p>

                <p className="mt-2 text-sm font-medium text-[#F97316]">
                  {artist.sales} artworks sold
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
