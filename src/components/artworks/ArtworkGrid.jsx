"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, SearchX } from "lucide-react";

import Pagination from "@/components/artworks/Pagination";

const artworks = [
  {
    id: 1,
    title: "Golden Horizon",
    artist: "Arian Khan",
    price: 120,
    category: "painting",
    categoryLabel: "Painting",
    image: "/featured/artwork-1.png",
    createdAt: "2026-10-06",
  },
  {
    id: 2,
    title: "Bloom Within",
    artist: "Sara Ahmed",
    price: 200,
    category: "painting",
    categoryLabel: "Painting",
    image: "/featured/artwork-2.png",
    createdAt: "2026-10-05",
  },
  {
    id: 3,
    title: "Urban Rhythm",
    artist: "Fahim Rahman",
    price: 150,
    category: "digital",
    categoryLabel: "Digital Art",
    image: "/featured/artwork-3.png",
    createdAt: "2026-10-04",
  },
  {
    id: 4,
    title: "Silent Retreat",
    artist: "Nabila Noor",
    price: 180,
    category: "painting",
    categoryLabel: "Painting",
    image: "/featured/artwork-4.png",
    createdAt: "2026-10-03",
  },
  {
    id: 5,
    title: "Curious Soul",
    artist: "Tanvir Hasan",
    price: 100,
    category: "digital",
    categoryLabel: "Digital Art",
    image: "/featured/artwork-5.png",
    createdAt: "2026-10-02",
  },
  {
    id: 6,
    title: "Color Beyond",
    artist: "Maya Sen",
    price: 220,
    category: "mixed-media",
    categoryLabel: "Mixed Media",
    image: "/featured/artwork-6.png",
    createdAt: "2026-10-01",
  },
];

const ITEMS_PER_PAGE = 6;

export default function ArtworkGrid({
  searchTerm,
  category,
  minPrice,
  maxPrice,
  sortOption,
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const filteredArtworks = useMemo(() => {
    const filtered = artworks.filter((artwork) => {
      const searchValue = searchTerm.trim().toLowerCase();

      const matchesSearch =
        artwork.title.toLowerCase().includes(searchValue) ||
        artwork.artist.toLowerCase().includes(searchValue);

      const matchesCategory =
        category === "" || artwork.category === category;

      const matchesMinPrice =
        minPrice === "" || artwork.price >= Number(minPrice);

      const matchesMaxPrice =
        maxPrice === "" || artwork.price <= Number(maxPrice);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesMinPrice &&
        matchesMaxPrice
      );
    });

    return [...filtered].sort((a, b) => {
      if (sortOption === "price-low") {
        return a.price - b.price;
      }

      if (sortOption === "price-high") {
        return b.price - a.price;
      }

      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [searchTerm, category, minPrice, maxPrice, sortOption]);

  const totalPages = Math.ceil(
    filteredArtworks.length / ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, category, minPrice, maxPrice, sortOption]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const visibleArtworks = filteredArtworks.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);

    window.scrollTo({
      top: 250,
      behavior: "smooth",
    });
  };

  if (filteredArtworks.length === 0) {
    return (
      <div className="mt-10 flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.03] px-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F97316]/10 text-[#F97316]">
          <SearchX size={25} />
        </div>

        <h2 className="mt-5 text-xl font-semibold text-white">
          No artworks found
        </h2>

        <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
          Try changing your search, category, price range, or sorting options
          to discover more artwork.
        </p>
      </div>
    );
  }

  return (
    <section className="mt-10">
      <div className="mb-6">
        <p className="text-sm text-slate-400">
          Showing {filteredArtworks.length}{" "}
          {filteredArtworks.length === 1 ? "artwork" : "artworks"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {visibleArtworks.map((artwork) => (
          <article
            key={artwork.id}
            className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_12px_35px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1 hover:border-[#F97316]/40"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={artwork.image}
                alt={artwork.title}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />

              <button
                type="button"
                aria-label={`Add ${artwork.title} to wishlist`}
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white backdrop-blur-md transition hover:bg-white hover:text-black"
              >
                <Heart size={17} />
              </button>

              <span className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-md">
                {artwork.categoryLabel}
              </span>
            </div>

            <div className="p-4">
              <Link href={`/artworks/${artwork.id}`}>
                <h2 className="truncate text-base font-semibold text-white transition group-hover:text-[#F97316]">
                  {artwork.title}
                </h2>
              </Link>

              <p className="mt-1 truncate text-sm text-slate-400">
                by {artwork.artist}
              </p>

              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="text-base font-bold text-[#F97316]">
                  ${artwork.price}
                </p>

                <Link
                  href={`/artworks/${artwork.id}`}
                  className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-[#F97316]/40 hover:text-white"
                >
                  View Details
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </section>
  );
}