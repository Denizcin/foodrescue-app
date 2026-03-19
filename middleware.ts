// @ts-ignore — next-auth beta TypeScript type quirk
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse, type NextRequest } from "next/server";

// Edge runtime'da çalışır — Prisma/bcrypt kullanmaz
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { auth } = (NextAuth as any)(authConfig);

// Next.js server actions are POST requests that include a "Next-Action" header.
// The middleware cannot reliably read the session for these requests in NextAuth
// v5 beta, which causes the authorized() check to fail and redirects the action
// before the server function ever runs. Server actions do their own auth()
// check internally, so we let them bypass the middleware entirely.
function middleware(request: NextRequest) {
  if (request.headers.get("Next-Action")) {
    return NextResponse.next();
  }
  // For all other requests (page loads, API, etc.) apply NextAuth route guard.
  return (auth as (req: NextRequest) => Response)(request);
}

export default middleware;

export const config = {
  matcher: [
    "/consumer/:path*",
    "/merchant/:path*",
    "/admin/:path*",
  ],
};
