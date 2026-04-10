import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonResponse, requireAuth, handleApiError } from "@/lib/api-utils";

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);
    const url = new URL(req.url);
    const reportType = url.searchParams.get("type") || "income_statement";
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    const start = startDate
      ? new Date(startDate)
      : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const end = endDate
      ? new Date(endDate + "T23:59:59")
      : new Date();

    switch (reportType) {
      case "income_statement":
        return jsonResponse(await getIncomeStatement(start, end));
      case "cash_flow":
        return jsonResponse(await getCashFlow(start, end));
      case "category_summary":
        return jsonResponse(await getCategorySummary(start, end));
      case "transaction_detail":
        return jsonResponse(await getTransactionDetail(req, start, end));
      default:
        return jsonResponse(await getIncomeStatement(start, end));
    }
  } catch (error) {
    return handleApiError(error);
  }
}

async function getIncomeStatement(start: Date, end: Date) {
  const incomeByCategory = await prisma.transaction.groupBy({
    by: ["categoryId"],
    where: { type: "INCOME", isVoided: false, date: { gte: start, lte: end } },
    _sum: { amount: true },
  });

  const expenseByCategory = await prisma.transaction.groupBy({
    by: ["categoryId"],
    where: { type: "EXPENSE", isVoided: false, date: { gte: start, lte: end } },
    _sum: { amount: true },
  });

  const allCategoryIds = [
    ...incomeByCategory.map((i) => i.categoryId),
    ...expenseByCategory.map((e) => e.categoryId),
  ];

  const categories = await prisma.category.findMany({
    where: { id: { in: allCategoryIds } },
    select: { id: true, name: true },
  });

  const catMap = new Map(categories.map((c) => [c.id, c.name]));

  const income = incomeByCategory.map((i) => ({
    category: catMap.get(i.categoryId) || "Lainnya",
    amount: Number(i._sum.amount || 0),
  }));

  const expenses = expenseByCategory.map((e) => ({
    category: catMap.get(e.categoryId) || "Lainnya",
    amount: Number(e._sum.amount || 0),
  }));

  const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  return {
    type: "income_statement",
    period: { start, end },
    income,
    expenses,
    totalIncome,
    totalExpense,
    netIncome: totalIncome - totalExpense,
  };
}

async function getCashFlow(start: Date, end: Date) {
  const transactions = await prisma.transaction.findMany({
    where: { isVoided: false, date: { gte: start, lte: end } },
    include: { category: { select: { name: true } } },
    orderBy: { date: "asc" },
  });

  let runningBalance = 0;
  const cashFlow = transactions.map((t) => {
    const amount = Number(t.amount);
    runningBalance += t.type === "INCOME" ? amount : -amount;
    return {
      date: t.date,
      type: t.type,
      category: t.category.name,
      description: t.description,
      amount,
      balance: runningBalance,
    };
  });

  return {
    type: "cash_flow",
    period: { start, end },
    entries: cashFlow,
    totalInflow: cashFlow.filter((c) => c.type === "INCOME").reduce((s, c) => s + c.amount, 0),
    totalOutflow: cashFlow.filter((c) => c.type === "EXPENSE").reduce((s, c) => s + c.amount, 0),
    netCashFlow: runningBalance,
  };
}

async function getCategorySummary(start: Date, end: Date) {
  const grouped = await prisma.transaction.groupBy({
    by: ["categoryId", "type"],
    where: { isVoided: false, date: { gte: start, lte: end } },
    _sum: { amount: true },
    _count: true,
  });

  const categoryIds = [...new Set(grouped.map((g) => g.categoryId))];
  const categories = await prisma.category.findMany({
    where: { id: { in: categoryIds } },
    select: { id: true, name: true, type: true, color: true },
  });

  const catMap = new Map(categories.map((c) => [c.id, c]));

  const summary = grouped.map((g) => ({
    category: catMap.get(g.categoryId)?.name || "Lainnya",
    type: g.type,
    color: catMap.get(g.categoryId)?.color || "#6B7280",
    total: Number(g._sum.amount || 0),
    count: g._count,
  }));

  return { type: "category_summary", period: { start, end }, data: summary };
}

async function getTransactionDetail(req: NextRequest, start: Date, end: Date) {
  const url = new URL(req.url);
  const categoryId = url.searchParams.get("categoryId");
  const txType = url.searchParams.get("transactionType");

  const where: Record<string, unknown> = {
    isVoided: false,
    date: { gte: start, lte: end },
  };
  if (categoryId) where.categoryId = categoryId;
  if (txType) where.type = txType;

  const transactions = await prisma.transaction.findMany({
    where,
    include: {
      category: { select: { name: true, color: true } },
      user: { select: { name: true } },
    },
    orderBy: { date: "desc" },
  });

  return {
    type: "transaction_detail",
    period: { start, end },
    data: transactions.map((t) => ({ ...t, amount: Number(t.amount) })),
    total: transactions.reduce(
      (s, t) => s + Number(t.amount) * (t.type === "INCOME" ? 1 : -1),
      0
    ),
    count: transactions.length,
  };
}
