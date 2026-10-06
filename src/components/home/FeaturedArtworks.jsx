"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BadgeCheck,
  Loader2,
  Palette,
} from "lucide-react";

import { API_URL } from "@/lib/api";

export default function FeaturedArtworks() {
  const [artworks, setArtworks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadFeaturedArtworks = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const response = await fetch(
          `${API_URL}/artworks`,
          {
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Failed to load featured artworks."
          );
        }

        const featured = [...(result.data || [])]
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime()
          )
          .slice(0, 6);

        setArtworks(featured);
      } catch (error) {
        console.error(
          "Featured artworks error:",
          error
        );

        setErrorMessage(
          error.message ||
            "Unable to load featured artworks."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedArtworks();
  }, []);

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
              Discover original pieces recently published
              by independent artists on ArtHub.
            </p>
          </div>

          <Link
            href="/artworks"
            className="text-sm font-semibold text-[#F97316] transition hover:text-white"
          >
            View All Artworks →
          </Link>
        </div>

        {isLoading && (
          <div className="flex min-h-[260px] items-center justify-center rounded-3xl border border-white/10 bg-white/[0.025]">
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <Loader2
                size={19}
                className="animate-spin text-[#F97316]"
              />
              Loading featured artworks...
            </div>
          </div>
        )}

        {!isLoading && errorMessage && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">
            {errorMessage}
          </div>
        )}

        {!isLoading &&
          !errorMessage &&
          artworks.length === 0 && (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.025] px-6 py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F97316]/10 text-[#F97316]">
                <Palette size={25} />
              </div>

              <h3 className="mt-5 text-xl font-bold text-white">
                No artworks published yet
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                New artwork will appear here once artists
                begin publishing.
              </p>

              <Link
                href="/register"
                className="mt-6 inline-flex rounded-xl bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] px-5 py-3 text-sm font-semibold text-white"
              >
                Join as an Artist
              </Link>
            </div>
          )}

        {!isLoading &&
          !errorMessage &&
          artworks.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-6">
              {artworks.map((artwork) => {
                const isSold =
                  artwork.sold === true;

                return (
                  <article
                    key={artwork._id}
                    className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_12px_35px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1 hover:border-[#F97316]/40 hover:bg-white/[0.06]"
                  >
                    <Link
                      href={`/artworks/${artwork._id}`}
                    >
                      <div className="relative aspect-[4/5] overflow-hidden bg-[#0b1625]">
                        <Image
                          src={artwork.image}
                          alt={
                            artwork.title ||
                            "Artwork"
                          }
                          fill
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                          className={`object-cover transition duration-500 group-hover:scale-105 ${
                            isSold
                              ? "opacity-70"
                              : ""
                          }`}
                        />

                        {isSold && (
                          <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-emerald-500/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                            <BadgeCheck size={12} />
                            Sold
                          </span>
                        )}
                      </div>

                      <div className="p-3.5 sm:p-4">
                        <h3 className="truncate text-sm font-semibold tracking-tight text-white">
                          {artwork.title}
                        </h3>

                        <p className="mt-1 truncate text-xs text-slate-400">
                          by {artwork.artistName}
                        </p>

                        <p className="mt-3 text-sm font-bold text-[#F97316]">
                          $
                          {Number(
                            artwork.price
                          ).toFixed(2)}
                        </p>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          )}
      </div>
    </section>
  );
}