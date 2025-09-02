"use client";
import Link from "next/link";
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
        <h1 className="text-3xl font-bold mb-8">Bảng điều khiển quản trị</h1>
        <p className="text-lg mb-8 text-center">Chào mừng đến với bảng điều khiển quản trị. Tại đây bạn có thể quản lý trang web.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
          <Link href="/checkin">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">📱 Hệ thống Check-in</h2>
              <p className="text-gray-600">Quản lý check-in/out của attendees, xem thống kê tham dự</p>
            </div>
          </Link>
          
          <Link href="/admin/attendees">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">👥 Quản lý Attendees</h2>
              <p className="text-gray-600">Xem danh sách đăng ký, chỉnh sửa thông tin</p>
            </div>
          </Link>
          
          <Link href="/admin/reports">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">📊 Báo cáo & Thống kê</h2>
              <p className="text-gray-600">Xem báo cáo chi tiết về sự kiện và tham dự</p>
            </div>
          </Link>
          
          <Link href="/admin/settings">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">⚙️ Cài đặt</h2>
              <p className="text-gray-600">Cấu hình hệ thống và thông tin sự kiện</p>
            </div>
          </Link>
          
          <Link href="/admin/backup">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">💾 Sao lưu & Khôi phục</h2>
              <p className="text-gray-600">Sao lưu dữ liệu và khôi phục khi cần</p>
            </div>
          </Link>
          
          <Link href="/">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">🏠 Về trang chủ</h2>
              <p className="text-gray-600">Quay lại trang chủ của website</p>
            </div>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
} 