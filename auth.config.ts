// Edge-compatible auth config — Prisma/bcrypt importları yok
export const authConfig = {
  pages: {
    signIn: "/giris",
    error: "/giris",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }: any) {
      const pathname = nextUrl.pathname;

      // API routes handle their own auth — never block them at middleware level.
      // This is critical for /api/payment/callback which is called by iyzico's redirect
      // and therefore has no session cookie (cross-site POST, SameSite=Lax excluded).
      if (pathname.startsWith("/api/")) return true;

      const user = auth?.user as { role?: string } | undefined;
      const isLoggedIn = !!user;

      if (pathname.startsWith("/admin")) {
        return isLoggedIn && user?.role === "ADMIN";
      }
      if (pathname.startsWith("/merchant")) {
        return isLoggedIn && (user?.role === "MERCHANT" || user?.role === "ADMIN");
      }
      if (pathname.startsWith("/consumer")) {
        return isLoggedIn && (user?.role === "CONSUMER" || user?.role === "ADMIN");
      }

      return true;
    },
    jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }: any) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },
  providers: [],
};
