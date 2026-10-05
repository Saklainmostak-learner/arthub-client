"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, SearchX } from "lucide-react";

export default function ArtworkGrid({ artworks = [] }) {
  if (artworks.length === 0) {
    return (
      <div className="flex min-h-[340px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.025] px-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F97316]/10 text-[#F97316]">
          <SearchX size={25} />
        </div>

        <h2 className="mt-5 text-xl font-bold text-white">
          No artworks found
        </h2>

        <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
          Try changing your search, category, or price
          filters to discover more artwork.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {artworks.map((artwork) => (
        <article
          key={artwork._id}
          className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0d1928] transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_25px_50px_rgba(0,0,0,0.28)]"
        >
          {/* Image */}
          <div className="relative aspect-[4/5] overflow-hidden bg-[#0b1625]">
            <Image
              src={artwork.image}
              alt={artwork.title || "Artwork"}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition duration-500 group-hover:scale-[1.04]"
            />

            {/* Category */}
            <span className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[11px] font-medium text-white backdrop-blur">
              {artwork.category}
            </span>

            {/* Heart */}
            <button
              type="button"
              aria-label="Save artwork"
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur transition hover:bg-white hover:text-black"
            >
              <Heart size={17} />
            </button>
          </div>

          {/* Details */}
          <div className="p-4">
            <h2 className="truncate text-base font-bold text-white">
              {artwork.title}
            </h2>

            <p className="mt-1 truncate text-sm text-slate-400">
              by {artwork.artistName}
            </p>

            <div className="mt-5 flex items-center justify-between gap-3">
              <p className="font-bold text-[#F97316]">
                ${Number(artwork.price).toFixed(2)}
              </p>

              <Link
                href={`/artworks/${artwork._id}`}
                className="rounded-full border border-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:border-[#F97316]/40 hover:bg-[#F97316]/10"
              >
                View Details
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}