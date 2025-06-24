"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HomeLinkIfNotHome() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return (
    <div className="absolute top-8 right-8 z-20">
      <Link href="/" className="text-white text-lg font-semibold transition-colors hover:text-yellow-400 cursor-pointer" style={{ background: "none", border: "none", padding: 0 }}>
        HOME
      </Link>
    </div>
  );
} 