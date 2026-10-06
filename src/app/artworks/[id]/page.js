"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useState,
} from "react";
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
        setIsLoading(true);
        setErrorMessage("");

        const artworkResponse = await fetch(
          `${API_URL}/artworks/${id}`,
          {
            cache: "no-store",
          }
        );

        const artworkResult =
          await artworkResponse.json();

        if (!artworkResponse.ok) {
          throw new Error(
            artworkResult.message ||
              "Failed to load artwork."
          );
        }

        setArtwork(artworkResult.data);

        try {
          const { data } =
            await authClient.getSession();

          setSession(data || null);
        } catch (sessionError) {
          console.error(
            "Failed to load session:",
            sessionError
          );

          setSession(null);
        }
      } catch (error) {
        console.error(
          "Failed to fetch artwork:",
          error
        );

        setErrorMessage(
          error.message ||
            "Unable to load this artwork."
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
    setErrorMessage("");

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

    if (
      session.user.email ===
      artwork.artistEmail
    ) {
      setErrorMessage(
        "You cannot purchase your own artwork."
      );

      return;
    }

    try {
      setIsBuying(true);

      const response = await fetch(
        `${API_URL}/purchases/create-checkout-session`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            artworkId: artwork._id,
            buyerName: session.user.name,
            buyerEmail: session.user.email,
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

      if (!result.url) {
        throw new Error(
          "Stripe checkout URL was not returned."
        );
      }

      window.location.href =
        result.url;
    } catch (error) {
      console.error(
        "Buy artwork error:",
        error
      );

      setErrorMessage(
        error.message ||
          "Something went wrong while starting checkout."
      );
    } finally {
      setIsBuying(false);
    }
  };

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

  if (errorMessage && !artwork) {
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
              {errorMessage}
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

  if (!artwork) {
    return null;
  }

  const uploadedDate = artwork.createdAt
    ? new Date(
        artwork.createdAt
      ).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown";

  const isArtist =
    session?.user?.role === "artist";

  const isOwnArtwork =
    session?.user?.email ===
    artwork.artistEmail;

  const isSold =
    artwork.sold === true;

  return (
    <main className="min-h-screen bg-[#07111f] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/artworks"
          className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to Artworks
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b1625]">
            <div className="relative aspect-[4/5]">
              <Image
                src={artwork.image}
                alt={artwork.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className={`object-cover ${
                  isSold
                    ? "opacity-75"
                    : ""
                }`}
              />

              {isSold && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/15">
                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-500/90 px-5 py-2.5 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-2xl backdrop-blur">
                    <BadgeCheck
                      size={18}
                    />
                    Sold
                  </span>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex rounded-full border border-[#F97316]/30 bg-[#F97316]/10 px-3 py-1.5 text-xs font-semibold text-[#F97316]">
                {artwork.category}
              </span>

              {isSold && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                  <BadgeCheck
                    size={14}
                  />
                  Sold
                </span>
              )}
            </div>

            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
              {artwork.title}
            </h1>

            <div className="mt-5 flex items-center gap-2 text-sm text-slate-400">
              <User size={17} />

              <span>
                Created by
              </span>

              <span className="font-semibold text-white">
                {artwork.artistName}
              </span>
            </div>

            <p className="mt-7 text-3xl font-bold text-[#F97316]">
              $
              {Number(
                artwork.price
              ).toFixed(2)}
            </p>

            <div className="my-8 h-px bg-white/10" />

            <section>
              <h2 className="text-xl font-bold">
                About this artwork
              </h2>

              <p className="mt-4 leading-7 text-slate-400">
                {artwork.description}
              </p>
            </section>

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

            <div className="mt-8 rounded-3xl border border-white/10 bg-[#0b1625] p-5 sm:p-6">
              {isSold ? (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300">
                    <BadgeCheck
                      size={23}
                    />
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-white">
                    This artwork has been sold
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    This original piece is no longer available
                    for purchase.
                  </p>

                  <button
                    type="button"
                    disabled
                    className="mt-5 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm font-semibold text-slate-500"
                  >
                    <BadgeCheck
                      size={18}
                    />
                    Sold
                  </button>
                </>
              ) : (
                <>
                  <p className="text-sm leading-6 text-slate-400">
                    Own this original piece and add it to your
                    ArtHub collection.
                  </p>

                  {errorMessage && (
                    <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                      {errorMessage}
                    </div>
                  )}

                  {isArtist ? (
                    <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4 text-center text-sm text-slate-400">
                      {isOwnArtwork
                        ? "This is your artwork."
                        : "Artist accounts cannot purchase artworks."}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={
                        handleBuyArtwork
                      }
                      disabled={
                        isBuying
                      }
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] px-5 py-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isBuying ? (
                        <>
                          <Loader2
                            size={18}
                            className="animate-spin"
                          />
                          Opening Checkout...
                        </>
                      ) : (
                        <>
                          <ShoppingBag
                            size={18}
                          />
                          Buy Artwork
                        </>
                      )}
                    </button>
                  )}

                  {!session?.user && (
                    <p className="mt-3 text-center text-xs text-slate-500">
                      You will be asked to sign in before
                      purchasing.
                    </p>
                  )}

                  {session?.user?.role ===
                    "user" && (
                    <p className="mt-3 text-center text-xs text-slate-500">
                      Secure checkout powered by Stripe.
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}