"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  useParams,
  useRouter,
} from "next/navigation";
import {
  ArrowLeft,
  ImageIcon,
  Loader2,
  Palette,
  Save,
  Tag,
  User,
} from "lucide-react";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";
import { API_URL } from "@/lib/api";

export default function EditArtworkPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] =
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
    const loadPage = async () => {
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
            result.message
          );
        }

        const artwork = result.data;

        if (
          artwork.artistEmail
            ?.trim()
            .toLowerCase() !==
          data.user.email
            ?.trim()
            .toLowerCase()
        ) {
          toast.error(
            "You can only edit your own artworks."
          );

          router.push(
            "/dashboard/my-artworks"
          );

          return;
        }

        if (artwork.sold) {
          toast.error(
            "Sold artworks cannot be edited."
          );

          router.push(
            "/dashboard/my-artworks"
          );

          return;
        }

        setFormData({
          title:
            artwork.title || "",
          image:
            artwork.image || "",
          category:
            artwork.category || "",
          price:
            String(
              artwork.price ?? ""
            ),
          description:
            artwork.description ||
            "",
        });
      } catch (error) {
        toast.error(
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
  }, [id, router]);

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    if (name === "price") {
      if (
        value === "" ||
        /^\d*\.?\d{0,2}$/.test(
          value
        )
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

    const price =
      Number(formData.price);

    if (
      !Number.isFinite(price) ||
      price <= 0
    ) {
      toast.error(
        "Enter a valid price."
      );

      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(
        `${API_URL}/artworks/${id}`,
        {
          method: "PUT",

          credentials: "include",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            title:
              formData.title.trim(),
            image:
              formData.image.trim(),
            category:
              formData.category,
            price,
            description:
              formData.description.trim(),
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message
        );
      }

      toast.success(
        "Artwork updated successfully."
      );

      router.push(
        "/dashboard/my-artworks"
      );

      router.refresh();
    } catch (error) {
      toast.error(
        error.message ||
          "Unable to update artwork."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
      <div className="mx-auto max-w-4xl">
        <Link
          href="/dashboard/my-artworks"
          className="flex items-center gap-2 text-sm text-slate-400"
        >
          <ArrowLeft size={17} />
          Back to Manage Artworks
        </Link>

        <h1 className="mt-8 text-4xl font-bold">
          Edit Artwork
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-6 rounded-3xl border border-white/10 bg-[#0b1625] p-6"
        >
          <div>
            <label className="mb-2 block text-sm">
              Title
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#081321] px-4 py-3">
              <Palette size={18} />

              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm">
              Image URL
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#081321] px-4 py-3">
              <ImageIcon size={18} />

              <input
                name="image"
                type="url"
                value={formData.image}
                onChange={handleChange}
                required
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm">
                Category
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#081321] px-4 py-3">
                <Tag size={18} />

                <select
                  name="category"
                  value={
                    formData.category
                  }
                  onChange={
                    handleChange
                  }
                  required
                  className="w-full bg-[#081321] outline-none"
                >
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
              <label className="mb-2 block text-sm">
                Price
              </label>

              <input
                name="price"
                value={formData.price}
                onChange={handleChange}
                inputMode="decimal"
                required
                className="w-full rounded-xl border border-white/10 bg-[#081321] px-4 py-3 outline-none"
              />
            </div>
          </div>

          <textarea
            name="description"
            value={
              formData.description
            }
            onChange={
              handleChange
            }
            rows={6}
            required
            className="w-full rounded-xl border border-white/10 bg-[#081321] px-4 py-3 outline-none"
          />

          <div className="flex items-center gap-2 text-sm text-slate-400">
            <User size={17} />
            Editing as{" "}
            {session.user.name}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] py-4 font-semibold"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Save size={18} />
            )}

            {isSubmitting
              ? "Updating..."
              : "Update Artwork"}
          </button>
        </form>
      </div>
    </main>
  );
}