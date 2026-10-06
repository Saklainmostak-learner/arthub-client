"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  useParams,
  useRouter,
} from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  Loader2,
  Palette,
  ShoppingBag,
  User,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { API_URL } from "@/lib/api";

export default function ArtworkDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [artwork, setArtwork] = useState(null);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] =
    useState(true);
  const [isBuying, setIsBuying] =
    useState(false);
  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    const loadPage = async () => {
      try {
        const response = await fetch(
          `${API_URL}/artworks/${id}`,
          {
            cache: "no-store",
          }
        );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Failed to load artwork."
          );
        }

        setArtwork(result.data);

        const { data } =
          await authClient.getSession();

        setSession(data || null);
      } catch (error) {
        setErrorMessage(
          error.message ||
            "Unable to load artwork."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadPage();
    }
  }, [id]);

  const handleBuyArtwork = async () => {
    if (!session?.user) {
      router.push("/login");
      return;
    }

    if (artwork?.sold) {
      setErrorMessage(
        "This artwork has already been sold."
      );
      return;
    }

    if (session.user.role !== "user") {
      setErrorMessage(
        "Only art collectors can purchase artworks."
      );
      return;
    }

    try {
      setIsBuying(true);

      const response = await fetch(
        `${API_URL}/purchases/create-checkout-session`,
        {
          method: "POST",

          credentials: "include",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            artworkId:
              artwork._id,
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to start checkout."
        );
      }

      window.location.href =
        result.url;
    } catch (error) {
      setErrorMessage(
        error.message ||
          "Unable to start checkout."
      );
    } finally {
      setIsBuying(false);
    }
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07111f]">
        <Loader2 className="animate-spin text-[#F97316]" />
      </main>
    );
  }

  if (!artwork) {
    return (
      <main className="min-h-screen bg-[#07111f] px-4 py-16 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <Palette className="mx-auto text-[#F97316]" />

          <h1 className="mt-5 text-2xl font-bold">
            Artwork not found
          </h1>

          <p className="mt-3 text-slate-400">
            {errorMessage}
          </p>
        </div>
      </main>
    );
  }

  const isSold =
    artwork.sold === true;

  const uploadedDate =
    artwork.createdAt
      ? new Date(
          artwork.createdAt
        ).toLocaleDateString(
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
        <Link
          href="/artworks"
          className="flex items-center gap-2 text-sm text-slate-400"
        >
          <ArrowLeft size={17} />
          Back to Artworks
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
            <Image
              src={artwork.image}
              alt={artwork.title}
              fill
              priority
              className={`object-cover ${
                isSold
                  ? "opacity-70"
                  : ""
              }`}
            />

            {isSold && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-3 font-bold">
                  <BadgeCheck size={18} />
                  SOLD
                </span>
              </div>
            )}
          </div>

          <div>
            <span className="rounded-full bg-[#F97316]/10 px-3 py-1 text-sm text-[#F97316]">
              {artwork.category}
            </span>

            <h1 className="mt-5 text-4xl font-bold">
              {artwork.title}
            </h1>

            <p className="mt-4 flex items-center gap-2 text-slate-400">
              <User size={17} />

              by{" "}
              <strong className="text-white">
                {
                  artwork.artistName
                }
              </strong>
            </p>

            <p className="mt-6 text-3xl font-bold text-[#F97316]">
              $
              {Number(
                artwork.price
              ).toFixed(2)}
            </p>

            <p className="mt-8 leading-7 text-slate-400">
              {artwork.description}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 p-5">
                <Palette size={17} />

                <p className="mt-2 font-semibold">
                  {artwork.category}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 p-5">
                <CalendarDays size={17} />

                <p className="mt-2 font-semibold">
                  {uploadedDate}
                </p>
              </div>
            </div>

            {errorMessage && (
              <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                {errorMessage}
              </div>
            )}

            {isSold ? (
              <button
                disabled
                className="mt-8 w-full rounded-xl border border-white/10 bg-white/[0.04] py-4 text-slate-500"
              >
                Sold
              </button>
            ) : (
              <button
                onClick={
                  handleBuyArtwork
                }
                disabled={isBuying}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] py-4 font-semibold"
              >
                {isBuying ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <ShoppingBag size={18} />
                )}

                {isBuying
                  ? "Opening Checkout..."
                  : "Buy Artwork"}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}