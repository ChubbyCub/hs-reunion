"use client";

import { useAppStore } from "@/stores/app-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import { MerchandiseService } from "@/services/database/merchandise";
import type { Merchandise } from "@/types/common";

export default function MerchandisePage() {
  const router = useRouter();
  const { setStep, updateCart, cart } = useAppStore();
  const [merchandise, setMerchandise] = useState<Merchandise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // T-shirt selection state
  const [selectedGender, setSelectedGender] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [tshirtQuantity, setTshirtQuantity] = useState(1);
  
  // Quantity state for other items
  const [itemQuantities, setItemQuantities] = useState<{[key: number]: number}>({});

  useEffect(() => {
    loadMerchandise();
  }, []);

  const loadMerchandise = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await MerchandiseService.getAllMerchandise();
      
      if (result.success && result.data) {
        setMerchandise(result.data);
      } else {
        setError(result.error || 'Failed to load merchandise');
      }
    } catch {
      setError('Error loading merchandise');
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = (item: Merchandise) => {
    const existingItem = cart.find(cartItem => 
      cartItem.merchandiseId === item.id
    );

    if (existingItem) {
      updateCart(cart.map(cartItem => 
        cartItem.merchandiseId === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      updateCart([...cart, {
        merchandiseId: item.id,
        quantity: 1,
        name: item.name,
        price: item.price,
        gender: item.gender,
        size: item.size
      }]);
    }
  };

  const addTshirtToCart = () => {
    if (!selectedGender || !selectedSize) return;
    
    // Find the T-shirt with selected gender and size
    const tshirt = merchandise.find(item => 
      item.name.toLowerCase() === 'áo thun' && 
      item.gender === selectedGender && 
      item.size === selectedSize
    );
    
    if (tshirt) {
      // Add the selected quantity of T-shirts
      for (let i = 0; i < tshirtQuantity; i++) {
        addToCart(tshirt);
      }
      // Reset selection
      setSelectedGender('');
      setSelectedSize('');
      setTshirtQuantity(1);
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleContinue = () => {
    // Cart is already saved in local storage via the store
    // No need to save to database here - that will happen at the final step
    setStep(3);
    router.push("/donation");
  };

  const handleBack = () => {
    setStep(2);
    router.push("/register");
  };

  // Separate T-shirts from other items
  const tshirts = merchandise.filter(item => 
    item.name.toLowerCase() === 'áo thun'
  );
  const otherItems = merchandise.filter(item => 
    item.name.toLowerCase() !== 'áo thun'
  );

  // Get unique genders and sizes from T-shirts
  const genders = [...new Set(tshirts.map(item => item.gender))];
  const sizes = [...new Set(tshirts.map(item => item.size))];

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải đồ lưu niệm...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadMerchandise} variant="outline">
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-2xl font-title mb-6 text-center">Đồ Lưu Niệm</h1>
      <p className="font-legalese mb-6 text-center">
        Hãy ủng hộ sự kiện của chúng tôi bằng cách mua đồ lưu niệm!
      </p>

            <div className="grid grid-cols-1 gap-6">
        {/* Merchandise Grid */}
        <div>
          {/* T-shirts Section */}
          {tshirts.length > 0 && (
            <div className="mb-8">
              <Card className="p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                  <div>
                    <p className="text-lg sm:text-xl font-semibold mb-1">Áo Thun</p>
                    <p className="text-sm sm:text-base text-gray-600">Chọn kiểu dáng và kích thước bạn thích</p>
                  </div>
                  <div className="flex flex-col sm:items-end gap-3">
                    <p className="font-bold text-xl sm:text-2xl">
                      {tshirts.length > 0 ? `${tshirts[0].price.toLocaleString()} VND` : 'Giá chưa xác định'}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700">Số lượng:</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setTshirtQuantity(Math.max(1, tshirtQuantity - 1))}
                        className="w-10 h-10 hover:bg-blue-500 hover:border-blue-500 hover:text-white"
                      >
                        -
                      </Button>
                      <span className="w-12 text-center font-medium">{tshirtQuantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setTshirtQuantity(tshirtQuantity + 1)}
                        className="w-10 h-10 hover:bg-blue-500 hover:border-blue-500 hover:text-white"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pt-4 border-t">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
                    <select
                      value={selectedGender}
                      onChange={(e) => setSelectedGender(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    >
                      <option value="">Chọn giới tính</option>
                      {genders.map(gender => (
                        <option key={gender} value={gender}>{gender === 'men' ? 'Nam' : gender === 'women' ? 'Nữ' : gender === 'unisex' ? 'Unisex' : gender}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kích thước</label>
                    <select
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    >
                      <option value="">Chọn kích thước</option>
                      {sizes.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-end justify-center sm:justify-end sm:col-span-2 lg:col-span-1">
                    <Button 
                      onClick={addTshirtToCart}
                      disabled={!selectedGender || !selectedSize}
                      size="lg"
                      className="h-12 w-full sm:w-auto"
                    >
                      Thêm vào giỏ hàng
                    </Button>
                  </div>
                </div>
                
                {selectedSize && (
                  <div className="col-span-full mt-4">
                    <p className="text-xs sm:text-sm text-gray-600 text-center">
                      {selectedSize === "S" && "Kích thước S: 46cm x 66cm (rộng x dài)"}
                      {selectedSize === "M" && "Kích thước M: 48cm x 68cm (rộng x dài)"}
                      {selectedSize === "L" && "Kích thước L: 50cm x 70cm (rộng x dài)"}
                      {selectedSize === "XL" && "Kích thước XL: 52cm x 72cm (rộng x dài)"}
                      {selectedSize === "XXL" && "Kích thước XXL: 54cm x 74cm (rộng x dài)"}
                      {selectedSize === "3XL" && "Kích thước 3XL: 56cm x 76cm (rộng x dài)"}
                      {selectedSize === "4XL" && "Kích thước 4XL: 58cm x 78cm (rộng x dài)"}
                    </p>
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* Other Items Section */}
          {otherItems.length > 0 && (
            <div>
              <div className="grid grid-cols-1 gap-6">
                {otherItems.map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <div className="md:col-span-2">
            <h3 className="font-semibold text-lg sm:text-xl mb-2">{item.name}</h3>
            {item.gender && item.size && (
              <p className="text-xs sm:text-sm text-gray-600 capitalize">
                {item.gender} • {item.size}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="font-bold text-lg sm:text-2xl">{item.price.toLocaleString()} VND</p>
          </div>
        </div>
                      
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Số lượng:</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setItemQuantities(prev => ({
                ...prev,
                [item.id]: Math.max(1, (prev[item.id] || 1) - 1)
              }))}
              className="w-10 h-10 hover:bg-blue-500 hover:border-blue-500 hover:text-white"
            >
              -
            </Button>
            <span className="w-12 text-center font-medium">{itemQuantities[item.id] || 1}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setItemQuantities(prev => ({
                ...prev,
                [item.id]: (prev[item.id] || 1) + 1
              }))}
              className="w-10 h-10 hover:bg-blue-500 hover:border-blue-500 hover:text-white"
            >
              +
            </Button>
          </div>
          
          <Button 
            onClick={() => {
              const quantity = itemQuantities[item.id] || 1;
              for (let i = 0; i < quantity; i++) {
                addToCart(item);
              }
              setItemQuantities(prev => ({ ...prev, [item.id]: 1 }));
            }}
            className="h-12 w-full sm:w-auto"
            size="lg"
          >
            Thêm vào giỏ hàng
          </Button>
        </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {merchandise.length === 0 && (
            <p className="text-gray-500 text-center py-8">Hiện tại không có đồ lưu niệm nào.</p>
          )}
        </div>

        {/* Shopping Cart */}
        <div>
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Giỏ hàng</h2>
            
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Giỏ hàng của bạn trống</p>
            ) : (
              <>
                <div className="space-y-3 mb-4">
                  {cart.map((item) => (
                    <div key={item.merchandiseId} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 p-3 bg-white rounded border">
                      <div className="flex-1">
                        <p className="font-medium text-sm sm:text-base">
                          {item.name}
                        </p>
                        {item.gender && item.size && (
                          <p className="text-xs sm:text-sm text-gray-600 capitalize">
                            {item.gender} • {item.size}
                          </p>
                        )}
                        <p className="text-xs sm:text-sm text-gray-600">
                          {item.price.toLocaleString()} VND × {item.quantity}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 sm:ml-3 self-end sm:self-center">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            if (item.quantity > 1) {
                              updateCart(cart.map(cartItem => 
                                cartItem.merchandiseId === item.merchandiseId 
                                  ? { ...cartItem, quantity: cartItem.quantity - 1 }
                                  : cartItem
                              ));
                            } else {
                              updateCart(cart.filter(cartItem => cartItem.merchandiseId !== item.merchandiseId));
                            }
                          }}
                          className="w-8 h-8 hover:bg-blue-500 hover:border-blue-500 hover:text-white"
                        >
                          -
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            updateCart(cart.map(cartItem => 
                              cartItem.merchandiseId === item.merchandiseId 
                                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                                : cartItem
                              ));
                          }}
                          className="w-8 h-8 hover:bg-blue-500 hover:border-blue-500 hover:text-white"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-base sm:text-lg font-semibold">
                    <span>Tổng cộng:</span>
                    <span>{getTotalPrice().toLocaleString()} VND</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between">
        <Button variant="outline" onClick={handleBack} className="order-2 sm:order-1">
          Quay lại
        </Button>
        <Button
          onClick={handleContinue}
          className="order-1 sm:order-2"
        >
          Tiếp tục
        </Button>
      </div>
    </div>
  );
} 