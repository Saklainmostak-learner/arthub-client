import { SearchX } from "lucide-react";

export default function EmptyArtworks() {
  return (
    <div className="mt-10 flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.03] px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F97316]/10 text-[#F97316]">
        <SearchX size={26} />
      </div>

      <h2 className="mt-5 text-xl font-semibold text-white">
        No artworks found
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
        Try changing your search, category, price range, or sorting options to
        discover more artwork.
      </p>
    </div>
  );
}