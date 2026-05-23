"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, GraduationCap } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/faculty", label: "Faculty" },
  { href: "/admissions", label: "Admissions" },
  { href: "/results", label: "Results" },
  { href: "/gallery", label: "Gallery" },
  { href: "/news", label: "News" },
  { href: "/contact", label: "Contact" },
];

export function PublicNavbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex min-w-0 items-center gap-2">
            <div className="h-9 w-9 shrink-0 rounded-lg bg-green-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-gray-900 leading-tight">DPHS Pharhala</p>
              <p className="truncate text-xs text-gray-500">Haripur, KPK</p>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors">
                {l.label}
              </Link>
            ))}
            <Link href="/login" className="ml-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
              Login
            </Link>
          </div>
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 shrink-0" onClick={() => setOpen(!open)} aria-label="Toggle navigation">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-1 shadow-sm">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-green-50" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link href="/login" className="block px-3 py-2 bg-green-600 text-white text-sm rounded-lg text-center mt-2" onClick={() => setOpen(false)}>
            Login
          </Link>
        </div>
      )}
    </nav>
  );
}
