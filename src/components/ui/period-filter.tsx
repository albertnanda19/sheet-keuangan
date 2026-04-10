"use client";

import { useUIStore } from "@/store/ui-store";
import { PeriodFilter as PeriodFilterType } from "@/types";

const periodOptions: { value: PeriodFilterType; label: string }[] = [
  { value: "today", label: "Hari Ini" },
  { value: "this_week", label: "Minggu Ini" },
  { value: "this_month", label: "Bulan Ini" },
  { value: "this_quarter", label: "Kuartal Ini" },
  { value: "this_year", label: "Tahun Ini" },
  { value: "custom", label: "Custom" },
];

export function PeriodFilter() {
  const { periodFilter, setPeriodFilter, customDateRange, setCustomDateRange } =
    useUIStore();

  return (
    <div className="flex flex-wrap items-center gap-2">
      {periodOptions.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setPeriodFilter(opt.value)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            periodFilter === opt.value
              ? "bg-primary-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {opt.label}
        </button>
      ))}

      {periodFilter === "custom" && (
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={customDateRange?.start || ""}
            onChange={(e) =>
              setCustomDateRange({
                start: e.target.value,
                end: customDateRange?.end || "",
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-500 !w-auto !py-1.5 text-sm"
          />
          <span className="text-gray-400">-</span>
          <input
            type="date"
            value={customDateRange?.end || ""}
            onChange={(e) =>
              setCustomDateRange({
                start: customDateRange?.start || "",
                end: e.target.value,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-500 !w-auto !py-1.5 text-sm"
          />
        </div>
      )}
    </div>
  );
}
