"use client";

import { useState, useEffect } from "react";
import Lottie from "lottie-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// You can replace this with any celebration Lottie animation
// For now, I'll use a simple confetti animation URL
const celebrationAnimation = "https://assets2.lottiefiles.com/packages/lf20_obhph3sh.json";

interface RegistrationCompleteProps {
  onComplete?: () => void;
}

export function RegistrationComplete({ onComplete }: RegistrationCompleteProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Trigger confetti after a short delay
    const timer = setTimeout(() => {
      setShowConfetti(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleGoHome = () => {
    onComplete?.();
    router.push("/");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center relative overflow-hidden">
        {/* Confetti Animation */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            <Lottie
              animationData={celebrationAnimation}
              loop={false}
              autoplay={true}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        )}

        {/* Success Content */}
        <div className="relative z-10">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-green-600 mb-4">
            Đăng ký thành công!
          </h1>
          
          <div className="space-y-3 mb-6 text-gray-600">
            <p>🎫 Vé đã được đặt thành công</p>
            <p>📧 Email xác nhận sẽ được gửi</p>
            <p>👥 Hẹn gặp lại tại buổi họp mặt!</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-green-800 mb-2">Bước tiếp theo:</h3>
            <ul className="text-green-700 text-sm space-y-1 text-left">
              <li>• Kiểm tra email để xác nhận vé</li>
              <li>• Lưu vé vào điện thoại</li>
              <li>• Chuẩn bị cho buổi họp mặt</li>
            </ul>
          </div>

          <Button 
            onClick={handleGoHome}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            Về trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
}
