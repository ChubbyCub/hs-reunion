"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

export default function CompletePage() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  const handleAddToCalendar = () => {
    // Event details
    const title = "Họp mặt cựu học sinh LHP khóa 2003-2006";
    const location = "Trường THPT Chuyên Lê Hồng Phong, 235 Đường Nguyễn Văn Cừ, Hồ Chí Minh";
    const description = "Buổi họp mặt 20 năm tốt nghiệp - Lê Hồng Phong khóa 2003-2006";
    const startDate = "20260201T080000"; // Feb 1, 2026, 8:00 AM
    const endDate = "20260201T190000"; // Feb 1, 2026, 7:00 PM

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

          {/* Success Summary */}
          <motion.div 
            className="bg-white rounded-lg shadow-lg p-8 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <motion.h2 
              className="text-2xl font-semibold text-gray-800 mb-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            >
              🎫 Vé đã được đặt thành công
            </motion.h2>
            
            <motion.div 
              className="text-center p-4 bg-blue-50 rounded-lg max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              <div className="text-3xl mb-2">📱</div>
              <h3 className="font-semibold text-blue-800 mb-2">Lưu vé</h3>
              <p className="text-blue-700 text-sm">
                Lưu vé vào điện thoại để dễ dàng check-in
              </p>
            </motion.div>
          </motion.div>

          {/* Important Information */}
          <motion.div 
            className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.6 }}
          >
            <motion.h3 
              className="text-xl font-semibold text-blue-800 mb-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.8 }}
            >
              📋 Thông tin quan trọng
            </motion.h3>
            
            <div className="space-y-4">
              <motion.div 
                className="flex items-start space-x-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 2.0 }}
              >
                <div className="text-blue-600 text-lg mt-1">📍</div>
                <div>
                  <h4 className="font-semibold text-blue-800">Địa điểm</h4>
                  <p className="text-blue-700">Trường Trung Học Phổ Thông Chuyên Lê Hồng Phong, 235 Đường Nguyễn Văn Cừ, Hồ Chí Minh</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-start space-x-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 2.2 }}
              >
                <div className="text-blue-600 text-lg mt-1">📅</div>
                <div>
                  <h4 className="font-semibold text-blue-800">Thời gian</h4>
                  <p className="text-blue-700">Chủ nhật, 01/02/2026 · 8:00 AM - 7:00 PM GMT+7</p>
                </div>
              </motion.div>
              
            </div>

            {/* Add to Calendar Button */}
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 2.6 }}
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


          {/* Action Buttons */}
          <motion.div 
            className="text-center space-y-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 4.2 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={handleGoHome}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg touch-manipulation"
              >
                🏠 Về trang chủ
              </Button>
            </motion.div>
            
            <motion.div 
              className="text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 4.4 }}
            >
              Cảm ơn bạn đã tham gia! Hẹn gặp lại tại buổi họp mặt! 👋
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
