import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  jsonResponse,
  errorResponse,
  requireAuth,
  handleApiError,
} from "@/lib/api-utils";

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);
    const url = new URL(req.url);
    const period = url.searchParams.get("period");

    const where: Record<string, unknown> = {};
    if (period) where.period = period;

    const budgets = await prisma.budget.findMany({
      where,
      include: {
        category: { select: { id: true, name: true, color: true, type: true } },
        user: { select: { name: true } },
      },
      orderBy: { startDate: "desc" },
    });

    const budgetsWithSpent = await Promise.all(
      budgets.map(async (budget) => {
        const spent = await prisma.transaction.aggregate({
          where: {
            categoryId: budget.categoryId,
            type: "EXPENSE",
            isVoided: false,
            date: { gte: budget.startDate, lte: budget.endDate },
          },
          _sum: { amount: true },
        });

        const spentAmount = Number(spent._sum.amount || 0);
        const budgetAmount = Number(budget.amount);

        return {
          ...budget,
          amount: budgetAmount,
          spent: spentAmount,
          percentage: budgetAmount > 0 ? Math.round((spentAmount / budgetAmount) * 100) : 0,
        };
      })
    );

    return jsonResponse({ data: budgetsWithSpent });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = await requireAuth(req, [
      "SUPER_ADMIN",
      "ADMIN_KEUANGAN",
      "MANAJER",
    ]);
    const { amount, period, startDate, endDate, categoryId } = await req.json();

    if (!amount || !period || !startDate || !endDate || !categoryId) {
      return errorResponse("Semua field wajib diisi", 400);
    }

    const budget = await prisma.budget.create({
      data: {
        amount,
        period,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        categoryId,
        userId: authUser.userId,
      },
      include: {
        category: { select: { id: true, name: true, color: true, type: true } },
        user: { select: { name: true } },
      },
    });

    return jsonResponse(
      { data: { ...budget, amount: Number(budget.amount), spent: 0, percentage: 0 } },
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAuth(req, ["SUPER_ADMIN", "ADMIN_KEUANGAN", "MANAJER"]);
    const { id, amount } = await req.json();

    if (!id || !amount) return errorResponse("ID dan jumlah wajib", 400);

    const budget = await prisma.budget.update({
      where: { id },
      data: { amount },
      include: {
        category: { select: { id: true, name: true, color: true, type: true } },
        user: { select: { name: true } },
      },
    });

    return jsonResponse({
      data: { ...budget, amount: Number(budget.amount) },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAuth(req, ["SUPER_ADMIN", "MANAJER"]);
    const { id } = await req.json();

    if (!id) return errorResponse("Budget ID wajib", 400);

    await prisma.budget.delete({ where: { id } });
    return jsonResponse({ message: "Anggaran dihapus" });
  } catch (error) {
    return handleApiError(error);
  }
}
