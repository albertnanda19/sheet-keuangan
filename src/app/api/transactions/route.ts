import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  jsonResponse,
  errorResponse,
  requireAuth,
  handleApiError,
  parseSearchParams,
} from "@/lib/api-utils";

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);
    const { page, limit, sort, order } = parseSearchParams(req);
    const url = new URL(req.url);
    const type = url.searchParams.get("type");
    const categoryId = url.searchParams.get("categoryId");
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");
    const search = url.searchParams.get("search");

    const where: Record<string, unknown> = { isVoided: false };
    if (type) where.type = type;
    if (categoryId) where.categoryId = categoryId;
    if (startDate || endDate) {
      where.date = {
        ...(startDate && { gte: new Date(startDate) }),
        ...(endDate && { lte: new Date(endDate + "T23:59:59") }),
      };
    }
    if (search) {
      where.OR = [
        { description: { contains: search, mode: "insensitive" } },
        { reference: { contains: search, mode: "insensitive" } },
      ];
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, color: true, type: true } },
          user: { select: { name: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sort === "amount" ? "amount" : sort === "date" ? "date" : "createdAt"]: order },
      }),
      prisma.transaction.count({ where }),
    ]);

    const serialized = transactions.map((t) => ({
      ...t,
      amount: Number(t.amount),
    }));

    return jsonResponse({
      data: serialized,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = await requireAuth(req, [
      "SUPER_ADMIN",
      "ADMIN_KEUANGAN",
    ]);
    const body = await req.json();
    const { type, amount, date, categoryId, description, reference, paymentMethod, tags } = body;

    if (!type || !amount || !date || !categoryId) {
      return errorResponse("Tipe, jumlah, tanggal, dan kategori wajib diisi", 400);
    }

    if (amount <= 0) {
      return errorResponse("Jumlah harus lebih dari 0", 400);
    }

    const transaction = await prisma.transaction.create({
      data: {
        type,
        amount,
        date: new Date(date),
        categoryId,
        description,
        reference,
        paymentMethod,
        tags: tags || [],
        userId: authUser.userId,
      },
      include: {
        category: { select: { id: true, name: true, color: true, type: true } },
        user: { select: { name: true } },
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "CREATE_TRANSACTION",
        entity: "Transaction",
        entityId: transaction.id,
        newValue: { type, amount, date, categoryId, description },
        userId: authUser.userId,
      },
    });

    return jsonResponse(
      { data: { ...transaction, amount: Number(transaction.amount) } },
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authUser = await requireAuth(req, [
      "SUPER_ADMIN",
      "ADMIN_KEUANGAN",
    ]);
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) return errorResponse("Transaction ID wajib", 400);

    const existing = await prisma.transaction.findUnique({ where: { id } });
    if (!existing) return errorResponse("Transaksi tidak ditemukan", 404);

    if (updateData.date) updateData.date = new Date(updateData.date);

    const transaction = await prisma.transaction.update({
      where: { id },
      data: updateData,
      include: {
        category: { select: { id: true, name: true, color: true, type: true } },
        user: { select: { name: true } },
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "UPDATE_TRANSACTION",
        entity: "Transaction",
        entityId: id,
        oldValue: { amount: Number(existing.amount), description: existing.description },
        newValue: updateData,
        userId: authUser.userId,
      },
    });

    return jsonResponse({
      data: { ...transaction, amount: Number(transaction.amount) },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authUser = await requireAuth(req, [
      "SUPER_ADMIN",
      "ADMIN_KEUANGAN",
    ]);
    const { id, reason } = await req.json();

    if (!id) return errorResponse("Transaction ID wajib", 400);

    await prisma.transaction.update({
      where: { id },
      data: { isVoided: true, voidReason: reason || "Dibatalkan" },
    });

    await prisma.auditLog.create({
      data: {
        action: "VOID_TRANSACTION",
        entity: "Transaction",
        entityId: id,
        newValue: { reason },
        userId: authUser.userId,
      },
    });

    return jsonResponse({ message: "Transaksi dibatalkan" });
  } catch (error) {
    return handleApiError(error);
  }
}
