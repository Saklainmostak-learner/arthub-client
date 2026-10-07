"use client";

import { useEffect } from "react";
import Link from "next/link";

import {
  AlertTriangle,
  Home,
  RefreshCw,
} from "lucide-react";

export default function Error({
  error,
  reset,
}) {
  useEffect(() => {
    console.error(
      "ArtHub application error:",
      error
    );
  }, [error]);

  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-[#07111f] px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-[#0b1625] p-7 text-center shadow-[0_30px_90px_rgba(0,0,0,0.28)] sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#F97316]/20 bg-[#F97316]/10 text-[#F97316]">
          <AlertTriangle size={30} />
        </div>

        <p className="mt-7 text-sm font-semibold uppercase tracking-[0.25em] text-[#F97316]">
          Something went wrong
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          ArtHub hit an unexpected error.
        </h1>

        <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-slate-400 sm:text-base">
          We couldn&apos;t complete this request.
          You can try loading the page again or
          return to the ArtHub homepage.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] px-6 py-3.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <RefreshCw size={17} />
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/[0.07]"
          >
            <Home size={17} />
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}