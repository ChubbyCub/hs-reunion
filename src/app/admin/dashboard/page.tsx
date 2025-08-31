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
        <h1 className="text-3xl font-bold mb-4">Bảng điều khiển quản trị</h1>
        <p className="text-lg">Chào mừng đến với bảng điều khiển quản trị. Tại đây bạn có thể quản lý trang web.</p>
      </main>
      <Footer />
    </div>
  );
} 