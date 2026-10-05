import Link from "next/link";
import {
  Brush,
  MonitorUp,
  Landmark,
  Camera,
  PenTool,
  Shapes,
} from "lucide-react";

const categories = [
  {
    name: "Painting",
    slug: "painting",
    icon: Brush,
    description: "Original works created with expressive brushwork and color.",
  },
  {
    name: "Digital Art",
    slug: "digital",
    icon: MonitorUp,
    description: "Modern artwork created through digital tools and techniques.",
  },
  {
    name: "Sculpture",
    slug: "sculpture",
    icon: Landmark,
    description: "Three-dimensional artistic forms crafted with character.",
  },
  {
    name: "Photography",
    slug: "photography",
    icon: Camera,
    description: "Fine-art photography capturing mood, place, and story.",
  },
  {
    name: "Drawing",
    slug: "drawing",
    icon: PenTool,
    description: "Illustrative pieces built from line, texture, and detail.",
  },
  {
    name: "Mixed Media",
    slug: "mixed-media",
    icon: Shapes,
    description: "Creative combinations of materials, methods, and styles.",
  },
];

export default function ArtCategories() {
  return (
    <section className="bg-[#07111f] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-[#F97316]">
            Explore by Style
          </p>

          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Art Categories
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            Browse artwork by medium and discover the styles that match your
            taste.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.slug}
                href={`/artworks?category=${category.slug}`}
                className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#F97316]/40 hover:bg-white/[0.06]"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#8B5CF6]/20 via-[#EC4899]/20 to-[#F97316]/20 text-[#F97316]">
                  <Icon size={22} />
                </div>

                <h3 className="text-sm font-semibold text-white sm:text-base">
                  {category.name}
                </h3>

                <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-400">
                  {category.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}