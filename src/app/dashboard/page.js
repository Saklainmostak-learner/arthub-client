"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Heart,
  Loader2,
  Palette,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Store,
  TrendingUp,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

export default function DashboardPage() {
  const router = useRouter();

  const [session, setSession] =
    useState(null);

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const { data } =
          await authClient.getSession();

        if (!data?.user) {
          router.push("/login");
          return;
        }

        setSession(data);
      } catch (error) {
        console.error(
          "Dashboard session error:",
          error
        );

        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, [router]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07111f]">
        <Loader2
          className="animate-spin text-[#F97316]"
        />
      </main>
    );
  }

  if (!session?.user) {
    return null;
  }

  const user =
    session.user;

  const role =
    user.role || "user";

  if (role === "admin") {
    return (
      <main className="min-h-screen bg-[#07111f] px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#F97316]">
            Administration
          </p>

          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
            Admin Dashboard
          </h1>

          <p className="mt-4 text-slate-400">
            Welcome back,{" "}
            <strong className="text-white">
              {user.name}
            </strong>
            .
          </p>

          <Link
            href="/dashboard/admin"
            className="mt-10 block max-w-md rounded-2xl border border-[#F97316]/30 bg-[#0d1928] p-7 transition hover:-translate-y-1"
          >
            <ShieldCheck
              size={26}
              className="text-[#F97316]"
            />

            <h2 className="mt-5 text-xl font-bold">
              Manage ArtHub
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Manage users, artworks,
              transactions, roles, and platform
              statistics.
            </p>
          </Link>
        </div>
      </main>
    );
  }

  const isArtist =
    role === "artist";

  return (
    <main className="min-h-screen bg-[#07111f] px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#F97316]">
          {isArtist
            ? "Artist Studio"
            : "Collector Space"}
        </p>

        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
          Dashboard
        </h1>

        <p className="mt-4 text-slate-400">
          Welcome back,{" "}
          <strong className="text-white">
            {user.name}
          </strong>
          .
        </p>

        {isArtist ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <DashboardCard
              href="/artworks"
              icon={Palette}
              title="Browse Artworks"
              description="Explore the ArtHub marketplace."
            />

            <DashboardCard
              href="/dashboard/add-artwork"
              icon={Plus}
              title="Add Artwork"
              description="Publish a new original piece."
            />

            <DashboardCard
              href="/dashboard/my-artworks"
              icon={Store}
              title="Manage Artworks"
              description="Edit and manage published work."
            />

            <DashboardCard
              href="/dashboard/sales"
              icon={TrendingUp}
              title="Sales History"
              description="Track sales and revenue."
            />
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <DashboardCard
              href="/artworks"
              icon={Palette}
              title="Browse Artworks"
              description="Discover original artwork."
            />

            <DashboardCard
              href="/dashboard/favorites"
              icon={Heart}
              title="My Favorites"
              description="Revisit saved artworks."
            />

            <DashboardCard
              href="/dashboard/my-collection"
              icon={ShoppingBag}
              title="My Collection"
              description="View purchased artworks."
            />
          </div>
        )}
      </div>
    </main>
  );
}

function DashboardCard({
  href,
  icon: Icon,
  title,
  description,
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-white/10 bg-[#0d1928] p-6 transition hover:-translate-y-1 hover:border-[#F97316]/30"
    >
      <Icon className="text-[#F97316]" />

      <h2 className="mt-5 text-lg font-bold">
        {title}
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {description}
      </p>
    </Link>
  );
}