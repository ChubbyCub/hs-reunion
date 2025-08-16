"use client";

import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useTranslations } from 'next-intl';

export default function MerchandisePage() {
  const router = useRouter();
  const { setStep } = useAppStore();
  const t = useTranslations('Stepper');

  const merchandiseItems = [
    {
      id: 1,
      name: "Áo thun kỷ niệm",
      description: "Áo thun cotton cao cấp với logo trường",
      price: "150,000 VND",
      image: "/placeholder-tshirt.jpg"
    },
    {
      id: 2,
      name: "Mũ bóng chày",
      description: "Mũ bóng chày với logo trường",
      price: "80,000 VND",
      image: "/placeholder-cap.jpg"
    },
    {
      id: 3,
      name: "Túi đeo chéo",
      description: "Túi đeo chéo canvas với logo trường",
      price: "120,000 VND",
      image: "/placeholder-bag.jpg"
    },
    {
      id: 4,
      name: "Bình nước",
      description: "Bình nước inox với logo trường",
      price: "100,000 VND",
      image: "/placeholder-bottle.jpg"
    }
  ];

  const handleNext = () => {
    setStep(3);
    router.push("/donation");
  };

  const handleBack = () => {
    setStep(1);
    router.push("/register");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-title text-gray-900 mb-4">
              {t('merchandise')}
            </h1>
            <p className="mt-2 text-muted-foreground font-legalese">
              Chọn các sản phẩm lưu niệm để đặt hàng. Bạn có thể chọn nhiều sản phẩm khác nhau.
            </p>
          </div>

          {/* Merchandise Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
            {merchandiseItems.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500 text-sm">Hình ảnh</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 mb-3 text-sm">
                      {item.description}
                    </p>
                    <p className="text-xl font-bold text-primary mb-4">
                      {item.price}
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        // TODO: Add to cart functionality
                        console.log(`Added ${item.name} to cart`);
                      }}
                    >
                      Thêm vào giỏ hàng
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Cart Summary */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Giỏ hàng</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Áo thun kỷ niệm</span>
                  <span>150,000 VND</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Mũ bóng chày</span>
                  <span>80,000 VND</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold">
                    <span>Tổng cộng:</span>
                    <span>230,000 VND</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              className="font-form px-8 py-3"
              onClick={handleBack}
            >
              Quay lại
            </Button>
            <Button 
              className="font-form px-8 py-3"
              onClick={handleNext}
            >
              Tiếp theo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 