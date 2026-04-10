import { NextRequest } from "next/server";
import { verifyAccessToken, JWTPayload } from "./auth";

export function jsonResponse(data: unknown, status = 200) {
  return Response.json(data, { status });
}

export function errorResponse(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

export async function getAuthUser(
  req: NextRequest
): Promise<JWTPayload | null> {
  const token =
    req.cookies.get("access_token")?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;
  return verifyAccessToken(token);
}

export async function requireAuth(
  req: NextRequest,
  allowedRoles?: string[]
): Promise<JWTPayload> {
  const user = await getAuthUser(req);
  if (!user) {
    throw new AuthError("Unauthorized", 401);
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    throw new AuthError("Forbidden", 403);
  }
  return user;
}

export class AuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function handleApiError(error: unknown) {
  if (error instanceof AuthError) {
    return errorResponse(error.message, error.status);
  }
  console.error(error);
  return errorResponse("Internal server error", 500);
}

export function parseSearchParams(req: NextRequest) {
  const url = new URL(req.url);
  return {
    page: parseInt(url.searchParams.get("page") || "1"),
    limit: parseInt(url.searchParams.get("limit") || "20"),
    search: url.searchParams.get("search") || "",
    sort: url.searchParams.get("sort") || "createdAt",
    order: (url.searchParams.get("order") || "desc") as "asc" | "desc",
  };
}
