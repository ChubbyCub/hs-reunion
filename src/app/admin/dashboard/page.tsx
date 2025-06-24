"use client";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  function handleLogout() {
    // Remove the cookie by setting it to expired
    document.cookie = "admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/admin/login");
  }

  return (
    <main
      style={{ background: "none" }}
      className="flex min-h-screen flex-col items-center justify-center p-24 !bg-transparent"
    >
      <button
        onClick={handleLogout}
        className="absolute top-8 right-8 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded shadow"
      >
        Logout
      </button>
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-lg">Welcome to the admin dashboard. Here you can manage the site.</p>
    </main>
  );
} 