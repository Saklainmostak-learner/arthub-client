"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ImageIcon,
  Loader2,
  Palette,
  Tag,
  User,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";
import { API_URL } from "@/lib/api";

export default function AddArtworkPage() {
  const router = useRouter();

  const [session, setSession] = useState(null);
  const [isSessionLoading, setIsSessionLoading] =
    useState(true);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [formData, setFormData] = useState({
    title: "",
    image: "",
    category: "",
    price: "",
    description: "",
  });

  useEffect(() => {
    const loadSession = async () => {
      try {
        const { data } =
          await authClient.getSession();

        if (!data?.user) {
          router.push("/login");
          return;
        }

        if (data.user.role !== "artist") {
          router.push("/dashboard");
          return;
        }

        setSession(data);
      } catch (error) {
        console.error(
          "Failed to load session:",
          error
        );

        router.push("/login");
      } finally {
        setIsSessionLoading(false);
      }
    };

    loadSession();
  }, [router]);

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    if (name === "price") {
      const decimalPattern =
        /^\d*\.?\d{0,2}$/;

      if (
        value === "" ||
        decimalPattern.test(value)
      ) {
        setFormData((previous) => ({
          ...previous,
          price: value,
        }));
      }

      return;
    }

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!session?.user) {
      toast.error(
        "Please sign in again."
      );
      return;
    }

    const numericPrice =
      Number(formData.price);

    if (
      !formData.price.trim() ||
      Number.isNaN(numericPrice) ||
      numericPrice <= 0
    ) {
      toast.error(
        "Please enter a valid price greater than 0."
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const artworkData = {
        title:
          formData.title.trim(),

        image:
          formData.image.trim(),

        category:
          formData.category,

        price:
          numericPrice,

        description:
          formData.description.trim(),
      };

      const response = await fetch(
        `${API_URL}/artworks`,
        {
          method: "POST",

          credentials: "include",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            artworkData
          ),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to publish artwork."
        );
      }

      toast.success(
        "Artwork published successfully."
      );

      setFormData({
        title: "",
        image: "",
        category: "",
        price: "",
        description: "",
      });

      router.push(
        "/dashboard/my-artworks"
      );

      router.refresh();
    } catch (error) {
      console.error(
        "Add artwork error:",
        error
      );

      toast.error(
        error.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSessionLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07111f]">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2
            className="animate-spin text-[#F97316]"
            size={20}
          />

          Checking artist account...
        </div>
      </main>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#07111f] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#F97316]">
            Artist Studio
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Publish New Artwork
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            Add an original piece to the
            ArtHub marketplace and make it
            discoverable to collectors.
          </p>
        </div>

        <div className="mt-10 rounded-[2rem] border border-white/10 bg-[#0b1625] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.25)] sm:p-8">
          <div className="mb-8 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#8B5CF6] via-[#EC4899] to-[#F97316] font-bold text-white">
              {session.user.name
                ?.charAt(0)
                ?.toUpperCase() || "A"}
            </div>

            <div>
              <p className="font-semibold text-white">
                {session.user.name}
              </p>

              <p className="text-sm text-slate-400">
                {session.user.email}
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Artwork Title
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#081321] px-4 py-3.5 focus-within:border-[#F97316]/50">
                <Palette
                  size={18}
                  className="text-slate-500"
                />

                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Midnight Reflections"
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="image"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Artwork Image URL
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#081321] px-4 py-3.5 focus-within:border-[#F97316]/50">
                <ImageIcon
                  size={18}
                  className="text-slate-500"
                />

                <input
                  id="image"
                  name="image"
                  type="url"
                  required
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/artwork.jpg"
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Category
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#081321] px-4 py-3.5 focus-within:border-[#F97316]/50">
                  <Tag
                    size={18}
                    className="text-slate-500"
                  />

                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-[#081321] text-sm text-white outline-none"
                  >
                    <option value="">
                      Select Category
                    </option>

                    <option value="Painting">
                      Painting
                    </option>

                    <option value="Digital Art">
                      Digital Art
                    </option>

                    <option value="Sculpture">
                      Sculpture
                    </option>

                    <option value="Photography">
                      Photography
                    </option>

                    <option value="Drawing">
                      Drawing
                    </option>

                    <option value="Mixed Media">
                      Mixed Media
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Price ($)
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#081321] px-4 py-3.5 focus-within:border-[#F97316]/50">
                  <span className="text-slate-500">
                    $
                  </span>

                  <input
                    id="price"
                    name="price"
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    required
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="250"
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                rows={6}
                required
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell collectors about the inspiration, medium, story, and details behind this artwork..."
                className="w-full resize-none rounded-xl border border-white/10 bg-[#081321] px-4 py-3.5 text-sm leading-6 text-white outline-none placeholder:text-slate-500 focus:border-[#F97316]/50"
              />
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <User
                  size={17}
                  className="text-[#F97316]"
                />

                Publishing as{" "}
                <strong className="text-white">
                  {session.user.name}
                </strong>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] px-5 py-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />

                  Publishing...
                </>
              ) : (
                "Publish Artwork"
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}