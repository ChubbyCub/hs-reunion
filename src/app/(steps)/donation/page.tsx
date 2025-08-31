"use client";

import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState, useEffect } from 'react';

const donationOptions = [
  { amount: 500000, required: true },
  { amount: 1000000, required: false },
  { amount: 1500000, required: false },
  { amount: 2000000, required: false },
];

export default function DonationPage() {
  const router = useRouter();
  const { formData, updateFormData, setStep } = useAppStore();
  const [selectedAmount, setSelectedAmount] = useState(formData.donationAmount || 500000);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustomSelected, setIsCustomSelected] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [validationError, setValidationError] = useState('');

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('vi-VN');
  };

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (hasHydrated && formData.donationAmount) {
      setSelectedAmount(formData.donationAmount);
      // Check if the amount is not one of the predefined options
      const isCustom = !donationOptions.some(option => option.amount === formData.donationAmount);
      if (isCustom) {
        setIsCustomSelected(true);
        setCustomAmount(formData.donationAmount.toString());
      }
    }
  }, [hasHydrated, formData.donationAmount]);

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setIsCustomSelected(false);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    const numValue = parseInt(value.replace(/[.,]/g, '')) || 0;
    
    if (numValue >= 500000) {
      setSelectedAmount(numValue);
      setIsCustomSelected(true);
      setValidationError('');
    } else if (numValue > 0) {
      setSelectedAmount(numValue);
      setIsCustomSelected(true);
      setValidationError('error');
    } else {
      setIsCustomSelected(false);
      setValidationError('');
    }
  };

  const handleNext = () => {
    const finalAmount = isCustomSelected && customAmount ? parseInt(customAmount.replace(/[.,]/g, '')) : selectedAmount;
    
    if (finalAmount < 500000) {
      setValidationError('error');
      return;
    }
    
    setValidationError('');
    updateFormData({ donationAmount: finalAmount });
    setStep(4);
    router.push("/payment");
  };

  const handleBack = () => {
    setStep(2);
    router.push("/merchandise");
  };

  if (!hasHydrated) return <div>Đang tải...</div>;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-title text-gray-900 mb-4">
              Quyên góp
            </h1>
            <p className="mt-2 text-muted-foreground font-legalese">
              Vui lòng chọn số tiền quyên góp. Số tiền tối thiểu là 500,000 VND.
            </p>
          </div>

          {/* Donation Options */}
          <div className="space-y-6">
            {/* Minimum Required Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Bắt buộc tối thiểu
              </h2>
              <Card 
                className={`cursor-pointer transition-all duration-200 ${
                  selectedAmount === 500000 && !isCustomSelected
                    ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200' 
                    : 'hover:shadow-md border-gray-200'
                }`}
                onClick={() => handleAmountSelect(500000)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">
                        {formatAmount(500000)} VND
                      </h3>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      selectedAmount === 500000 && !isCustomSelected
                        ? 'bg-blue-500 border-blue-500 shadow-md' 
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}>
                      {selectedAmount === 500000 && !isCustomSelected && (
                        <div className="w-3 h-3 bg-white rounded-full shadow-sm"></div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Optional Choices Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Tùy chọn bổ sung
              </h2>
              <div className="space-y-3">
                {donationOptions.slice(1).map((option) => (
                  <Card 
                    key={option.amount}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedAmount === option.amount && !isCustomSelected
                        ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200' 
                        : 'hover:shadow-md border-gray-200'
                    }`}
                    onClick={() => handleAmountSelect(option.amount)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-semibold text-gray-900">
                            {formatAmount(option.amount)} VND
                          </h3>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                          selectedAmount === option.amount && !isCustomSelected
                            ? 'bg-blue-500 border-blue-500 shadow-md' 
                            : 'border-gray-300 bg-white hover:border-gray-400'
                        }`}>
                          {selectedAmount === option.amount && !isCustomSelected && (
                            <div className="w-3 h-3 bg-white rounded-full shadow-sm"></div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Custom Amount Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Số tiền tùy chọn
              </h2>
              <Card 
                className={`transition-all duration-200 ${
                  isCustomSelected
                    ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200' 
                    : 'border-gray-200'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-900 mb-2">
                        Nhập số tiền của bạn
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="text"
                          placeholder="Nhập số tiền bằng VND"
                          value={customAmount}
                          onChange={(e) => handleCustomAmountChange(e.target.value)}
                          className={`flex-1 font-form ${validationError ? 'border-red-500 focus:border-red-500' : ''}`}
                          onFocus={() => setIsCustomSelected(true)}
                        />
                        <span className="text-sm text-gray-600 whitespace-nowrap">VND</span>
                      </div>
                      {validationError && (
                        <p className="text-sm text-red-600 mt-1">
                          Số tiền quyên góp tối thiểu là 500.000 VND
                        </p>
                      )}
                      <p className="text-sm text-gray-600 mt-1">
                        Tối thiểu 500.000 VND
                      </p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ml-4 ${
                      isCustomSelected
                        ? 'bg-blue-500 border-blue-500 shadow-md' 
                        : 'border-gray-300 bg-white'
                    }`}>
                      {isCustomSelected && (
                        <div className="w-3 h-3 bg-white rounded-full shadow-sm"></div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Selected Amount Display */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Số tiền đã chọn:</p>
              <p className="text-xl font-bold text-gray-900">
                {formatAmount(selectedAmount)}
              </p>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
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
              disabled={selectedAmount < 500000}
            >
              Tiếp theo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 