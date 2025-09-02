"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function CompletePage() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="text-8xl mb-6">🎉</div>
            <h1 className="text-4xl font-bold text-green-600 mb-4">
              Đăng ký thành công!
            </h1>
            <p className="text-xl text-gray-600">
              Chúc mừng! Bạn đã hoàn tất đăng ký tham dự buổi họp mặt
            </p>
          </div>

          {/* Success Summary */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              🎫 Vé đã được đặt thành công
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl mb-2">📧</div>
                <h3 className="font-semibold text-green-800 mb-2">Email xác nhận</h3>
                <p className="text-green-700 text-sm">
                  Vé sẽ được gửi qua email trong vòng vài phút
                </p>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl mb-2">📱</div>
                <h3 className="font-semibold text-blue-800 mb-2">Lưu vé</h3>
                <p className="text-blue-700 text-sm">
                  Lưu vé vào điện thoại để dễ dàng check-in
                </p>
              </div>
            </div>
          </div>

          {/* Important Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-blue-800 mb-4 text-center">
              📋 Thông tin quan trọng
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="text-blue-600 text-lg mt-1">📍</div>
                <div>
                  <h4 className="font-semibold text-blue-800">Địa điểm</h4>
                  <p className="text-blue-700">Trường Trung Học Phổ Thông Chuyên Lê Hồng Phong, 235 Đường Nguyễn Văn Cừ, Hồ Chí Minh</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="text-blue-600 text-lg mt-1">📅</div>
                <div>
                  <h4 className="font-semibold text-blue-800">Thời gian</h4>
                  <p className="text-blue-700">Chủ nhật, 01/02/2026 · 8:00 AM - 7:00 PM GMT+7</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="text-blue-600 text-lg mt-1">🎯</div>
                <div>
                  <h4 className="font-semibold text-blue-800">Mục đích</h4>
                  <p className="text-blue-700"></p>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-green-800 mb-4 text-center">
              🚀 Bước tiếp theo
            </h3>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl mb-2">1️⃣</div>
                <h4 className="font-semibold text-green-800 mb-2">Kiểm tra email</h4>
                <p className="text-green-700 text-sm">Xác nhận vé và thông tin chi tiết</p>
              </div>
              
              <div className="text-center">
                <div className="text-2xl mb-2">2️⃣</div>
                <h4 className="font-semibold text-green-800 mb-2">Lưu vé</h4>
                <p className="text-green-700 text-sm">Lưu vé vào điện thoại hoặc in ra</p>
              </div>
              
              <div className="text-center">
                <div className="text-2xl mb-2">3️⃣</div>
                <h4 className="font-semibold text-green-800 mb-2">Chuẩn bị</h4>
                <p className="text-green-700 text-sm">Sắp xếp lịch và chuẩn bị tham dự</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              📞 Liên hệ hỗ trợ
            </h3>
            
            <div className="text-center space-y-2">
              <p className="text-gray-700">
                Nếu bạn cần hỗ trợ hoặc có câu hỏi, vui lòng liên hệ:
              </p>
              <p className="font-semibold text-gray-800">
                Ban tổ chức: Cuu hoc sinh Le Hong Phong Khoa 0306
              </p>
              <p className="text-gray-600 text-sm">
                Email: contact@lhp0306-reunion.com
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center space-y-4">
            <Button 
              onClick={handleGoHome}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
            >
              🏠 Về trang chủ
            </Button>
            
            <div className="text-sm text-gray-500">
              Cảm ơn bạn đã tham gia! Hẹn gặp lại tại buổi họp mặt! 👋
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
