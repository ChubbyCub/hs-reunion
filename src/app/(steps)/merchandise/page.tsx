"use client";

import { useAppStore } from "@/stores/app-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import { MerchandiseService } from "@/services/database/merchandise";
import type { Merchandise } from "@/types/common";
import Image from "next/image";
import { X } from "lucide-react";

export default function MerchandisePage() {
  const router = useRouter();
  const { setStep, updateCart, cart, formData } = useAppStore();
  const [merchandise, setMerchandise] = useState<Merchandise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // T-shirt selection state
  const [selectedGender, setSelectedGender] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [tshirtQuantity, setTshirtQuantity] = useState(1);

  // Size guide modal state
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // Quantity state for other items
  const [itemQuantities, setItemQuantities] = useState<{[key: number]: number}>({});

  // Name tag customization state - array of {name, class} for each possible name tag
  const [nameTagInputs, setNameTagInputs] = useState<Array<{name: string, class: string}>>([]);

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

  const addToCart = (item: Merchandise, quantity: number = 1) => {
    const existingItem = cart.find(cartItem =>
      cartItem.merchandiseId === item.id
    );

    if (existingItem) {
      updateCart(cart.map(cartItem =>
        cartItem.merchandiseId === item.id
          ? { ...cartItem, quantity: cartItem.quantity + quantity }
          : cartItem
      ));
    } else {
      updateCart([...cart, {
        merchandiseId: item.id,
        quantity: quantity,
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
      addToCart(tshirt, tshirtQuantity);
      // Reset selection
      setSelectedGender('');
      setSelectedSize('');
      setTshirtQuantity(1);
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const addNameTagToCart = (index: number) => {
    const input = nameTagInputs[index];

    // Validate inputs
    if (!input.name.trim() || !input.class.trim()) {
      alert('Vui lòng nhập đầy đủ tên và lớp');
      return;
    }

    if (!nameTagItem) {
      alert('Không tìm thấy sản phẩm bảng tên');
      return;
    }

    // Check if this name tag already exists in cart
    const existingNameTagIndex = cart.findIndex(item =>
      item.nameTagCustomization &&
      cart.indexOf(item) === getNameTagCartIndex(index)
    );

    if (existingNameTagIndex >= 0) {
      // Update existing name tag
      const newCart = [...cart];
      newCart[existingNameTagIndex] = {
        ...newCart[existingNameTagIndex],
        nameTagCustomization: {
          displayName: input.name.trim(),
          displayClass: input.class.trim()
        }
      };
      updateCart(newCart);
    } else {
      // Add new name tag to cart
      updateCart([...cart, {
        merchandiseId: nameTagItem.id,
        quantity: 1,
        name: nameTagItem.name,
        price: nameTagItem.price,
        gender: nameTagItem.gender || '',
        size: nameTagItem.size || '',
        nameTagCustomization: {
          displayName: input.name.trim(),
          displayClass: input.class.trim()
        }
      }]);
    }
  };

  // Helper to get the cart index for a specific name tag slot
  const getNameTagCartIndex = (slotIndex: number): number => {
    const nameTags = cart
      .map((item, idx) => ({ item, idx }))
      .filter(({ item }) => item.name.toLowerCase().includes('bảng tên') || item.name.toLowerCase().includes('name tag'));

    return nameTags[slotIndex]?.idx ?? -1;
  };

  // Check if a name tag slot is in the cart
  const isNameTagInCart = (slotIndex: number): boolean => {
    return getNameTagCartIndex(slotIndex) >= 0;
  };

  // Update name tag input
  const updateNameTagInput = (index: number, field: 'name' | 'class', value: string) => {
    const newInputs = [...nameTagInputs];
    newInputs[index] = {
      ...newInputs[index],
      [field]: value
    };
    setNameTagInputs(newInputs);
  };

  const handleRemoveFromCart = (index: number) => {
    const item = cart[index];
    const isTshirt = item.name.toLowerCase() === 'áo thun';

    if (item.quantity > 1) {
      const newCart = [...cart];
      newCart[index] = { ...newCart[index], quantity: newCart[index].quantity - 1 };

      // If removing t-shirt, check and remove excess name tags
      if (isTshirt) {
        const newTshirtCount = newCart
          .filter(i => i.name.toLowerCase() === 'áo thun')
          .reduce((sum, i) => sum + i.quantity, 0);
        const currentNameTagCount = newCart
          .filter(i => i.name.toLowerCase().includes('bảng tên') || i.name.toLowerCase().includes('name tag'))
          .length;

        if (currentNameTagCount > newTshirtCount) {
          // Remove the last name tag
          const lastNameTagIndex = newCart.map((i, idx) =>
            (i.name.toLowerCase().includes('bảng tên') || i.name.toLowerCase().includes('name tag')) ? idx : -1
          ).filter(idx => idx !== -1).pop();

          if (lastNameTagIndex !== undefined) {
            newCart.splice(lastNameTagIndex, 1);
          }
        }
      }

      updateCart(newCart);
    } else {
      let newCart = cart.filter((_, i) => i !== index);

      // If removing t-shirt, remove excess name tags
      if (isTshirt) {
        const newTshirtCount = newCart
          .filter(i => i.name.toLowerCase() === 'áo thun')
          .reduce((sum, i) => sum + i.quantity, 0);
        const nameTagItems = newCart
          .map((i, idx) => ({ item: i, index: idx }))
          .filter(({ item }) => item.name.toLowerCase().includes('bảng tên') || item.name.toLowerCase().includes('name tag'));

        // Remove name tags that exceed t-shirt count
        const nameTagsToRemove = Math.max(0, nameTagItems.length - newTshirtCount);
        if (nameTagsToRemove > 0) {
          const indicesToRemove = nameTagItems.slice(-nameTagsToRemove).map(({ index }) => index);
          newCart = newCart.filter((_, i) => !indicesToRemove.includes(i));
        }
      }

      updateCart(newCart);
    }
  };

  const handleEditNameTag = (cartIndex: number) => {
    // Remove from cart to enable editing
    updateCart(cart.filter((_, i) => i !== cartIndex));
  };

  const handleIncreaseQuantity = (index: number) => {
    const newCart = [...cart];
    newCart[index] = { ...newCart[index], quantity: newCart[index].quantity + 1 };
    updateCart(newCart);
  };

  const handleContinue = () => {
    // Cart is already saved in local storage via the store
    // No need to save to database here - that will happen at the final step

    // If user is not attending the event, skip donation and go straight to payment
    if (!formData.willAttendEvent) {
      setStep(4);
      router.push("/payment");
    } else {
      setStep(3);
      router.push("/donation");
    }
  };

  const handleBack = () => {
    setStep(2);
    router.push("/register");
  };

  // Separate T-shirts from other items
  const tshirts = merchandise.filter(item =>
    item.name.toLowerCase() === 'áo thun'
  );

  // Separate name tags from other items
  const nameTagItem = merchandise.find(item =>
    item.name.toLowerCase().includes('bảng tên') || item.name.toLowerCase().includes('name tag')
  );

  const otherItems = merchandise.filter(item =>
    item.name.toLowerCase() !== 'áo thun' &&
    !item.name.toLowerCase().includes('bảng tên') &&
    !item.name.toLowerCase().includes('name tag')
  );

  // Count t-shirts in cart
  const tshirtCount = cart
    .filter(item => item.name.toLowerCase() === 'áo thun')
    .reduce((sum, item) => sum + item.quantity, 0);

  // Count name tags in cart - not currently used but kept for future reference
  // const nameTagCount = cart
  //   .filter(item => item.name.toLowerCase().includes('bảng tên') || item.name.toLowerCase().includes('name tag'))
  //   .reduce((sum, item) => sum + item.quantity, 0);

  // Get unique genders and sizes from T-shirts
  const genders = [...new Set(tshirts.map(item => item.gender))];
  const sizes = [...new Set(tshirts.map(item => item.size))];

  // Initialize name tag inputs when t-shirt count changes
  useEffect(() => {
    // Only update if t-shirt count changed
    if (tshirtCount !== nameTagInputs.length) {
      const newInputs: Array<{name: string, class: string}> = [];

      // Preserve existing inputs
      for (let i = 0; i < tshirtCount; i++) {
        if (i < nameTagInputs.length) {
          newInputs.push(nameTagInputs[i]);
        } else {
          // Pre-fill new rows with registration data
          newInputs.push({
            name: formData.fullName || '',
            class: formData.class || ''
          });
        }
      }

      setNameTagInputs(newInputs);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tshirtCount, formData.fullName, formData.class]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-3 py-6 sm:p-6 max-w-4xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải đồ lưu niệm...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-3 py-6 sm:p-6 max-w-4xl">
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
    <div className="container mx-auto px-3 py-6 sm:p-6 max-w-6xl">
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
                {/* T-shirt Image */}
                <div className="mb-6 flex justify-center">
                  <div className="relative w-full max-w-md">
                    <Image
                      src="/t_shirt_image.jpg"
                      alt="Áo thun LHP0306"
                      width={600}
                      height={600}
                      className="rounded-lg object-cover w-full h-auto"
                      priority
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                  <div>
                    <p className="text-lg sm:text-xl font-semibold mb-1">Áo Thun</p>
                    <p className="text-sm sm:text-base text-gray-600 mb-2">Chọn kiểu dáng và kích thước bạn thích</p>
                    <button
                      onClick={() => setShowSizeGuide(true)}
                      className="text-blue-600 hover:text-blue-800 underline text-sm font-medium"
                    >
                      Xem Size Guide
                    </button>
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
              </Card>
            </div>
          )}

          {/* Name Tag Section - Only show if user has t-shirts in cart */}
          {nameTagItem && tshirtCount > 0 && (
            <div className="mb-8">
              <Card className="p-6 border-2 border-green-500 bg-green-50">
                {/* Name Tag Sample Image */}
                <div className="mb-6 flex justify-center">
                  <div className="relative w-full max-w-md">
                    <Image
                      src="/name_tag_sample.png"
                      alt="Mẫu bảng tên"
                      width={600}
                      height={400}
                      className="rounded-lg object-contain w-full h-auto"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="font-semibold text-lg sm:text-xl">
                      {nameTagItem.name}
                    </h3>
                    <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                      MIỄN PHÍ
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Mỗi áo được tặng kèm 1 bảng tên cá nhân hóa. Vui lòng nhập thông tin cho từng bảng tên bên dưới.
                  </p>

                  {/* Name tag input rows */}
                  <div className="space-y-3">
                    {nameTagInputs.map((input, index) => {
                      const inCart = isNameTagInCart(index);
                      const cartIndex = getNameTagCartIndex(index);

                      return (
                        <div key={index} className={`grid grid-cols-1 sm:grid-cols-12 gap-3 p-3 rounded-md ${inCart ? 'bg-gray-100' : 'bg-white'} border border-gray-300`}>
                          <div className="sm:col-span-1 flex items-center">
                            <span className="font-medium text-sm text-gray-700">#{index + 1}</span>
                          </div>
                          <div className="sm:col-span-4">
                            <input
                              type="text"
                              value={input.name}
                              onChange={(e) => updateNameTagInput(index, 'name', e.target.value)}
                              disabled={inCart}
                              placeholder="Nhập tên"
                              className={`w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm ${inCart ? 'bg-gray-200 cursor-not-allowed' : ''}`}
                            />
                          </div>
                          <div className="sm:col-span-4">
                            <input
                              type="text"
                              value={input.class}
                              onChange={(e) => updateNameTagInput(index, 'class', e.target.value)}
                              disabled={inCart}
                              placeholder="Nhập lớp (VD: 12A1)"
                              className={`w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm ${inCart ? 'bg-gray-200 cursor-not-allowed' : ''}`}
                            />
                          </div>
                          <div className="sm:col-span-3 flex items-center gap-2">
                            {inCart ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditNameTag(cartIndex)}
                                className="w-full hover:bg-blue-500 hover:border-blue-500 hover:text-white"
                              >
                                Sửa
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => addNameTagToCart(index)}
                                className="w-full bg-green-600 hover:bg-green-700"
                              >
                                OK
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
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
              addToCart(item, quantity);
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
                  {cart.map((item, index) => (
                    <div key={`${item.merchandiseId}-${index}`} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 p-3 bg-white rounded border">
                      <div className="flex-1">
                        <p className="font-medium text-sm sm:text-base">
                          {item.name}
                        </p>
                        {item.gender && item.size && (
                          <p className="text-xs sm:text-sm text-gray-600 capitalize">
                            {item.gender} • {item.size}
                          </p>
                        )}
                        {item.nameTagCustomization && (
                          <p className="text-xs sm:text-sm text-green-700 font-medium">
                            {item.nameTagCustomization.displayName} - {item.nameTagCustomization.displayClass}
                          </p>
                        )}
                        <p className="text-xs sm:text-sm text-gray-600">
                          {item.price.toLocaleString()} VND × {item.quantity}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 sm:ml-3 self-end sm:self-center">
                        {!item.nameTagCustomization && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRemoveFromCart(index)}
                              className="w-8 h-8 hover:bg-blue-500 hover:border-blue-500 hover:text-white"
                            >
                              -
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleIncreaseQuantity(index)}
                              className="w-8 h-8 hover:bg-blue-500 hover:border-blue-500 hover:text-white"
                            >
                              +
                            </Button>
                          </>
                        )}
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

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowSizeGuide(false)}
        >
          <div
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Size Guide</h3>
              <button
                onClick={() => setShowSizeGuide(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4">
              <Image
                src="/size_guide.jpg"
                alt="Size Guide"
                width={1200}
                height={800}
                className="w-full h-auto rounded-lg"
              />
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex justify-end">
              <Button variant="outline" onClick={() => setShowSizeGuide(false)}>
                Đóng
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
} 