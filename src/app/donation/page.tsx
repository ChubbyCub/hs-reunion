"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const donationOptions = [
  { amount: 500000, required: false },
  { amount: 1000000, required: false },
  { amount: 1500000, required: false },
  { amount: 2000000, required: false },
];

export default function DonationPage() {
  const [selectedAmount, setSelectedAmount] = useState(500000);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustomSelected, setIsCustomSelected] = useState(false);
  const [validationError, setValidationError] = useState('');

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('vi-VN');
  };

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

  const handleSubmit = () => {
    const finalAmount = isCustomSelected && customAmount ? parseInt(customAmount.replace(/[.,]/g, '')) : selectedAmount;
    
    if (finalAmount < 500000) {
      setValidationError('error');
      return;
    }
    
    setValidationError('');
    // TODO: Handle donation submission
    alert(`Cảm ơn bạn đã quyên góp ${formatAmount(finalAmount)} VND!`);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <div className="flex-1 w-full px-3 sm:px-6 py-6 sm:py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-title text-gray-900 mb-3 sm:mb-4">
              Quyên góp
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground font-legalese px-2">
              Hỗ trợ sự kiện họp mặt cựu học sinh LHP khóa 2003-2006
            </p>
          </div>

          {/* Donation Options */}
          <div className="space-y-6">
            {/* Suggested Amounts Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Số tiền gợi ý
              </h2>
              <div className="space-y-3">
                {donationOptions.map((option) => (
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

          {/* Submit Button */}
          <div className="mt-8 text-center">
            <Button 
              className="font-form px-8 py-3 text-lg"
              onClick={handleSubmit}
              disabled={selectedAmount < 500000}
            >
              Quyên góp ngay
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>Mọi đóng góp của bạn sẽ được sử dụng để tổ chức sự kiện một cách tốt nhất.</p>
            <p className="mt-2">Liên hệ Ban Tổ Chức nếu bạn cần hỗ trợ thêm.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
