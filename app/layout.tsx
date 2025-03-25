import type React from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Juno Network - Faucet",
  description: "Get testnet tokens for Uni Juno Testnet",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-primary-foreground">
                Juno Network Faucet
              </h1>
              <p className="mt-2 ">
                Get JUNOx to use on the uni-7 Juno testnet
              </p>
            </div>
            {children}

            <Toaster />
          </div>
        </div>
      </body>
    </html>
  );
}
