import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonResponse, errorResponse, getAuthUser } from "@/lib/api-utils";

export async function GET(req: NextRequest) {
  try {
    const tokenUser = await getAuthUser(req);
    if (!tokenUser) {
      return errorResponse("Unauthorized", 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: tokenUser.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });

    if (!user || !user.isActive) {
      return errorResponse("User not found", 404);
    }

    return jsonResponse({ user });
  } catch {
    return errorResponse("Internal server error", 500);
  }
}
