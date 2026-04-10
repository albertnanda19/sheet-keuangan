"use client";

import { useEffect, useState, useCallback } from "react";
import { Category } from "@/types";
import { Modal } from "@/components/ui/modal";
import { PageLoader, Spinner } from "@/components/ui/loading";
import { useUIStore } from "@/store/ui-store";

const defaultColors = [
  "#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6",
  "#EC4899", "#06B6D4", "#84CC16", "#F97316", "#6366F1",
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [activeTab, setActiveTab] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const { addNotification } = useUIStore();

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const json = await res.json();
        setCategories(json.data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const filtered = categories.filter((c) => c.type === activeTab);

  const handleToggleActive = async (cat: Category) => {
    const res = await fetch("/api/categories", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: cat.id, isActive: !cat.isActive }),
    });
    if (res.ok) {
      addNotification(
        "success",
        cat.isActive ? "Kategori dinonaktifkan" : "Kategori diaktifkan"
      );
      fetchCategories();
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kategori</h1>
          <p className="text-sm text-gray-500">
            Kelola kategori pemasukan dan pengeluaran
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
          Tambah Kategori
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("EXPENSE")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "EXPENSE"
              ? "bg-red-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Pengeluaran
        </button>
        <button
          onClick={() => setActiveTab("INCOME")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "INCOME"
              ? "bg-green-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Pemasukan
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((cat) => (
          <div
            key={cat.id}
            className={`bg-white rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 p-4 ${!cat.isActive ? "opacity-50" : ""}`}
          >
            <div
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-lg"
              style={{ backgroundColor: `${cat.color || "#6B7280"}20`, color: cat.color || "#6B7280" }}
            >
              {cat.icon || cat.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{cat.name}</h3>
              <p className="text-xs text-gray-500">
                {cat._count?.transactions || 0} transaksi
              </p>
              {cat.children && cat.children.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {cat.children.map((sub) => (
                    <span
                      key={sub.id}
                      className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                    >
                      {sub.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => {
                  setEditing(cat);
                  setShowModal(true);
                }}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-primary-600"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => handleToggleActive(cat)}
                className={`rounded-lg p-1.5 ${
                  cat.isActive
                    ? "text-gray-400 hover:bg-red-50 hover:text-red-600"
                    : "text-gray-400 hover:bg-green-50 hover:text-green-600"
                }`}
              >
                {cat.isActive ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-sm text-gray-400">
            Belum ada kategori untuk tipe ini
          </div>
        )}
      </div>

      <CategoryModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditing(null);
        }}
        category={editing}
        activeTab={activeTab}
        onSave={() => {
          setShowModal(false);
          setEditing(null);
          fetchCategories();
        }}
      />
    </div>
  );
}

function CategoryModal({
  isOpen,
  onClose,
  category,
  activeTab,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  activeTab: "INCOME" | "EXPENSE";
  onSave: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const { addNotification } = useUIStore();
  const [form, setForm] = useState({
    name: "",
    type: activeTab,
    color: defaultColors[0],
    icon: "",
  });

  useEffect(() => {
    if (category) {
      setForm({
        name: category.name,
        type: category.type,
        color: category.color || defaultColors[0],
        icon: category.icon || "",
      });
    } else {
      setForm({
        name: "",
        type: activeTab,
        color: defaultColors[Math.floor(Math.random() * defaultColors.length)],
        icon: "",
      });
    }
  }, [category, isOpen, activeTab]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const method = category ? "PUT" : "POST";
      const body = category ? { id: category.id, ...form } : form;

      const res = await fetch("/api/categories", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        addNotification(
          "success",
          category ? "Kategori berhasil diperbarui" : "Kategori berhasil ditambahkan"
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
      title={category ? "Edit Kategori" : "Tambah Kategori"}
      size="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-500"
            placeholder="Nama kategori"
            required
          />
        </div>

        {!category && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipe</label>
            <select
              value={form.type}
              onChange={(e) =>
                setForm({
                  ...form,
                  type: e.target.value as "INCOME" | "EXPENSE",
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-500"
            >
              <option value="INCOME">Pemasukan</option>
              <option value="EXPENSE">Pengeluaran</option>
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Warna</label>
          <div className="flex flex-wrap gap-2">
            {defaultColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setForm({ ...form, color })}
                className={`h-8 w-8 rounded-full border-2 transition-all ${
                  form.color === color
                    ? "border-gray-800 scale-110"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ikon (emoji)</label>
          <input
            type="text"
            value={form.icon}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-500"
            placeholder="Contoh: 💰"
            maxLength={2}
          />
        </div>

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
            {category ? "Perbarui" : "Simpan"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
