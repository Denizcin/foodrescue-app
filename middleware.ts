// @ts-ignore — next-auth beta TypeScript type quirk
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Edge runtime'da çalışır — Prisma/bcrypt kullanmaz
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { auth } = (NextAuth as any)(authConfig);

export default auth;

export const config = {
  matcher: [
    "/consumer/:path*",
    "/merchant/:path*",
    "/admin/:path*",
  ],
};
