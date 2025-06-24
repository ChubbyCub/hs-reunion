"use client";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <main
      style={{ background: "none" }}
      className="flex min-h-screen flex-col items-center justify-center p-24 !bg-transparent"
    >
      <div className="absolute top-8 right-8 flex flex-col gap-3 z-20">
        <Link
          href="/"
          className="text-white text-lg font-semibold hover:text-yellow-400 transition-colors cursor-pointer"
          style={{ background: "none", border: "none", padding: 0 }}
        >
          HOME
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-lg">Welcome to the admin dashboard. Here you can manage the site.</p>
    </main>
  );
} 