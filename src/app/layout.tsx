import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast'; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wallet Dashboard",
  description: "Manage your funds and transactions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster position="top-center" reverseOrder={false} /> {/* Add Toaster here */}
        {children}
      </body>
    </html>
  );
}