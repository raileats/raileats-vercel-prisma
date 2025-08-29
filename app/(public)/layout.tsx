import "../../styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Raileats",
  description: "Order food on trains at stations across India",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900">
        <header className="sticky top-0 z-10 border-b bg-white/70 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
            <a href="/" className="font-bold text-xl">🚆🍽️ Raileats</a>
            <nav className="space-x-4 text-sm">
              <a href="/orders" className="hover:underline">My Orders</a>
              <a href="/login" className="rounded bg-gray-900 px-3 py-1 text-white">Login</a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl p-4">{children}</main>
      </body>
    </html>
  );
}
