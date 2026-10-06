"use client";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  if (totalPages <= 1) {
    return null;
  }

  const getVisiblePages = () => {
    const pages = [];

    const start = Math.max(
      1,
      currentPage - 2
    );

    const end = Math.min(
      totalPages,
      currentPage + 2
    );

    for (
      let page = start;
      page <= end;
      page += 1
    ) {
      pages.push(page);
    }

    return pages;
  };

  const pages =
    getVisiblePages();

  return (
    <nav
      className="mt-10 flex flex-wrap items-center justify-center gap-2"
      aria-label="Artwork pagination"
    >
      <button
        type="button"
        onClick={() =>
          onPageChange(
            currentPage - 1
          )
        }
        disabled={
          currentPage === 1
        }
        className="flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-slate-300 transition hover:border-[#F97316]/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft size={16} />

        <span className="hidden sm:inline">
          Previous
        </span>
      </button>

      {pages[0] > 1 && (
        <>
          <button
            type="button"
            onClick={() =>
              onPageChange(1)
            }
            className="h-10 min-w-10 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm font-semibold text-slate-300 transition hover:border-[#F97316]/40 hover:text-white"
          >
            1
          </button>

          {pages[0] > 2 && (
            <span className="px-1 text-slate-500">
              …
            </span>
          )}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() =>
            onPageChange(page)
          }
          aria-current={
            currentPage === page
              ? "page"
              : undefined
          }
          className={`h-10 min-w-10 rounded-xl px-3 text-sm font-semibold transition ${
            currentPage === page
              ? "bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] text-white"
              : "border border-white/10 bg-white/[0.04] text-slate-300 hover:border-[#F97316]/40 hover:text-white"
          }`}
        >
          {page}
        </button>
      ))}

      {pages[
        pages.length - 1
      ] < totalPages && (
        <>
          {pages[
            pages.length - 1
          ] <
            totalPages - 1 && (
            <span className="px-1 text-slate-500">
              …
            </span>
          )}

          <button
            type="button"
            onClick={() =>
              onPageChange(
                totalPages
              )
            }
            className="h-10 min-w-10 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm font-semibold text-slate-300 transition hover:border-[#F97316]/40 hover:text-white"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        type="button"
        onClick={() =>
          onPageChange(
            currentPage + 1
          )
        }
        disabled={
          currentPage ===
          totalPages
        }
        className="flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-slate-300 transition hover:border-[#F97316]/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        <span className="hidden sm:inline">
          Next
        </span>

        <ChevronRight size={16} />
      </button>
    </nav>
  );
}