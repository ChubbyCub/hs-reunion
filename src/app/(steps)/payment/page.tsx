"use client";

import { useAppStore } from "@/stores/app-store";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function PaymentPage() {
    const router = useRouter();
    const { setStep, formData, cart } = useAppStore();

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-title mb-6">Thanh toán</h1>
      
      {/* Order Summary */}
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Tóm tắt đơn hàng</h2>
        
        <div className="mb-4">
          <h3 className="font-medium mb-2">Thông tin người tham gia:</h3>
          <p className="text-gray-700">{formData.firstName} {formData.lastName}</p>
          <p className="text-gray-700">{formData.email}</p>
          <p className="text-gray-700">{formData.phone}</p>
        </div>

        {cart.length > 0 && (
          <div className="mb-4">
            <h3 className="font-medium mb-2">Đồ lưu niệm:</h3>
            <div className="space-y-2">
              {cart.map((item) => (
                <div key={item.merchandiseId} className="flex justify-between">
                  <span>{item.name} {item.gender && item.size && `(${item.gender} - ${item.size})`} × {item.quantity}</span>
                  <span>{item.price.toLocaleString()} VND</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-semibold">
                <span>Tổng cộng:</span>
                <span>{getTotalPrice().toLocaleString()} VND</span>
              </div>
            </div>
          </div>
        )}

        {cart.length === 0 && (
          <p className="text-gray-600">Không có đồ lưu niệm nào được chọn.</p>
        )}
      </div>

      {/* Payment Options */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Phương thức thanh toán</h2>
        <p className="font-legalese text-gray-600">
          Hiện tại chúng tôi chưa tích hợp hệ thống thanh toán. 
          Bạn có thể thanh toán trực tiếp tại sự kiện hoặc liên hệ với ban tổ chức.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" className="font-form" onClick={() => {
            setStep(3);
            router.push("/merchandise");
        }}>
          Quay lại
        </Button>
        <Button 
          className="font-form" 
          onClick={() => {
            setStep(5);
            router.push("/event-ticket");
          }}
        >
          Tiếp theo
        </Button>
      </div>
    </div>
  );
} 