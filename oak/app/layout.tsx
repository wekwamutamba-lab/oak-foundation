import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "OAK Zimbabwe Partner Gathering",
  description: "Registration and attendance platform for the OAK Partner Gathering",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* Global Navigation Header */}
        <header className="sticky top-0 z-50 border-b border-white/10 bg-[var(--oak-navy)] text-white shadow-sm">
          <div className="mx-auto flex max-w-[var(--oak-mobile-reference-width)] items-center justify-between px-5 py-3">
            <Link 
              href="/register" 
              className="text-xs font-bold tracking-wider text-white uppercase hover:opacity-90"
            >
              OAK Convening
            </Link>

            <nav className="flex items-center gap-4 text-xs font-medium text-blue-100">
              <Link 
                href="/register" 
                className="transition-colors hover:text-white"
              >
                Register
              </Link>
              <Link 
                href="/programme" 
                className="transition-colors hover:text-white"
              >
                Programme
              </Link>
              <Link 
                href="/directory" 
                className="transition-colors hover:text-white"
              >
                Directory
              </Link>
            </nav>
          </div>
        </header>

        {/* Page Content */}
        {children}
      </body>
    </html>
  );
}