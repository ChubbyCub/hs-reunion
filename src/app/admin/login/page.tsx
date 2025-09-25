"use client";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Prevent double submissions
    if (isLoading) return;

    setIsLoading(true);

    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache"
        },
        credentials: "same-origin",
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        // Add a small delay to ensure cookie is set before navigation
        await new Promise(resolve => setTimeout(resolve, 100));
        // Force page reload to ensure cookie is recognized
        window.location.href = "/admin/dashboard";
      } else {
        setError("Sai tên đăng nhập hoặc mật khẩu");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 lg:p-24">
        <form onSubmit={handleSubmit} className="bg-white/90 rounded-lg shadow-md p-6 sm:p-8 w-full max-w-sm mx-4">
          <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">Đăng nhập quản trị</h1>
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-sm sm:text-base">Tên đăng nhập</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-3 text-sm sm:text-base min-h-[44px] touch-manipulation"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-semibold text-sm sm:text-base">Mật khẩu</label>
            <input
              type="password"
              className="w-full border rounded px-3 py-3 text-sm sm:text-base min-h-[44px] touch-manipulation"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          {error && <div className="mb-4 text-red-600 text-center text-sm sm:text-base">{error}</div>}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded text-sm sm:text-base touch-manipulation min-h-[44px]"
          >
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
} 