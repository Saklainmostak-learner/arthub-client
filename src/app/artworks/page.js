"use client";

import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

import ArtworkGrid from "@/components/artworks/ArtworkGrid";

export default function ArtworksPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOption, setSortOption] = useState("newest");

  return (
    <main className="min-h-screen bg-[#07111f] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#F97316]">
            Explore the Collection
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Browse Artworks
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            Discover original works from independent artists and explore pieces
            across different styles, mediums, and price ranges.
          </p>
        </div>

        {/* Search + Filters */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.18)] sm:p-5">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0b1625] px-4 py-3.5 focus-within:border-[#F97316]/50">
            <Search size={19} className="shrink-0 text-slate-500" />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by artwork title or artist..."
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            />
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-300">
            <SlidersHorizontal
              size={17}
              className="text-[#F97316]"
            />
            Filters
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="rounded-xl border border-white/10 bg-[#0b1625] px-4 py-3 text-sm text-white outline-none transition focus:border-[#F97316]/50"
            >
              <option value="">All Categories</option>
              <option value="painting">Painting</option>
              <option value="digital">Digital Art</option>
              <option value="sculpture">Sculpture</option>
              <option value="photography">Photography</option>
              <option value="drawing">Drawing</option>
              <option value="mixed-media">Mixed Media</option>
            </select>

            <input
              type="number"
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
              placeholder="Min price"
              min="0"
              className="rounded-xl border border-white/10 bg-[#0b1625] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 transition focus:border-[#F97316]/50"
            />

            <input
              type="number"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
              placeholder="Max price"
              min="0"
              className="rounded-xl border border-white/10 bg-[#0b1625] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 transition focus:border-[#F97316]/50"
            />

            <select
              value={sortOption}
              onChange={(event) => setSortOption(event.target.value)}
              className="rounded-xl border border-white/10 bg-[#0b1625] px-4 py-3 text-sm text-white outline-none transition focus:border-[#F97316]/50"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        <ArtworkGrid
          searchTerm={searchTerm}
          category={category}
          minPrice={minPrice}
          maxPrice={maxPrice}
          sortOption={sortOption}
        />
      </div>
    </main>
  );
}