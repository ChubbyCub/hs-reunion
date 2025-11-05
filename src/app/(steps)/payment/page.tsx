"use client";

import { useAppStore } from "@/stores/app-store";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { Upload, CheckCircle, AlertCircle, X } from "lucide-react";
import Image from "next/image";

export default function PaymentPage() {
    const router = useRouter();
    const { setStep, formData, cart, updateFormData, saveEverythingToDatabase } = useAppStore();
    const donationAmount = formData.donationAmount || 0;
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [uploadMessage, setUploadMessage] = useState('');
    const [message, setMessage] = useState(formData.message || '');
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getMerchandiseTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getTotalPrice = () => {
        return getMerchandiseTotal() + donationAmount;
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setUploadMessage('Chỉ chấp nhận file hình ảnh');
                setUploadStatus('error');
                return;
            }
            
            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                setUploadMessage('File phải nhỏ hơn 5MB');
                setUploadStatus('error');
                return;
            }
            
            setSelectedFile(file);
            setUploadStatus('idle');
            setUploadMessage('');
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setIsUploading(true);
        setUploadStatus('idle');
        setUploadMessage('');

        try {
            // For now, just store the file info in the store
            // The actual upload will happen during finish registration
            const fileInfo = {
                file: selectedFile,
                name: selectedFile.name,
                size: selectedFile.size,
                type: selectedFile.type,
                uploadedAt: new Date().toISOString()
            };

            // Store the actual file for later upload
            useAppStore.getState().setPaymentProofFile(fileInfo);

            setUploadStatus('success');
            setUploadMessage('File đã được chọn! Sẽ được tải lên khi hoàn tất đăng ký.');
        } catch (error) {
            setUploadStatus('error');
            setUploadMessage('Có lỗi xảy ra khi chọn file');
            console.error('File selection error:', error);
        } finally {
            setIsUploading(false);
        }
    };

    const removeFile = () => {
        setSelectedFile(null);
        setUploadStatus('idle');
        setUploadMessage('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // User must upload payment proof if they have any cart items or donation amount
    const hasPaymentRequired = cart.length > 0 || donationAmount > 0;
    const canProceed = hasPaymentRequired ? uploadStatus === 'success' : true;

    const handleCompleteRegistration = async () => {
        // Save message to formData
        updateFormData({ message });

        setIsSaving(true);
        setSaveError('');

        try {
            const result = await saveEverythingToDatabase();
            if (result.success) {
                // Redirect to success page
                router.push("/complete");
            } else {
                setSaveError(`Lỗi khi lưu dữ liệu: ${result.error}`);
                setIsSaving(false);
            }
        } catch (error) {
            setSaveError("Lỗi không xác định khi lưu dữ liệu.");
            setIsSaving(false);
            console.error('Registration error:', error);
        }
    };

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-4xl">
      <h1 className="text-xl sm:text-2xl font-title mb-4 sm:mb-6">Thanh toán</h1>
      
      {/* Order Summary */}
      <div className="bg-gray-50 p-4 sm:p-6 rounded-lg mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Tóm tắt đơn hàng</h2>
        
        <div className="mb-3 sm:mb-4">
          <h3 className="font-medium mb-2 text-sm sm:text-base">Thông tin người tham gia:</h3>
          <p className="text-gray-700 text-sm sm:text-base">{formData.fullName}</p>
          <p className="text-gray-700 text-sm sm:text-base">{formData.email}</p>
          <p className="text-gray-700 text-sm sm:text-base">{formData.phone}</p>
        </div>

        {cart.length > 0 && (
          <div className="mb-3 sm:mb-4">
            <h3 className="font-medium mb-2 text-sm sm:text-base">Đồ lưu niệm:</h3>
            <div className="space-y-2">
              {cart.map((item) => {
                const itemTotal = item.price * item.quantity;
                return (
                  <div key={item.merchandiseId} className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                    <span className="text-sm sm:text-base">
                      {item.name} {item.gender && item.size && `(${item.gender} - ${item.size})`} × {item.quantity}
                    </span>
                    <span className="text-sm sm:text-base font-medium">{itemTotal.toLocaleString()} VND</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {cart.length === 0 && (
          <div className="mb-3 sm:mb-4">
            <p className="text-gray-600">Không có đồ lưu niệm nào được chọn.</p>
          </div>
        )}

        {/* Donation Amount */}
        <div className="mb-3 sm:mb-4">
          <h3 className="font-medium mb-2 text-sm sm:text-base">Quyên góp:</h3>
          <div className="flex justify-between">
            <span className="text-sm sm:text-base">Số tiền quyên góp</span>
            <span className="text-sm sm:text-base font-medium">{donationAmount.toLocaleString()} VND</span>
          </div>
        </div>

        {/* Total */}
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-semibold text-lg">
            <span className="text-sm sm:text-base">Tổng cộng:</span>
            <span className="text-sm sm:text-base">{getTotalPrice().toLocaleString()} VND</span>
          </div>
        </div>
      </div>

      {/* Payment Instructions */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Hướng dẫn thanh toán</h2>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            <div className="flex-1">
              <p className="text-blue-800 mb-2">
                <strong>Chuyển khoản ngân hàng:</strong>
              </p>
              <p className="text-blue-700 mb-1">Ngân hàng: ACB (Ngân hàng thương mại cổ phần Á Châu)</p>
              <p className="text-blue-700 mb-1">Chi nhánh: ACB - PGD KHANH HOI</p>
              <p className="text-blue-700 mb-1">Số tài khoản: 47117217</p>
              <p className="text-blue-700 mb-1">Tên tài khoản: NGUYEN CONG HOANG YEN</p>
              <p className="text-blue-700 mb-1">Swift Code: ASCBVNVX</p>
              <p className="text-blue-700 mb-1">Nội dung chuyển khoản: {formData.email}</p>
            </div>
            <div className="flex justify-center md:justify-end">
              <div className="bg-white p-2 rounded-lg border border-blue-300">
                <Image
                  src="/bank-qr.jpeg"
                  alt="QR Code chuyển khoản ngân hàng"
                  width={200}
                  height={200}
                  className="w-40 h-auto sm:w-48"
                />
                <p className="text-center text-xs text-blue-600 mt-1">Quét mã QR để chuyển khoản</p>
              </div>
            </div>
          </div>
        </div>
        <p className="text-gray-600 text-sm">
          Sau khi chuyển khoản, vui lòng chụp màn hình xác nhận và tải lên bên dưới.
        </p>
      </div>

      {/* File Upload Section */}
      {(cart.length > 0 || donationAmount > 0) && (
        <div className="mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Tải lên xác nhận thanh toán</h2>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6">
            {!selectedFile ? (
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">
                  Chọn file hình ảnh xác nhận thanh toán
                </p>
                <p className="text-gray-500 text-sm mb-4">
                  Hỗ trợ: JPG, PNG, GIF (tối đa 5MB)
                </p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="font-form"
                >
                  Chọn file
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-gray-600 text-sm font-medium">
                        {selectedFile.name.split('.').pop()?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm sm:text-base">{selectedFile.name}</p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={removeFile}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-gray-600 self-end sm:self-center"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="w-full font-form"
                >
                  {isUploading ? 'Đang tải lên...' : 'Tải lên xác nhận thanh toán'}
                </Button>
              </div>
            )}
          </div>

          {/* Upload Status */}
          {uploadStatus !== 'idle' && (
            <div className={`mt-4 p-4 rounded-lg flex items-center space-x-3 ${
              uploadStatus === 'success' 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              {uploadStatus === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              <p className={`text-sm ${
                uploadStatus === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {uploadMessage}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Message to Organizing Committee */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Lời nhắn cho Ban Tổ Chức</h2>
        <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-300">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Nhập lời nhắn của bạn cho Ban Tổ Chức (không bắt buộc)..."
            className="w-full min-h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
            rows={4}
          />
          <p className="text-sm text-gray-500 mt-2">
            Bạn có thể gửi lời nhắn, câu hỏi hoặc yêu cầu đặc biệt cho Ban Tổ Chức tại đây.
          </p>
        </div>
      </div>

      {/* Error Message */}
      {saveError && (
        <div className="mb-4 p-4 rounded-lg border-l-4 bg-red-50 border-red-400 text-red-800">
          <p className="font-semibold">{saveError}</p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between">
        <Button variant="outline" className="font-form order-2 sm:order-1" onClick={() => {
            setStep(3);
            router.push("/donation");
        }} disabled={isSaving}>
          Quay lại
        </Button>
        <Button
          className="font-form bg-green-600 hover:bg-green-700 order-1 sm:order-2"
          disabled={!canProceed || isSaving}
          onClick={handleCompleteRegistration}
        >
          {isSaving ? "Đang lưu..." : "Hoàn thành đăng ký"}
        </Button>
      </div>
    </div>
  );
} 