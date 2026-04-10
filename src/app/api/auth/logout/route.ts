import { jsonResponse } from "@/lib/api-utils";

export async function POST() {
  const response = jsonResponse({ message: "Logged out" });
  response.headers.set(
    "Set-Cookie",
    "access_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax"
  );
  response.headers.append(
    "Set-Cookie",
    "refresh_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax"
  );
  return response;
}
