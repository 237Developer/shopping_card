import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
    headers.set("Cookie", `token=${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401 || response.status === 403) {
    throw new Error("UNAUTHORIZED");
  }

  return response;
}
