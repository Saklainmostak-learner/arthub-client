"use client";

import Link from "next/link";
import {
  Suspense,
  useEffect,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Loader2,
  ShoppingBag,
  XCircle,
} from "lucide-react";

import { API_URL } from "@/lib/api";

function PaymentSuccessContent() {
  const searchParams =
    useSearchParams();

  const sessionId =
    searchParams.get(
      "session_id"
    );

  const [isLoading, setIsLoading] =
    useState(true);

  const [purchase, setPurchase] =
    useState(null);

  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    const confirmPayment = async () => {
      if (!sessionId) {
        setErrorMessage(
          "Stripe session ID could not be found."
        );

        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/purchases/confirm-payment`,
          {
            method: "POST",

            credentials: "include",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              sessionId,
            }),
          }
        );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Unable to confirm payment."
          );
        }

        setPurchase(
          result.data
        );
      } catch (error) {
        setErrorMessage(
          error.message ||
            "Something went wrong while confirming payment."
        );
      } finally {
        setIsLoading(false);
      }
    };

    confirmPayment();
  }, [sessionId]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07111f] text-white">
        <Loader2 className="animate-spin text-[#F97316]" />
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07111f] px-4 text-white">
        <div className="max-w-xl text-center">
          <XCircle
            size={40}
            className="mx-auto text-red-400"
          />

          <h1 className="mt-5 text-3xl font-bold">
            Payment confirmation failed
          </h1>

          <p className="mt-4 text-slate-400">
            {errorMessage}
          </p>

          <Link
            href="/artworks"
            className="mt-7 inline-flex rounded-xl bg-[#F97316] px-5 py-3"
          >
            Browse Artworks
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#07111f] px-4 text-white">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#0b1625] p-8 text-center">
        <CheckCircle2
          size={42}
          className="mx-auto text-emerald-400"
        />

        <p className="mt-6 uppercase tracking-widest text-[#F97316]">
          Payment Successful
        </p>

        <h1 className="mt-3 text-3xl font-bold">
          Artwork added to your collection
        </h1>

        {purchase && (
          <div className="mt-8 rounded-2xl border border-white/10 p-5 text-left">
            <p className="font-bold">
              {
                purchase.artworkTitle
              }
            </p>

            <p className="mt-2 text-slate-400">
              by{" "}
              {
                purchase.artistName
              }
            </p>

            <p className="mt-4 text-xl font-bold text-[#F97316]">
              $
              {Number(
                purchase.amount
              ).toFixed(2)}
            </p>
          </div>
        )}

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link
            href="/dashboard"
            className="rounded-xl border border-white/10 p-3"
          >
            Go to Dashboard
          </Link>

          <Link
            href="/artworks"
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] p-3"
          >
            <ShoppingBag size={17} />
            Browse More
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#07111f]">
          <Loader2 className="animate-spin text-[#F97316]" />
        </main>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}