'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PublicNav() {
  const pathname = usePathname();

  return (
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
            className={`transition-colors hover:text-white ${pathname === '/register' ? 'text-white font-bold underline' : ''}`}
          >
            Register
          </Link>
          <Link 
            href="/programme" 
            className={`transition-colors hover:text-white ${pathname === '/programme' ? 'text-white font-bold underline' : ''}`}
          >
            Programme
          </Link>
          <Link 
            href="/directory" 
            className={`transition-colors hover:text-white ${pathname === '/directory' ? 'text-white font-bold underline' : ''}`}
          >
            Directory
          </Link>
        </nav>
      </div>
    </header>
  );
}