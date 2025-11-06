"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Calendar, FileText, Home } from "lucide-react";
import { useAppStore } from "@/stores/app-store";
import Link from "next/link";
import Image from "next/image";

export default function CompletePage() {
  const { formData } = useAppStore();

  const handleDownloadQR = async () => {
    try {
      // Fetch the original PNG file
      const response = await fetch('/sharing_event_qr.png');
      const blob = await response.blob();

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'chia-se-su-kien-lhp-2026.png';
      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading QR code:', error);
    }
  };

  const handleAddToCalendar = () => {
    // Event details
    const title = "Họp mặt cựu học sinh LHP khóa 2003-2006";
    const location = "Trường THPT Chuyên Lê Hồng Phong, 235 Đường Nguyễn Văn Cừ, Hồ Chí Minh";
    const description = "Buổi họp mặt 20 năm tốt nghiệp - Lê Hồng Phong khóa 2003-2006";
    const startDate = "20260201T073000"; // Feb 1, 2026, 7:30 AM
    const endDate = "20260201T120000"; // Feb 1, 2026, 12:00 PM

    // Generate Google Calendar URL
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;

    // Open in new tab
    window.open(googleCalendarUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.div 
              className="text-8xl mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
            >
              🎉
            </motion.div>
            <motion.h1 
              className="text-4xl font-bold text-green-600 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Đăng ký thành công!
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Chúc mừng! Bạn đã hoàn tất đăng ký tham dự buổi họp mặt
            </motion.p>
          </motion.div>

          {/* Next Steps Box */}
          <motion.div
            className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            >
              <p className="text-green-800 text-base mb-4">
                Cảm ơn bạn đã &ldquo;trả lời cuộc gọi thanh xuân&rdquo;.
              </p>
              <p className="text-green-700 text-base mb-4">
                {formData.willAttendEvent ? (
                  <>Sau khi xác minh thông tin, BTC sẽ gửi vé và mã QR tham dự đến email <span className="font-semibold">{formData.email}</span>.</>
                ) : (
                  <>Sau khi xác minh thông tin, BTC sẽ gửi email xác nhận đơn hàng đến <span className="font-semibold">{formData.email}</span>.</>
                )}
              </p>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <p className="text-yellow-800 text-sm">
                  <span className="font-semibold">Lưu ý:</span> Vui lòng kiểm tra hộp thư đến. Nếu sau 24 giờ làm việc chưa nhận được email, hãy{' '}
                  <Link href="/contact" className="text-blue-600 hover:text-blue-800 underline font-semibold">
                    liên hệ BTC
                  </Link>
                  .
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Important Information */}
          <motion.div
            className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <motion.h3
              className="text-xl font-semibold text-blue-800 mb-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.4 }}
            >
              📋 Thông tin quan trọng
            </motion.h3>

            <div className="space-y-4">
              <motion.div
                className="flex items-start space-x-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.6 }}
              >
                <div className="text-blue-600 text-lg mt-1">📍</div>
                <div>
                  <h4 className="font-semibold text-blue-800">Địa điểm</h4>
                  <p className="text-blue-700">Trường Trung Học Phổ Thông Chuyên Lê Hồng Phong, 235 Đường Nguyễn Văn Cừ, Phường Chợ Quán, TP. Hồ Chí Minh</p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start space-x-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.8 }}
              >
                <div className="text-blue-600 text-lg mt-1">📅</div>
                <div>
                  <h4 className="font-semibold text-blue-800">Thời gian</h4>
                  <p className="text-blue-700">Chủ nhật, 01/02/2026 · 7:30 AM - 12:00 PM GMT+7</p>
                </div>
              </motion.div>

            </div>

            {/* Add to Calendar Button */}
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 2.0 }}
            >
              <Button
                onClick={handleAddToCalendar}
                variant="outline"
                className="bg-white hover:bg-blue-600 text-blue-700 hover:text-white border-blue-300 hover:border-blue-600"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Thêm vào lịch
              </Button>
            </motion.div>
          </motion.div>

          {/* Sharing Events With Friends */}
          <motion.div
            className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.2 }}
          >
            <motion.h3
              className="text-xl font-semibold text-purple-800 mb-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 2.4 }}
            >
              📢 Chia sẻ sự kiện với bạn bè
            </motion.h3>

            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 2.6 }}
            >
              <div
                className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-xl transition-shadow"
                onClick={handleDownloadQR}
                title="Click để tải xuống"
              >
                <Image
                  src="/sharing_event_qr.png"
                  alt="QR Code chia sẻ sự kiện"
                  width={1200}
                  height={1200}
                  className="w-80 h-auto sm:w-96 md:w-[600px] lg:w-[700px] xl:w-[800px]"
                  quality={100}
                />
              </div>
              <p className="text-sm text-purple-600 mt-2 text-center">Click vào hình để tải xuống</p>
            </motion.div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="text-center space-y-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.8 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/" className="block">
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-base"
                  >
                    <Home className="w-5 h-5 mr-2" />
                    Về trang chủ
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a
                  href="https://drive.google.com/file/d/1bX5ecaMj5Azb901-4LGva_D9LLt_bzpM/view"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-base"
                  >
                    <FileText className="w-5 h-5 mr-2" />
                    Xem Thư Ngỏ
                  </Button>
                </a>
              </motion.div>
            </div>

            <motion.div
              className="text-sm text-gray-500 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 2.6 }}
            >
              Cảm ơn bạn đã tham gia! Hẹn gặp lại tại buổi họp mặt! 👋
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
