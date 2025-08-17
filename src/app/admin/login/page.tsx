"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      setError("Sai tên đăng nhập hoặc mật khẩu");
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-24">
        <form onSubmit={handleSubmit} className="bg-white/90 rounded-lg shadow-md p-8 w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-6 text-center">Đăng nhập quản trị</h1>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Tên đăng nhập</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-semibold">Mật khẩu</label>
            <input
              type="password"
              className="w-full border rounded px-3 py-2"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
          <button type="submit" className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded">Đăng nhập</button>
        </form>
      </main>
      <Footer />
    </div>
  );
} 