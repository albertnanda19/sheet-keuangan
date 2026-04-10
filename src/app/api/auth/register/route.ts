import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { jsonResponse, errorResponse, requireAuth, handleApiError } from "@/lib/api-utils";

export async function POST(req: NextRequest) {
  try {
    const authUser = await requireAuth(req, ["SUPER_ADMIN"]);
    const { email, password, name, role } = await req.json();

    if (!email || !password || !name) {
      return errorResponse("Email, password, dan nama wajib diisi", 400);
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return errorResponse("Email sudah terdaftar", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || "VIEWER",
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "CREATE_USER",
        entity: "User",
        entityId: user.id,
        newValue: { email, name, role: role || "VIEWER" },
        userId: authUser.userId,
      },
    });

    return jsonResponse({ user }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
