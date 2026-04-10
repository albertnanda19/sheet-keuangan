"use client";

import { useEffect, useState, useCallback } from "react";
import { Budget, Category } from "@/types";
import { Modal } from "@/components/ui/modal";
import { PageLoader, Spinner } from "@/components/ui/loading";
import { useUIStore } from "@/store/ui-store";
import { formatCurrency } from "@/lib/format";

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Budget | null>(null);
  const { addNotification } = useUIStore();

  const fetchBudgets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/budgets");
      if (res.ok) {
        const json = await res.json();
        setBudgets(json.data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    const res = await fetch("/api/categories?type=EXPENSE");
    if (res.ok) {
      const json = await res.json();
      setCategories(json.data);
    }
  }, []);

  useEffect(() => {
    fetchBudgets();
    fetchCategories();
  }, [fetchBudgets, fetchCategories]);

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus anggaran ini?")) return;
    const res = await fetch("/api/budgets", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      addNotification("success", "Anggaran berhasil dihapus");
      fetchBudgets();
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Anggaran</h1>
          <p className="text-sm text-gray-500">
            Kelola anggaran per kategori pengeluaran
          </p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setShowModal(true);
          }}
          className="bg-primary-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-600 active:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Anggaran
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {budgets.map((budget) => (
          <div key={budget.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">
                  {budget.category.name}
                </h3>
                <p className="text-xs text-gray-500">
                  {budget.period === "MONTHLY"
                    ? "Bulanan"
                    : budget.period === "QUARTERLY"
                    ? "Kuartalan"
                    : "Tahunan"}
                </p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setEditing(budget);
                    setShowModal(true);
                  }}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-primary-600"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(budget.id)}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="mb-2 flex items-end justify-between">
              <span className="text-2xl font-bold text-gray-900">
                {formatCurrency(budget.amount)}
              </span>
              <span
                className={`text-sm font-semibold ${
                  (budget.percentage || 0) >= 100
                    ? "text-red-600"
                    : (budget.percentage || 0) >= 75
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                {budget.percentage || 0}%
              </span>
            </div>

            <div className="mb-2 h-2.5 overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full rounded-full transition-all ${
                  (budget.percentage || 0) >= 100
                    ? "bg-red-500"
                    : (budget.percentage || 0) >= 75
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
                style={{
                  width: `${Math.min(budget.percentage || 0, 100)}%`,
                }}
              />
            </div>

            <div className="flex justify-between text-xs text-gray-500">
              <span>Terpakai: {formatCurrency(budget.spent || 0)}</span>
              <span>
                Sisa: {formatCurrency(budget.amount - (budget.spent || 0))}
              </span>
            </div>

            {(budget.percentage || 0) >= 75 && (
              <div
                className={`mt-3 rounded-lg px-3 py-2 text-xs font-medium ${
                  (budget.percentage || 0) >= 100
                    ? "bg-red-50 text-red-700"
                    : "bg-yellow-50 text-yellow-700"
                }`}
              >
                {(budget.percentage || 0) >= 100
                  ? "Anggaran telah terlampaui!"
                  : "Anggaran hampir mencapai batas"}
              </div>
            )}
          </div>
        ))}

        {budgets.length === 0 && (
          <div className="col-span-full py-12 text-center text-sm text-gray-400">
            Belum ada anggaran. Klik tombol di atas untuk menambahkan.
          </div>
        )}
      </div>

      <BudgetModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditing(null);
        }}
        budget={editing}
        categories={categories}
        onSave={() => {
          setShowModal(false);
          setEditing(null);
          fetchBudgets();
        }}
      />
    </div>
  );
}

function BudgetModal({
  isOpen,
  onClose,
  budget,
  categories,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  budget: Budget | null;
  categories: Category[];
  onSave: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const { addNotification } = useUIStore();
  const [form, setForm] = useState({
    amount: "",
    period: "MONTHLY" as "MONTHLY" | "QUARTERLY" | "YEARLY",
    categoryId: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
  });

  useEffect(() => {
    if (budget) {
      setForm({
        amount: String(budget.amount),
        period: budget.period,
        categoryId: budget.categoryId,
        startDate: new Date(budget.startDate).toISOString().split("T")[0],
        endDate: new Date(budget.endDate).toISOString().split("T")[0],
      });
    } else {
      const now = new Date();
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      setForm({
        amount: "",
        period: "MONTHLY",
        categoryId: "",
        startDate: new Date(now.getFullYear(), now.getMonth(), 1)
          .toISOString()
          .split("T")[0],
        endDate: endOfMonth.toISOString().split("T")[0],
      });
    }
  }, [budget, isOpen]);

  const handlePeriodChange = (period: "MONTHLY" | "QUARTERLY" | "YEARLY") => {
    const now = new Date();
    let start: Date;
    let end: Date;

    switch (period) {
      case "MONTHLY":
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case "QUARTERLY": {
        const q = Math.floor(now.getMonth() / 3);
        start = new Date(now.getFullYear(), q * 3, 1);
        end = new Date(now.getFullYear(), q * 3 + 3, 0);
        break;
      }
      case "YEARLY":
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date(now.getFullYear(), 11, 31);
        break;
    }

    setForm({
      ...form,
      period,
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const method = budget ? "PUT" : "POST";
      const body = budget
        ? { id: budget.id, amount: Number(form.amount) }
        : { ...form, amount: Number(form.amount) };

      const res = await fetch("/api/budgets", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        addNotification(
          "success",
          budget ? "Anggaran berhasil diperbarui" : "Anggaran berhasil ditambahkan"
        );
        onSave();
      } else {
        const data = await res.json();
        addNotification("error", data.error || "Gagal menyimpan");
      }
    } catch {
      addNotification("error", "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={budget ? "Edit Anggaran" : "Tambah Anggaran"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {!budget && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select
                value={form.categoryId}
                onChange={(e) =>
                  setForm({ ...form, categoryId: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-500"
                required
              >
                <option value="">Pilih kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Periode</label>
              <select
                value={form.period}
                onChange={(e) =>
                  handlePeriodChange(
                    e.target.value as "MONTHLY" | "QUARTERLY" | "YEARLY"
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-500"
              >
                <option value="MONTHLY">Bulanan</option>
                <option value="QUARTERLY">Kuartalan</option>
                <option value="YEARLY">Tahunan</option>
              </select>
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Anggaran (Rp)</label>
          <input
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-500"
            placeholder="0"
            min="1"
            required
          />
        </div>

        {!budget && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Akhir</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) =>
                  setForm({ ...form, endDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-500"
                required
              />
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
          <button type="button" onClick={onClose} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 active:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            Batal
          </button>
          <button
            type="submit"
            disabled={saving}
            className="bg-primary-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-600 active:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? <Spinner size="sm" /> : null}
            {budget ? "Perbarui" : "Simpan"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
