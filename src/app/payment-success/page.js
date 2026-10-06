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
  const searchParams = useSearchParams();

  const sessionId =
    searchParams.get("session_id");

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
              "Unable to confirm your payment."
          );
        }

        setPurchase(result.data);
      } catch (error) {
        console.error(
          "Payment confirmation error:",
          error
        );

        setErrorMessage(
          error.message ||
            "Something went wrong while confirming the payment."
        );
      } finally {
        setIsLoading(false);
      }
    };

    confirmPayment();
  }, [sessionId]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07111f] px-4 text-white">
        <div className="text-center">
          <Loader2
            size={38}
            className="mx-auto animate-spin text-[#F97316]"
          />

          <h1 className="mt-5 text-2xl font-bold">
            Confirming your payment
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Please wait while ArtHub verifies your
            purchase.
          </p>
        </div>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07111f] px-4 py-16 text-white">
        <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-[#0b1625] p-8 text-center sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-400">
            <XCircle size={32} />
          </div>

          <h1 className="mt-6 text-3xl font-bold">
            Payment confirmation failed
          </h1>

          <p className="mt-4 text-sm leading-6 text-slate-400">
            {errorMessage}
          </p>

          <Link
            href="/artworks"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] px-6 py-3 text-sm font-semibold text-white"
          >
            <ShoppingBag size={17} />
            Browse Artworks
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#07111f] px-4 py-16 text-white">
      <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-[#0b1625] p-8 text-center shadow-[0_30px_80px_rgba(0,0,0,0.3)] sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
          <CheckCircle2 size={34} />
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.25em] text-[#F97316]">
          Payment Successful
        </p>

        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
          Artwork added to your collection
        </h1>

        <p className="mt-4 text-sm leading-6 text-slate-400">
          Your payment has been confirmed and your
          purchase has been saved successfully.
        </p>

        {purchase && (
          <div className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Artwork
              </p>

              <p className="mt-1 font-semibold text-white">
                {purchase.artworkTitle}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Artist
              </p>

              <p className="mt-1 text-sm text-white">
                {purchase.artistName}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Amount Paid
              </p>

              <p className="mt-1 text-xl font-bold text-[#F97316]">
                $
                {Number(
                  purchase.amount
                ).toFixed(2)}
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link
            href="/dashboard"
            className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.05]"
          >
            Go to Dashboard
          </Link>

          <Link
            href="/artworks"
            className="rounded-xl bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Browse More Art
          </Link>
        </div>
      </div>
    </main>
  );
}

function PaymentLoadingFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#07111f] px-4 text-white">
      <div className="text-center">
        <Loader2
          size={38}
          className="mx-auto animate-spin text-[#F97316]"
        />

        <h1 className="mt-5 text-2xl font-bold">
          Loading payment details
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Preparing your payment confirmation...
        </p>
      </div>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={<PaymentLoadingFallback />}
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}