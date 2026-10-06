"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Loader2,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import ArtworkGrid from "@/components/artworks/ArtworkGrid";

export default function ArtworksPage() {
  const [artworks, setArtworks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOption, setSortOption] = useState("newest");

  useEffect(() => {
    const loadArtworks = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const response = await fetch(
          "http://localhost:5000/artworks",
          {
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to load artworks."
          );
        }

        setArtworks(result.data || []);
      } catch (error) {
        console.error("Failed to fetch artworks:", error);

        setErrorMessage(
          error.message ||
            "Unable to load artworks. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadArtworks();
  }, []);

  const filteredArtworks = useMemo(() => {
    let result = [...artworks];

    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase();

    if (normalizedSearch) {
      result = result.filter((artwork) => {
        const title =
          artwork.title?.toLowerCase() || "";

        const artistName =
          artwork.artistName?.toLowerCase() || "";

        return (
          title.includes(normalizedSearch) ||
          artistName.includes(normalizedSearch)
        );
      });
    }

    if (category) {
      result = result.filter(
        (artwork) => artwork.category === category
      );
    }

    if (minPrice !== "") {
      result = result.filter(
        (artwork) =>
          Number(artwork.price) >= Number(minPrice)
      );
    }

    if (maxPrice !== "") {
      result = result.filter(
        (artwork) =>
          Number(artwork.price) <= Number(maxPrice)
      );
    }

    if (sortOption === "price-low") {
      result.sort(
        (a, b) =>
          Number(a.price) - Number(b.price)
      );
    }

    if (sortOption === "price-high") {
      result.sort(
        (a, b) =>
          Number(b.price) - Number(a.price)
      );
    }

    if (sortOption === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );
    }

    return result;
  }, [
    artworks,
    searchTerm,
    category,
    minPrice,
    maxPrice,
    sortOption,
  ]);

  return (
    <main className="min-h-screen bg-[#07111f] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#F97316]">
            Explore the Collection
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Browse Artworks
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            Discover original works from independent artists
            and explore pieces across different styles,
            mediums, and price ranges.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.18)] sm:p-5">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0b1625] px-4 py-3.5 focus-within:border-[#F97316]/50">
            <Search
              size={19}
              className="shrink-0 text-slate-500"
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
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
              onChange={(event) =>
                setCategory(event.target.value)
              }
              className="rounded-xl border border-white/10 bg-[#0b1625] px-4 py-3 text-sm text-white outline-none transition focus:border-[#F97316]/50"
            >
              <option value="">All Categories</option>
              <option value="Painting">Painting</option>
              <option value="Digital Art">
                Digital Art
              </option>
              <option value="Sculpture">Sculpture</option>
              <option value="Photography">
                Photography
              </option>
              <option value="Drawing">Drawing</option>
              <option value="Mixed Media">
                Mixed Media
              </option>
            </select>

            <input
              type="number"
              min="0"
              value={minPrice}
              onChange={(event) =>
                setMinPrice(event.target.value)
              }
              placeholder="Min price"
              className="rounded-xl border border-white/10 bg-[#0b1625] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 transition focus:border-[#F97316]/50"
            />

            <input
              type="number"
              min="0"
              value={maxPrice}
              onChange={(event) =>
                setMaxPrice(event.target.value)
              }
              placeholder="Max price"
              className="rounded-xl border border-white/10 bg-[#0b1625] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 transition focus:border-[#F97316]/50"
            />

            <select
              value={sortOption}
              onChange={(event) =>
                setSortOption(event.target.value)
              }
              className="rounded-xl border border-white/10 bg-[#0b1625] px-4 py-3 text-sm text-white outline-none transition focus:border-[#F97316]/50"
            >
              <option value="newest">Newest</option>
              <option value="price-low">
                Price: Low to High
              </option>
              <option value="price-high">
                Price: High to Low
              </option>
            </select>
          </div>
        </div>

        {isLoading && (
          <div className="flex min-h-[350px] items-center justify-center">
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <Loader2
                size={20}
                className="animate-spin text-[#F97316]"
              />
              Loading artworks...
            </div>
          </div>
        )}

        {!isLoading && errorMessage && (
          <div className="mt-10 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">
            {errorMessage}
          </div>
        )}

        {!isLoading && !errorMessage && (
          <>
            <div className="mb-5 mt-10">
              <p className="text-sm text-slate-400">
                Showing{" "}
                <span className="font-semibold text-white">
                  {filteredArtworks.length}
                </span>{" "}
                {filteredArtworks.length === 1
                  ? "artwork"
                  : "artworks"}
              </p>
            </div>

            <ArtworkGrid artworks={filteredArtworks} />
          </>
        )}
      </div>
    </main>
  );
}