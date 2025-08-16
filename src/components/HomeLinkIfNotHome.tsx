"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home } from 'lucide-react';

export default function HomeLinkIfNotHome() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return (
    <div className="absolute top-8 right-8 z-20">
      <Link href="/" className="text-gray-700 text-lg font-semibold transition-colors hover:text-yellow-400 cursor-pointer flex items-center justify-center" style={{ background: "none", border: "none", padding: 0 }} aria-label="Trang chủ">
        <Home size={28} />
      </Link>
    </div>
  );
} 