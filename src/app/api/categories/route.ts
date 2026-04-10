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
    const type = url.searchParams.get("type");

    const where: Record<string, unknown> = { isActive: true, parentId: null };
    if (type) where.type = type;

    const categories = await prisma.category.findMany({
      where,
      include: {
        children: {
          where: { isActive: true },
          orderBy: { name: "asc" },
        },
        _count: { select: { transactions: true } },
      },
      orderBy: { name: "asc" },
    });

    return jsonResponse({ data: categories });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth(req, ["SUPER_ADMIN", "ADMIN_KEUANGAN", "MANAJER"]);
    const { name, type, parentId, icon, color } = await req.json();

    if (!name || !type) {
      return errorResponse("Nama dan tipe kategori wajib diisi", 400);
    }

    const category = await prisma.category.create({
      data: { name, type, parentId, icon, color },
    });

    return jsonResponse({ data: category }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAuth(req, ["SUPER_ADMIN", "ADMIN_KEUANGAN", "MANAJER"]);
    const { id, name, icon, color, isActive } = await req.json();

    if (!id) return errorResponse("Category ID wajib", 400);

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(icon !== undefined && { icon }),
        ...(color !== undefined && { color }),
        ...(typeof isActive === "boolean" && { isActive }),
      },
    });

    return jsonResponse({ data: category });
  } catch (error) {
    return handleApiError(error);
  }
}
