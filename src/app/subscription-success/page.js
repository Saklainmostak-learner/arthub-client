"use client";

import Link from "next/link";

import {
  Suspense,
  useEffect,
  useState,
} from "react";

import {
  CheckCircle2,
  Crown,
  Loader2,
  XCircle,
} from "lucide-react";

import { useSearchParams } from "next/navigation";

import { API_URL } from "@/lib/api";

function SubscriptionSuccessContent() {
  const searchParams =
    useSearchParams();

  const sessionId =
    searchParams.get(
      "session_id"
    );

  const [subscription, setSubscription] =
    useState(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    const confirmSubscription =
      async () => {
        if (!sessionId) {
          setErrorMessage(
            "Stripe session ID could not be found."
          );

          setIsLoading(false);
          return;
        }

        try {
          const response =
            await fetch(
              `${API_URL}/subscriptions/confirm`,
              {
                method: "POST",

                credentials:
                  "include",

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
                "Unable to confirm subscription."
            );
          }

          setSubscription(
            result.data
          );
        } catch (error) {
          setErrorMessage(
            error.message ||
              "Something went wrong while confirming your subscription."
          );
        } finally {
          setIsLoading(false);
        }
      };

    confirmSubscription();
  }, [sessionId]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07111f] text-white">
        <div className="text-center">
          <Loader2
            size={38}
            className="mx-auto animate-spin text-[#F97316]"
          />

          <h1 className="mt-5 text-2xl font-bold">
            Activating your membership
          </h1>
        </div>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07111f] px-4 text-white">
        <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#0b1625] p-8 text-center">
          <XCircle
            size={38}
            className="mx-auto text-red-400"
          />

          <h1 className="mt-5 text-3xl font-bold">
            Subscription confirmation failed
          </h1>

          <p className="mt-4 text-sm leading-6 text-slate-400">
            {errorMessage}
          </p>

          <Link
            href="/pricing"
            className="mt-7 inline-flex rounded-xl bg-[#F97316] px-5 py-3 text-sm font-semibold"
          >
            Back to Pricing
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#07111f] px-4 py-16 text-white">
      <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-[#0b1625] p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
          <CheckCircle2
            size={34}
          />
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.25em] text-[#F97316]">
          Membership Activated
        </p>

        <h1 className="mt-3 text-3xl font-bold">
          Welcome to ArtHub{" "}
          {subscription?.planName ||
            ""}
        </h1>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <Crown
            size={24}
            className="mx-auto text-[#F97316]"
          />

          <p className="mt-3 text-lg font-bold">
            {
              subscription?.planName
            }
          </p>

          <p className="mt-2 text-2xl font-bold text-[#F97316]">
            $
            {Number(
              subscription?.price ||
                0
            ).toFixed(2)}
            <span className="text-sm font-normal text-slate-500">
              {" "}
              / month
            </span>
          </p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link
            href="/dashboard"
            className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold"
          >
            Dashboard
          </Link>

          <Link
            href="/pricing"
            className="rounded-xl bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] px-5 py-3 text-sm font-semibold"
          >
            View Membership
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function SubscriptionSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#07111f]">
          <Loader2 className="animate-spin text-[#F97316]" />
        </main>
      }
    >
      <SubscriptionSuccessContent />
    </Suspense>
  );
}