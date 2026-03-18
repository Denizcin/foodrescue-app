"use client";

import type { ReactNode } from "react";
import { signOut } from "next-auth/react";

export default function SignOutButton({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/giris" })}
      className={className}
    >
      {children ?? "Çıkış Yap"}
    </button>
  );
}
