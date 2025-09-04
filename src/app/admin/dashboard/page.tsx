"use client";
import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AdminDashboard() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const downloadCSV = async (type: 'merchandise' | 'attendees' | 'orders' | 'payments') => {
    try {
      setDownloading(type);
      const response = await fetch(`/api/admin/download/${type}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error(`Failed to download ${type} CSV`);
        alert(`Không thể tải xuống ${type} CSV. Vui lòng thử lại.`);
      }
    } catch (error) {
      console.error(`Error downloading ${type} CSV:`, error);
      alert(`Lỗi khi tải xuống ${type} CSV. Vui lòng thử lại.`);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main
        style={{ background: "none" }}
        className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 lg:p-24 !bg-transparent"
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-center">Bảng điều khiển quản trị</h1>
        <p className="text-base sm:text-lg mb-6 sm:mb-8 text-center px-4">Chào mừng đến với bảng điều khiển quản trị. Tại đây bạn có thể quản lý trang web.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full max-w-4xl px-4">
          <Link href="/checkin">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <h2 className="text-lg sm:text-xl font-semibold mb-2">📱 Hệ thống Check-in</h2>
              <p className="text-sm sm:text-base text-gray-600">Quản lý check-in/out của attendees, xem thống kê tham dự</p>
            </div>
          </Link>
          
          
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">📊 Tải xuống dữ liệu</h2>
            <div className="space-y-3">
              <button 
                onClick={() => downloadCSV('merchandise')}
                disabled={downloading !== null}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium py-3 px-4 rounded text-sm sm:text-base transition-colors touch-manipulation"
              >
                {downloading === 'merchandise' ? '⏳ Đang tải...' : '📦 Tải CSV Danh sách Đồ lưu niệm'}
              </button>
              <button 
                onClick={() => downloadCSV('attendees')}
                disabled={downloading !== null}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-medium py-3 px-4 rounded text-sm sm:text-base transition-colors touch-manipulation"
              >
                {downloading === 'attendees' ? '⏳ Đang tải...' : '👥 Tải CSV Danh sách Attendees'}
              </button>
              <button 
                onClick={() => downloadCSV('orders')}
                disabled={downloading !== null}
                className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white font-medium py-3 px-4 rounded text-sm sm:text-base transition-colors touch-manipulation"
              >
                {downloading === 'orders' ? '⏳ Đang tải...' : '🛒 Tải CSV Danh sách Đơn hàng'}
              </button>
              <button 
                onClick={() => downloadCSV('payments')}
                disabled={downloading !== null}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-medium py-3 px-4 rounded text-sm sm:text-base transition-colors touch-manipulation"
              >
                {downloading === 'payments' ? '⏳ Đang tải...' : '💳 Tải CSV Danh sách Thanh toán'}
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 