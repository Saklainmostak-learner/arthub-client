"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Loader2,
  ShoppingBag,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { API_URL } from "@/lib/api";

export default function MyCollectionPage() {
  const router = useRouter();

  const [session, setSession] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] =
    useState(true);
  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    const loadCollection = async () => {
      try {
        const { data } =
          await authClient.getSession();

        if (!data?.user) {
          router.push("/login");
          return;
        }

        if (data.user.role !== "user") {
          router.push("/dashboard");
          return;
        }

        setSession(data);

        const response = await fetch(
          `${API_URL}/purchases/buyer/${encodeURIComponent(
            data.user.email
          )}`,
          {
            cache: "no-store",
            credentials: "include",
          }
        );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message
          );
        }

        setPurchases(
          result.data || []
        );
      } catch (error) {
        setErrorMessage(
          error.message ||
            "Unable to load your collection."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadCollection();
  }, [router]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07111f]">
        <Loader2 className="animate-spin text-[#F97316]" />
      </main>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#07111f] px-4 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-sm text-slate-400"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        <h1 className="mt-8 text-4xl font-bold">
          My Collection
        </h1>

        {errorMessage && (
          <div className="mt-8 rounded-xl bg-red-500/10 p-4 text-red-300">
            {errorMessage}
          </div>
        )}

        {!errorMessage &&
          purchases.length === 0 && (
            <div className="mt-10 rounded-3xl border border-dashed border-white/10 py-16 text-center">
              <ShoppingBag className="mx-auto text-[#F97316]" />

              <h2 className="mt-4 text-xl font-bold">
                Your collection is empty
              </h2>
            </div>
          )}

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {purchases.map(
            (purchase) => {
              const date =
                purchase.purchasedAt
                  ? new Date(
                      purchase.purchasedAt
                    ).toLocaleDateString()
                  : "Unknown";

              return (
                <article
                  key={
                    purchase._id
                  }
                  className="rounded-2xl border border-white/10 bg-[#0d1928] p-5"
                >
                  <ShoppingBag className="text-[#F97316]" />

                  <h2 className="mt-5 text-xl font-bold">
                    {
                      purchase.artworkTitle
                    }
                  </h2>

                  <p className="mt-2 text-slate-400">
                    by{" "}
                    {
                      purchase.artistName
                    }
                  </p>

                  <p className="mt-5 text-2xl font-bold text-[#F97316]">
                    $
                    {Number(
                      purchase.amount
                    ).toFixed(2)}
                  </p>

                  <p className="mt-5 flex items-center gap-2 border-t border-white/10 pt-4 text-xs text-slate-500">
                    <CalendarDays size={15} />
                    Purchased {date}
                  </p>
                </article>
              );
            }
          )}
        </div>
      </div>
    </main>
  );
}