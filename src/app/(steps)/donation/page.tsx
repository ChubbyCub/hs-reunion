"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/stores/app-store";

const minimumDonation = { amount: 500000 };

const additionalDonationOptions = [
  { amount: 1000000 },
  { amount: 1500000 },
  { amount: 2000000 },
];

export default function DonationPage() {
  const router = useRouter();
  const { setStep, updateFormData } = useAppStore();
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
      // Don't update selectedAmount for invalid amounts
      setIsCustomSelected(true);
      setValidationError('error');
    } else {
      // Reset to minimum when field is cleared
      setSelectedAmount(500000);
      setIsCustomSelected(false);
      setValidationError('');
    }
  };

  const handleContinue = () => {
    const finalAmount = isCustomSelected && customAmount ? parseInt(customAmount.replace(/[.,]/g, '')) : selectedAmount;

    if (finalAmount < 500000) {
      setValidationError('error');
      return;
    }

    setValidationError('');
    // Save donation amount to store
    updateFormData({ donationAmount: finalAmount });
    setStep(3);
    router.push("/payment");
  };

  const handleBack = () => {
    setStep(1);
    router.push("/register");
  };

  return (
    <>
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-title tracking-tighter">
          Khoản đóng góp của bạn
        </h1>
        <p className="mt-3 text-base text-gray-700 font-legalese leading-relaxed">
          Mỗi tấm lòng ủng hộ sẽ góp phần giúp ngày trở về của LHP0306 thêm trọn vẹn và ý nghĩa. Mức đóng góp tối thiểu: <span className="font-semibold text-gray-900">500.000 VND/người</span> (đã bao gồm chi phí tổ chức cơ bản, Chi tiết xem tại{' '}
          <a
            href="https://drive.google.com/file/d/1bX5ecaMj5Azb901-4LGva_D9LLt_bzpM/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center font-medium text-gray-900 hover:text-gray-600 transition-colors"
          >
            Bảng dự toán kinh phí
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          ).
        </p>
      </div>

      {/* Donation Options */}
      <div className="space-y-6">
        {/* Minimum Amount Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Số tiền tối thiểu
          </h2>
          <Card
            className={`cursor-pointer transition-all duration-200 ${
              selectedAmount === minimumDonation.amount && !isCustomSelected
                ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200'
                : 'hover:shadow-md border-gray-200'
            }`}
            onClick={() => handleAmountSelect(minimumDonation.amount)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    {formatAmount(minimumDonation.amount)} VND
                  </h3>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                  selectedAmount === minimumDonation.amount && !isCustomSelected
                    ? 'bg-blue-500 border-blue-500 shadow-md'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}>
                  {selectedAmount === minimumDonation.amount && !isCustomSelected && (
                    <div className="w-3 h-3 bg-white rounded-full shadow-sm"></div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Optional Amounts Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Mức đóng góp khác (tùy chọn)
          </h2>
          <div className="space-y-3">
            {additionalDonationOptions.map((option) => (
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
      {selectedAmount > 0 && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Số tiền đã chọn:</p>
            <p className="text-xl font-bold text-gray-900">
              {formatAmount(selectedAmount)} VND
            </p>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between">
        <Button variant="outline" onClick={handleBack} className="order-2 sm:order-1">
          Quay lại
        </Button>
        <Button
          onClick={handleContinue}
          disabled={selectedAmount < 500000}
          className="order-1 sm:order-2"
        >
          Tiếp tục
        </Button>
      </div>
    </>
  );
}
