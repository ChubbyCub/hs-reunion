"use client";

import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface MerchandiseItem {
  id: string;
  name: string;
  description: string;
  price: number;
  defaultQuantity: number;
  sizes?: string[];
  selectedSize?: string;
  genders?: string[];
  selectedGender?: string;
  quantity: number;
}

export default function MerchandisePage() {
  const router = useRouter();
  const { setStep } = useAppStore();
  const t = useTranslations('Stepper');

  const [merchandiseItems, setMerchandiseItems] = useState<MerchandiseItem[]>([
    {
      id: "tshirt",
      name: "Áo thun kỷ niệm",
      description: "Áo thun cotton cao cấp với logo trường",
      price: 150000,
      defaultQuantity: 0,
      sizes: ["S", "M", "L", "XL", "XXL", "3XL", "4XL"],
      selectedSize: "M",
      genders: ["Nam", "Nữ"],
      selectedGender: "Nam",
      quantity: 0
    },
    {
      id: "hat",
      name: "Nón kỷ niệm",
      description: "Nón bóng chày với logo trường",
      price: 80000,
      defaultQuantity: 0,
      quantity: 0
    },
    {
      id: "fan",
      name: "Quạt xếp",
      description: "Quạt xếp gấp với logo trường",
      price: 50000,
      defaultQuantity: 0,
      quantity: 0
    },
    {
      id: "scarf",
      name: "Khăn lụa",
      description: "Khăn lụa cao cấp với logo trường",
      price: 120000,
      defaultQuantity: 0,
      quantity: 0
    },
    {
      id: "tote",
      name: "Túi tote",
      description: "Túi tote canvas với logo trường",
      price: 100000,
      defaultQuantity: 0,
      quantity: 0
    },
    {
      id: "redEnvelope",
      name: "Bao lì xì (1 set 6 cái)",
      description: "Bao lì xì truyền thống với logo trường (miễn phí set đầu tiên)",
      price: 50000,
      defaultQuantity: 1,
      quantity: 1
    }
  ]);

  const updateQuantity = (id: string, newQuantity: number) => {
    setMerchandiseItems(items => 
      items.map(item => 
        item.id === id 
          ? { ...item, quantity: Math.max(0, newQuantity) }
          : item
      )
    );
  };

  const updateSize = (id: string, newSize: string) => {
    setMerchandiseItems(items => 
      items.map(item => 
        item.id === id 
          ? { ...item, selectedSize: newSize }
          : item
      )
    );
  };

  const updateGender = (id: string, newGender: string) => {
    setMerchandiseItems(items => 
      items.map(item => 
        item.id === id 
          ? { ...item, selectedGender: newGender }
          : item
      )
    );
  };

  const getTotalPrice = () => {
    return merchandiseItems.reduce((total, item) => {
      if (item.id === "redEnvelope") {
        // First set is free, additional sets cost 50,000 VND each
        const additionalSets = Math.max(0, item.quantity - 1);
        return total + (item.price * additionalSets);
      }
      return total + (item.price * item.quantity);
    }, 0);
  };

  const getSelectedItems = () => {
    return merchandiseItems.filter(item => item.quantity > 0);
  };

  const handleNext = () => {
    // TODO: Save merchandise selections to store
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
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-title text-gray-900 mb-4">
              {t('merchandise')}
            </h1>
            <p className="mt-2 text-muted-foreground font-legalese">
              Chọn các sản phẩm lưu niệm để đặt hàng. Bao lì xì sẽ được tặng kèm cho tất cả người tham dự.
            </p>
          </div>

          {/* Merchandise Items - Row Layout */}
          <div className="space-y-4 mb-8">
            {merchandiseItems.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-6">
                    {/* Image Placeholder */}
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-500 text-sm">Hình ảnh</span>
                    </div>
                    
                    {/* Item Details */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {item.name}
                      </h3>
                      <p className="text-gray-600 mb-3 text-sm">
                        {item.description}
                      </p>
                      
                                              {/* Size and Gender Selection for T-shirt */}
                        <div className="flex space-x-4 mb-3">
                          {item.sizes && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Kích thước:</label>
                              <select
                                value={item.selectedSize}
                                onChange={(e) => updateSize(item.id, e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              >
                                {item.sizes.map(size => (
                                  <option key={size} value={size}>{size}</option>
                                ))}
                              </select>
                            </div>
                          )}
                          
                          {item.genders && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính:</label>
                              <select
                                value={item.selectedGender}
                                onChange={(e) => updateGender(item.id, e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              >
                                {item.genders.map(gender => (
                                  <option key={gender} value={gender}>{gender}</option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>
                        
                        {/* Size measurements - Full width */}
                        {item.sizes && (
                          <div className="mb-3">
                            <div className="text-xs text-gray-500">
                              {item.selectedSize === "S" && "Kích thước S: 46cm x 66cm (rộng x dài)"}
                              {item.selectedSize === "M" && "Kích thước M: 48cm x 68cm (rộng x dài)"}
                              {item.selectedSize === "L" && "Kích thước L: 50cm x 70cm (rộng x dài)"}
                              {item.selectedSize === "XL" && "Kích thước XL: 52cm x 72cm (rộng x dài)"}
                              {item.selectedSize === "XXL" && "Kích thước XXL: 54cm x 74cm (rộng x dài)"}
                              {item.selectedSize === "3XL" && "Kích thước 3XL: 56cm x 76cm (rộng x dài)"}
                              {item.selectedSize === "4XL" && "Kích thước 4XL: 58cm x 78cm (rộng x dài)"}
                            </div>
                          </div>
                        )}
                    </div>
                    
                    {/* Price and Quantity */}
                    <div className="text-right flex-shrink-0">
                      {/* Price Display */}
                      <p className="text-xl font-bold text-primary mb-4">
                        {`${item.price.toLocaleString('vi-VN')} VND`}
                      </p>

                      {/* Quantity Selection */}
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 0}
                          className="w-8 h-8 p-0"
                        >
                          -
                        </Button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 p-0"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Cart Summary */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Giỏ hàng</h3>
              {getSelectedItems().length === 0 ? (
                <p className="text-gray-500 text-center py-4">Chưa có sản phẩm nào được chọn</p>
              ) : (
                <div className="space-y-3">
                  {getSelectedItems().map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <div className="flex-1">
                        <span className="font-medium">{item.name}</span>
                        {item.sizes && item.selectedSize && (
                          <span className="text-gray-500 ml-2">(Size: {item.selectedSize})</span>
                        )}
                        {item.genders && item.selectedGender && (
                          <span className="text-gray-500 ml-2">({item.selectedGender})</span>
                        )}
                        {item.quantity > 1 && (
                          <span className="text-gray-500 ml-2">x{item.quantity}</span>
                        )}
                      </div>
                      <span className="font-medium">
                        {item.id === "redEnvelope" && item.quantity === 1
                          ? "Miễn phí"
                          : item.id === "redEnvelope" && item.quantity > 1
                          ? `${(item.price * (item.quantity - 1)).toLocaleString('vi-VN')} VND (set đầu tiên miễn phí)`
                          : `${(item.price * item.quantity).toLocaleString('vi-VN')} VND`
                        }
                      </span>
                    </div>
                  ))}
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Tổng cộng:</span>
                      <span>{getTotalPrice().toLocaleString('vi-VN')} VND</span>
                    </div>
                  </div>
                </div>
              )}
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