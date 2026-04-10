import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonResponse, requireAuth, handleApiError } from "@/lib/api-utils";
import { getMonthName } from "@/lib/format";

function getDateRange(period: string, startDate?: string, endDate?: string) {
  const now = new Date();
  let start: Date;
  let end: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  switch (period) {
    case "today":
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "this_week": {
      const day = now.getDay();
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (day === 0 ? 6 : day - 1));
      break;
    }
    case "this_quarter": {
      const quarter = Math.floor(now.getMonth() / 3);
      start = new Date(now.getFullYear(), quarter * 3, 1);
      end = new Date(now.getFullYear(), quarter * 3 + 3, 0, 23, 59, 59);
      break;
    }
    case "this_year":
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
      break;
    case "custom":
      start = startDate ? new Date(startDate) : new Date(now.getFullYear(), now.getMonth(), 1);
      end = endDate ? new Date(endDate + "T23:59:59") : end;
      break;
    default:
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
  }

  return { start, end };
}

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);
    const url = new URL(req.url);
    const period = url.searchParams.get("period") || "this_month";
    const startDate = url.searchParams.get("startDate") || undefined;
    const endDate = url.searchParams.get("endDate") || undefined;

    const { start, end } = getDateRange(period, startDate, endDate);

    const [incomeAgg, expenseAgg] = await Promise.all([
      prisma.transaction.aggregate({
        where: { type: "INCOME", isVoided: false, date: { gte: start, lte: end } },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { type: "EXPENSE", isVoided: false, date: { gte: start, lte: end } },
        _sum: { amount: true },
      }),
    ]);

    const totalIncome = Number(incomeAgg._sum.amount || 0);
    const totalExpense = Number(expenseAgg._sum.amount || 0);

    const currentYear = new Date().getFullYear();
    const monthlyData = await Promise.all(
      Array.from({ length: 12 }, (_, i) => i).map(async (month) => {
        const monthStart = new Date(currentYear, month, 1);
        const monthEnd = new Date(currentYear, month + 1, 0, 23, 59, 59);

        const [inc, exp] = await Promise.all([
          prisma.transaction.aggregate({
            where: { type: "INCOME", isVoided: false, date: { gte: monthStart, lte: monthEnd } },
            _sum: { amount: true },
          }),
          prisma.transaction.aggregate({
            where: { type: "EXPENSE", isVoided: false, date: { gte: monthStart, lte: monthEnd } },
            _sum: { amount: true },
          }),
        ]);

        return {
          month: getMonthName(month).substring(0, 3),
          income: Number(inc._sum.amount || 0),
          expense: Number(exp._sum.amount || 0),
        };
      })
    );

    const expenseByCategory = await prisma.transaction.groupBy({
      by: ["categoryId"],
      where: { type: "EXPENSE", isVoided: false, date: { gte: start, lte: end } },
      _sum: { amount: true },
    });

    const categoryIds = expenseByCategory.map((e) => e.categoryId);
    const categories = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true, name: true, color: true },
    });

    const categoryMap = new Map(categories.map((c) => [c.id, c]));
    const defaultColors = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16"];

    const expenseByCat = expenseByCategory.map((e, i) => {
      const cat = categoryMap.get(e.categoryId);
      return {
        name: cat?.name || "Lainnya",
        value: Number(e._sum.amount || 0),
        color: cat?.color || defaultColors[i % defaultColors.length],
      };
    });

    const budgets = await prisma.budget.findMany({
      where: {
        startDate: { lte: end },
        endDate: { gte: start },
      },
      include: { category: { select: { name: true } } },
    });

    const budgetProgress = await Promise.all(
      budgets.map(async (b) => {
        const spent = await prisma.transaction.aggregate({
          where: {
            categoryId: b.categoryId,
            type: "EXPENSE",
            isVoided: false,
            date: { gte: b.startDate, lte: b.endDate },
          },
          _sum: { amount: true },
        });
        const spentAmount = Number(spent._sum.amount || 0);
        const budgetAmount = Number(b.amount);
        return {
          category: b.category.name,
          budget: budgetAmount,
          spent: spentAmount,
          percentage: budgetAmount > 0 ? Math.round((spentAmount / budgetAmount) * 100) : 0,
        };
      })
    );

    const recentTransactions = await prisma.transaction.findMany({
      where: { isVoided: false },
      include: {
        category: { select: { id: true, name: true, color: true, type: true } },
        user: { select: { name: true } },
      },
      orderBy: { date: "desc" },
      take: 5,
    });

    return jsonResponse({
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
      monthlyComparison: monthlyData,
      expenseByCategory: expenseByCat,
      budgetProgress,
      recentTransactions: recentTransactions.map((t) => ({
        ...t,
        amount: Number(t.amount),
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
