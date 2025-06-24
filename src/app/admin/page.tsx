"use client";

export default function AdminPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      {/* Desktop content */}
      <div className="hidden md:flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-4">Admin Page</h1>
        <p className="text-lg">Welcome to the admin area. More features coming soon.</p>
      </div>
      {/* Mobile message */}
      <div className="flex md:hidden flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">Admin Page</h1>
        <p className="text-lg">Admin page is only available on desktop.</p>
      </div>
    </main>
  );
} 