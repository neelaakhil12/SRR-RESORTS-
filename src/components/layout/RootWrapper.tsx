"use client";

import { usePathname } from "next/navigation";
import { WhatsAppButton } from "./WhatsAppButton";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import NextAuthProvider from "../providers/NextAuthProvider";
import { AuthProvider } from "@/context/AuthContext";

export function RootWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isAdminRoute = pathname?.startsWith("/admin") || pathname?.startsWith("/employeelogin") || pathname?.startsWith("/superadminlogin");

  if (isAdminRoute) {
    return (
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    );
  }

  return (
    <NextAuthProvider>
      <AuthProvider>
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
        </div>
      </AuthProvider>
    </NextAuthProvider>
  );
}
