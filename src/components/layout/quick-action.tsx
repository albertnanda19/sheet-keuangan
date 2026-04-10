"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function QuickAction() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-3 flex flex-col gap-2">
          <button
            onClick={() => {
              setOpen(false);
              router.push("/transactions?action=add&type=INCOME");
            }}
            className="flex items-center gap-2 rounded-full bg-green-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg hover:bg-green-600"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
            Pemasukan
          </button>
          <button
            onClick={() => {
              setOpen(false);
              router.push("/transactions?action=add&type=EXPENSE");
            }}
            className="flex items-center gap-2 rounded-full bg-red-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg hover:bg-red-600"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
            </svg>
            Pengeluaran
          </button>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className={`flex h-14 w-14 items-center justify-center rounded-full bg-primary-500 text-white shadow-lg transition-transform hover:bg-primary-600 ${
          open ? "rotate-45" : ""
        }`}
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}
