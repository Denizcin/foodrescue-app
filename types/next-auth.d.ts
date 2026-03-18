declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: "CONSUMER" | "MERCHANT" | "ADMIN";
    };
  }

  interface User {
    role?: "CONSUMER" | "MERCHANT" | "ADMIN";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "CONSUMER" | "MERCHANT" | "ADMIN";
    id?: string;
  }
}
