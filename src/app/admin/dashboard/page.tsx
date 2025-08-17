"use client";
// import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main
        style={{ background: "none" }}
        className="flex-1 flex flex-col items-center justify-center p-24 !bg-transparent"
      >
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-lg">Welcome to the admin dashboard. Here you can manage the site.</p>
      </main>
      <Footer />
    </div>
  );
} 