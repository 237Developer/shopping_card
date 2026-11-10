import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify, importSPKI } from "jose";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard")) {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/dashboard-login", request.url));
    }

    try {
      const publicKeyB64 =
        process.env.JWT_PUBLIC_KEY_B64 ||
        process.env.NEXT_PUBLIC_JWT_PUBLIC_KEY_B64;
      if (!publicKeyB64) {
        return NextResponse.redirect(new URL("/dashboard-login", request.url));
      }

      const publicKeyPem = Buffer.from(publicKeyB64, "base64").toString("utf8");
      const publicKey = await importSPKI(publicKeyPem, "RS256");

      await jwtVerify(token, publicKey, { algorithms: ["RS256"] });
    } catch (error) {
      console.error("Middleware JWT verification failed:", error);
      const response = NextResponse.redirect(
        new URL("/dashboard-login", request.url),
      );
      response.cookies.delete("token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
