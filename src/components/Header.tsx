"use client";

import Link from "next/link";
import { Home } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center">
          <Link 
            href="/" 
            className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors duration-200"
          >
            <Home size={24} />
            <span className="font-semibold text-lg">Trang chủ</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
