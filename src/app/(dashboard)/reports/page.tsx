"use client";

import { useState, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { PageLoader } from "@/components/ui/loading";
import { formatCurrency, formatDate } from "@/lib/format";

type ReportType = "income_statement" | "cash_flow" | "category_summary" | "transaction_detail";

const reportOptions: { value: ReportType; label: string }[] = [
  { value: "income_statement", label: "Laporan Laba Rugi" },
  { value: "cash_flow", label: "Laporan Arus Kas" },
  { value: "category_summary", label: "Ringkasan per Kategori" },
  { value: "transaction_detail", label: "Rincian Transaksi" },
];

export default function ReportsPage() {
  const [reportType, setReportType] = useState<ReportType>("income_statement");
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        type: reportType,
        startDate,
        endDate,
      });
      const res = await fetch(`/api/reports?${params}`);
      if (res.ok) {
        setData(await res.json());
      }
    } finally {
      setLoading(false);
    }
  }, [reportType, startDate, endDate]);

  const exportCSV = () => {
    if (!data) return;

    let csv = "";
    if (reportType === "income_statement") {
      const d = data as {
        income: { category: string; amount: number }[];
        expenses: { category: string; amount: number }[];
        totalIncome: number;
        totalExpense: number;
        netIncome: number;
      };
      csv = "Kategori,Tipe,Jumlah\n";
      d.income.forEach((i) => (csv += `${i.category},Pemasukan,${i.amount}\n`));
      d.expenses.forEach((e) => (csv += `${e.category},Pengeluaran,${e.amount}\n`));
      csv += `\nTotal Pemasukan,,${d.totalIncome}\n`;
      csv += `Total Pengeluaran,,${d.totalExpense}\n`;
      csv += `Laba Bersih,,${d.netIncome}\n`;
    } else if (reportType === "transaction_detail") {
      const d = data as {
        data: {
          date: string;
          type: string;
          category: { name: string };
          description: string;
          amount: number;
        }[];
      };
      csv = "Tanggal,Tipe,Kategori,Deskripsi,Jumlah\n";
      d.data.forEach((t) => {
        csv += `${new Date(t.date).toLocaleDateString("id-ID")},${t.type},${t.category.name},"${t.description || ""}",${t.amount}\n`;
      });
    } else if (reportType === "category_summary") {
      const d = data as {
        data: { category: string; type: string; total: number; count: number }[];
      };
      csv = "Kategori,Tipe,Total,Jumlah Transaksi\n";
      d.data.forEach((s) => {
        csv += `${s.category},${s.type},${s.total},${s.count}\n`;
      });
    }

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `laporan-${reportType}-${startDate}-${endDate}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Laporan</h1>
        <p className="text-sm text-gray-500">
          Buat dan ekspor laporan keuangan
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Laporan</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as ReportType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-500"
            >
              {reportOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dari</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sampai</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
          <button onClick={fetchReport} className="bg-primary-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-600 active:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            Buat Laporan
          </button>
          {data && (
            <button onClick={exportCSV} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 active:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Ekspor CSV
            </button>
          )}
        </div>
      </div>

      {loading && <PageLoader />}

      {data && !loading && (
        <div className="space-y-6">
          {reportType === "income_statement" && <IncomeStatement data={data} />}
          {reportType === "cash_flow" && <CashFlowReport data={data} />}
          {reportType === "category_summary" && <CategorySummaryReport data={data} />}
          {reportType === "transaction_detail" && <TransactionDetailReport data={data} />}
        </div>
      )}

      {!data && !loading && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm py-16 text-center text-sm text-gray-400">
          Pilih jenis laporan dan periode, lalu klik &quot;Buat Laporan&quot;
        </div>
      )}
    </div>
  );
}

function IncomeStatement({ data }: { data: Record<string, unknown> }) {
  const d = data as {
    income: { category: string; amount: number }[];
    expenses: { category: string; amount: number }[];
    totalIncome: number;
    totalExpense: number;
    netIncome: number;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="border-b border-gray-200 bg-primary-500 px-6 py-4">
        <h2 className="text-lg font-semibold text-white">Laporan Laba Rugi</h2>
      </div>
      <div className="p-6">
        <div className="mb-6">
          <h3 className="mb-3 text-sm font-semibold uppercase text-green-600">
            Pendapatan
          </h3>
          {d.income.map((i, idx) => (
            <div key={idx} className="flex justify-between border-b border-gray-100 py-2 text-sm">
              <span className="text-gray-600">{i.category}</span>
              <span className="font-medium text-gray-900">{formatCurrency(i.amount)}</span>
            </div>
          ))}
          <div className="mt-2 flex justify-between py-2 text-sm font-semibold">
            <span className="text-green-600">Total Pendapatan</span>
            <span className="text-green-600">{formatCurrency(d.totalIncome)}</span>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="mb-3 text-sm font-semibold uppercase text-red-600">
            Beban / Pengeluaran
          </h3>
          {d.expenses.map((e, idx) => (
            <div key={idx} className="flex justify-between border-b border-gray-100 py-2 text-sm">
              <span className="text-gray-600">{e.category}</span>
              <span className="font-medium text-gray-900">{formatCurrency(e.amount)}</span>
            </div>
          ))}
          <div className="mt-2 flex justify-between py-2 text-sm font-semibold">
            <span className="text-red-600">Total Pengeluaran</span>
            <span className="text-red-600">{formatCurrency(d.totalExpense)}</span>
          </div>
        </div>

        <div className="border-t-2 border-gray-800 pt-3">
          <div className="flex justify-between text-lg font-bold">
            <span>Laba / Rugi Bersih</span>
            <span className={d.netIncome >= 0 ? "text-green-600" : "text-red-600"}>
              {formatCurrency(d.netIncome)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CashFlowReport({ data }: { data: Record<string, unknown> }) {
  const d = data as {
    entries: {
      date: string;
      type: string;
      category: string;
      description: string;
      amount: number;
      balance: number;
    }[];
    totalInflow: number;
    totalOutflow: number;
    netCashFlow: number;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="border-b border-gray-200 bg-primary-500 px-6 py-4">
        <h2 className="text-lg font-semibold text-white">Laporan Arus Kas</h2>
      </div>
      <div className="p-6">
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-green-50 p-4 text-center">
            <p className="text-sm text-green-600">Total Arus Masuk</p>
            <p className="text-xl font-bold text-green-700">{formatCurrency(d.totalInflow)}</p>
          </div>
          <div className="rounded-lg bg-red-50 p-4 text-center">
            <p className="text-sm text-red-600">Total Arus Keluar</p>
            <p className="text-xl font-bold text-red-700">{formatCurrency(d.totalOutflow)}</p>
          </div>
          <div className="rounded-lg bg-blue-50 p-4 text-center">
            <p className="text-sm text-blue-600">Arus Kas Bersih</p>
            <p className="text-xl font-bold text-blue-700">{formatCurrency(d.netCashFlow)}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3 text-left">Tanggal</th>
                <th className="px-4 py-3 text-left">Kategori</th>
                <th className="px-4 py-3 text-left">Deskripsi</th>
                <th className="px-4 py-3 text-right">Jumlah</th>
                <th className="px-4 py-3 text-right">Saldo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {d.entries.map((entry, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-600">{formatDate(entry.date)}</td>
                  <td className="px-4 py-2 text-sm">{entry.category}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{entry.description || "-"}</td>
                  <td className={`px-4 py-2 text-right text-sm font-medium ${entry.type === "INCOME" ? "text-green-600" : "text-red-600"}`}>
                    {entry.type === "INCOME" ? "+" : "-"}{formatCurrency(entry.amount)}
                  </td>
                  <td className="px-4 py-2 text-right text-sm font-medium text-gray-900">
                    {formatCurrency(entry.balance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CategorySummaryReport({ data }: { data: Record<string, unknown> }) {
  const d = data as {
    data: { category: string; type: string; color: string; total: number; count: number }[];
  };

  const chartData = d.data.map((item) => ({
    name: item.category,
    amount: item.total,
    fill: item.color,
  }));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Grafik Ringkasan Kategori
        </h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis type="number" tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}jt`} />
              <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Bar dataKey="amount" name="Total" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, i) => (
                  <Bar key={i} dataKey="amount" fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-6 py-3 text-left">Kategori</th>
              <th className="px-6 py-3 text-left">Tipe</th>
              <th className="px-6 py-3 text-right">Total</th>
              <th className="px-6 py-3 text-right">Jumlah Transaksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {d.data.map((item, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-6 py-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.category}
                  </div>
                </td>
                <td className="px-6 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${item.type === "INCOME" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                    {item.type === "INCOME" ? "Pemasukan" : "Pengeluaran"}
                  </span>
                </td>
                <td className="px-6 py-3 text-right text-sm font-medium">{formatCurrency(item.total)}</td>
                <td className="px-6 py-3 text-right text-sm text-gray-600">{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TransactionDetailReport({ data }: { data: Record<string, unknown> }) {
  const d = data as {
    data: {
      id: string;
      date: string;
      type: string;
      amount: number;
      description: string;
      reference: string;
      category: { name: string; color: string };
      user: { name: string };
    }[];
    total: number;
    count: number;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-200 bg-primary-500 px-6 py-4">
        <h2 className="text-lg font-semibold text-white">
          Rincian Transaksi
        </h2>
        <span className="rounded-full bg-white/20 px-3 py-1 text-sm text-white">
          {d.count} transaksi
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-6 py-3 text-left">Tanggal</th>
              <th className="px-6 py-3 text-left">Tipe</th>
              <th className="px-6 py-3 text-left">Kategori</th>
              <th className="px-6 py-3 text-left">Deskripsi</th>
              <th className="px-6 py-3 text-left">Ref</th>
              <th className="px-6 py-3 text-right">Jumlah</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {d.data.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-3 text-sm text-gray-600">{formatDate(tx.date)}</td>
                <td className="px-6 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${tx.type === "INCOME" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                    {tx.type === "INCOME" ? "Masuk" : "Keluar"}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm">{tx.category.name}</td>
                <td className="max-w-[200px] truncate px-6 py-3 text-sm text-gray-600">{tx.description || "-"}</td>
                <td className="px-6 py-3 text-sm text-gray-500">{tx.reference || "-"}</td>
                <td className={`whitespace-nowrap px-6 py-3 text-right text-sm font-semibold ${tx.type === "INCOME" ? "text-green-600" : "text-red-600"}`}>
                  {tx.type === "INCOME" ? "+" : "-"}{formatCurrency(tx.amount)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td colSpan={5} className="px-6 py-3 text-sm font-semibold text-gray-900">Total</td>
              <td className={`px-6 py-3 text-right text-sm font-bold ${d.total >= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatCurrency(d.total)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
