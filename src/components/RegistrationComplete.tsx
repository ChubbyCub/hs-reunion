"use client";

import { useState, useEffect } from "react";
import Lottie from "lottie-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// Simple confetti animation data (fallback if external URL fails)
const fallbackAnimation = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 90,
  w: 400,
  h: 400,
  nm: "Confetti",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Confetti",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [200, 200, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      ao: 0,
      shapes: [],
      ip: 0,
      op: 90,
      st: 0,
      bm: 0
    }
  ]
};

interface RegistrationCompleteProps {
  onComplete?: () => void;
}

export function RegistrationComplete({ onComplete }: RegistrationCompleteProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [animationError, setAnimationError] = useState(false);
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

  const handleAnimationError = () => {
    console.warn("Lottie animation failed to load, using fallback");
    setAnimationError(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center relative overflow-hidden">
        {/* Confetti Animation */}
        {showConfetti && !animationError && (
          <div className="absolute inset-0 pointer-events-none">
            <Lottie
              animationData={fallbackAnimation}
              loop={false}
              autoplay={true}
              style={{ width: "100%", height: "100%" }}
              onError={handleAnimationError}
            />
          </div>
        )}

        {/* Fallback confetti effect if animation fails */}
        {showConfetti && animationError && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="animate-bounce absolute top-0 left-1/4 text-2xl">🎊</div>
            <div className="animate-bounce absolute top-0 left-1/2 text-2xl" style={{ animationDelay: '0.2s' }}>🎉</div>
            <div className="animate-bounce absolute top-0 left-3/4 text-2xl" style={{ animationDelay: '0.4s' }}>✨</div>
            <div className="animate-bounce absolute top-1/4 left-1/3 text-2xl" style={{ animationDelay: '0.6s' }}>🎊</div>
            <div className="animate-bounce absolute top-1/4 right-1/3 text-2xl" style={{ animationDelay: '0.8s' }}>🎉</div>
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
