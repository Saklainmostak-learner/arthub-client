"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Loader2,
  Palette,
  ShoppingBag,
  User,
} from "lucide-react";

export default function ArtworkDetailsPage() {
  const params = useParams();
  const id = params?.id;

  const [artwork, setArtwork] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadArtwork = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const response = await fetch(
          `http://localhost:5000/artworks/${id}`,
          {
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to load artwork."
          );
        }

        setArtwork(result.data);
      } catch (error) {
        console.error("Failed to fetch artwork:", error);

        setErrorMessage(
          error.message ||
            "Unable to load this artwork."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadArtwork();
  }, [id]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07111f] px-4">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2
            size={22}
            className="animate-spin text-[#F97316]"
          />
          Loading artwork...
        </div>
      </main>
    );
  }

  if (errorMessage || !artwork) {
    return (
      <main className="min-h-screen bg-[#07111f] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl border border-white/10 bg-[#0b1625] p-8 text-center sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F97316]/10 text-[#F97316]">
              <Palette size={25} />
            </div>

            <h1 className="mt-5 text-2xl font-bold">
              Artwork not found
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              {errorMessage ||
                "The artwork you are looking for could not be found."}
            </p>

            <Link
              href="/artworks"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] px-6 py-3 text-sm font-semibold text-white"
            >
              <ArrowLeft size={17} />
              Browse Artworks
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const uploadedDate = artwork.createdAt
    ? new Date(artwork.createdAt).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      )
    : "Unknown";

  return (
    <main className="min-h-screen bg-[#07111f] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Back */}
        <Link
          href="/artworks"
          className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to Artworks
        </Link>

        {/* Main Content */}
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          {/* Artwork Image */}
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b1625]">
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

          {/* Details */}
          <div>
            <span className="inline-flex rounded-full border border-[#F97316]/30 bg-[#F97316]/10 px-3 py-1.5 text-xs font-semibold text-[#F97316]">
              {artwork.category}
            </span>

            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
              {artwork.title}
            </h1>

            <div className="mt-5 flex items-center gap-2 text-sm text-slate-400">
              <User size={17} />

              <span>Created by</span>

              <span className="font-semibold text-white">
                {artwork.artistName}
              </span>
            </div>

            <p className="mt-7 text-3xl font-bold text-[#F97316]">
              ${Number(artwork.price).toFixed(2)}
            </p>

            <div className="my-8 h-px bg-white/10" />

            {/* About */}
            <section>
              <h2 className="text-xl font-bold">
                About this artwork
              </h2>

              <p className="mt-4 leading-7 text-slate-400">
                {artwork.description}
              </p>
            </section>

            {/* Metadata */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  <Palette
                    size={16}
                    className="text-[#F97316]"
                  />
                  Category
                </div>

                <p className="mt-2 font-semibold text-white">
                  {artwork.category}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  <CalendarDays
                    size={16}
                    className="text-[#F97316]"
                  />
                  Uploaded
                </div>

                <p className="mt-2 font-semibold text-white">
                  {uploadedDate}
                </p>
              </div>
            </div>

            {/* Purchase Card */}
            <div className="mt-8 rounded-3xl border border-white/10 bg-[#0b1625] p-5 sm:p-6">
              <p className="text-sm leading-6 text-slate-400">
                Own this original piece and add it to your
                ArtHub collection.
              </p>

              <button
                type="button"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] px-5 py-4 text-sm font-semibold text-white transition hover:opacity-90"
              >
                <ShoppingBag size={18} />
                Buy Artwork
              </button>

              <p className="mt-3 text-center text-xs text-slate-500">
                Secure checkout will be connected through
                Stripe.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}