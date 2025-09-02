"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckInService } from "@/services/database/checkin";
import type { AttendeeSummary, CheckInStats } from "@/types/common";
import QRScanner from "@/components/QRScanner";

export default function CheckInPage() {
  const [qrData, setQrData] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [checkedInAttendees, setCheckedInAttendees] = useState<AttendeeSummary[]>([]);
  const [stats, setStats] = useState<CheckInStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    loadCheckedInAttendees();
    loadStats();
  }, []);

  const loadCheckedInAttendees = async () => {
    const result = await CheckInService.getCheckedInAttendees();
    if (result.success) {
      setCheckedInAttendees(result.data || []);
    }
  };

  const loadStats = async () => {
    setIsLoadingStats(true);
    const result = await CheckInService.getCheckInStats();
    if (result.success && result.data) {
      setStats(result.data);
    }
    setIsLoadingStats(false);
  };

  const handleCheckIn = async (data: string) => {
    if (!data.trim()) {
      setMessage({ type: 'error', text: 'Vui lòng nhập dữ liệu QR' });
      return;
    }

    setIsProcessing(true);
    setMessage(null);

    try {
      const result = await CheckInService.checkInAttendee(data);
      
      if (result.success) {
        setMessage({ 
          type: 'success', 
          text: 'Check-in thành công!' 
        });
        setQrData("");
        setShowScanner(false);
        // Reload data
        await loadCheckedInAttendees();
        await loadStats();
      } else {
        setMessage({ 
          type: 'error', 
          text: `Check-in thất bại: ${result.error}` 
        });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: `Lỗi không xác định trong quá trình check-in: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQRScan = (data: string) => {
    setQrData(data);
    handleCheckIn(data);
  };

  const handleScannerError = (error: string) => {
    setMessage({ type: 'error', text: error });
  };

  const clearMessage = () => setMessage(null);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">Hệ thống Check-in</h1>
      
      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-blue-100 p-3 sm:p-4 rounded-lg text-center">
          <div className="text-xl sm:text-2xl font-bold text-blue-800">
            {isLoadingStats ? '...' : stats?.totalAttendees || 0}
          </div>
          <div className="text-xs sm:text-sm text-blue-600">Tổng đăng ký</div>
        </div>
        <div className="bg-green-100 p-3 sm:p-4 rounded-lg text-center">
          <div className="text-xl sm:text-2xl font-bold text-green-800">
            {isLoadingStats ? '...' : stats?.totalCheckedIn || 0}
          </div>
          <div className="text-xs sm:text-sm text-green-600">Đã check-in</div>
        </div>
        <div className="bg-purple-100 p-3 sm:p-4 rounded-lg text-center">
          <div className="text-xl sm:text-2xl font-bold text-purple-800">
            {isLoadingStats ? '...' : `${stats?.checkInRate || 0}%`}
          </div>
          <div className="text-xs sm:text-sm text-purple-600">Tỷ lệ check-in</div>
        </div>
      </div>

      {/* Check-in Methods */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Check-in Attendee</h2>
        
        {/* Test QR Code Display */}
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">🧪 Test QR Code</h3>
          <div className="text-xs text-gray-600 mb-2">
            Use this sample data to test the check-in system:
          </div>
          <div className="bg-white p-2 rounded border font-mono text-xs break-all">
            {JSON.stringify({
              em: "test@example.com",
              ph: "123456789",
              fn: "Test",
              ln: "User",
              oc: "Developer",
              emr: "Test Company",
              ac: true
            })}
          </div>
        </div>
        
        {/* Method Selection */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <Button 
            onClick={() => setShowScanner(true)}
            variant={showScanner ? "default" : "outline"}
            className="flex-1 text-sm sm:text-base"
          >
            📱 Camera Scanner
          </Button>
          <Button 
            onClick={() => setShowScanner(false)}
            variant={!showScanner ? "default" : "outline"}
            className="flex-1 text-sm sm:text-base"
          >
            ⌨️ Manual Input
          </Button>
        </div>

        {/* QR Scanner */}
        {showScanner && (
          <div className="mb-4">
            <QRScanner 
              onScan={handleQRScan}
              onError={handleScannerError}
            />
          </div>
        )}

        {/* Manual Input */}
        {!showScanner && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Input
                type="text"
                placeholder="Nhập dữ liệu QR hoặc email"
                value={qrData}
                onChange={(e) => setQrData(e.target.value)}
                className="flex-1 text-sm sm:text-base"
                onKeyPress={(e) => e.key === 'Enter' && handleCheckIn(qrData)}
              />
              <Button 
                onClick={() => handleCheckIn(qrData)}
                disabled={isProcessing || !qrData.trim()}
                className="px-6 sm:px-8 text-sm sm:text-base"
              >
                {isProcessing ? 'Đang xử lý...' : 'Check-in'}
              </Button>
            </div>
            
            <p className="text-sm text-gray-600">
              Nhập dữ liệu QR code hoặc email của attendee để check-in
            </p>
          </div>
        )}
      </div>

      {/* Message Display */}
      {message && (
        <div className={`p-4 rounded-lg mb-6 ${
          message.type === 'success' 
            ? 'bg-green-100 border border-green-400 text-green-800' 
            : message.type === 'error'
            ? 'bg-red-100 border border-red-400 text-red-800'
            : 'bg-blue-100 border border-blue-400 text-blue-800'
        }`}>
          <div className="flex justify-between items-center">
            <span>{message.text}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearMessage}
              className="text-gray-600 hover:text-gray-800"
            >
              ✕
            </Button>
          </div>
        </div>
      )}

      {/* Checked-in Attendees */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Danh sách đã check-in</h2>
        
        {checkedInAttendees.length === 0 ? (
          <p className="text-gray-500 text-center py-6 sm:py-8">Chưa có ai check-in</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm sm:text-base">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 text-xs sm:text-sm">Tên</th>
                  <th className="text-left p-2 text-xs sm:text-sm hidden sm:table-cell">Email</th>
                  <th className="text-left p-2 text-xs sm:text-sm hidden lg:table-cell">Thời gian check-in</th>
                  <th className="text-left p-2 text-xs sm:text-sm hidden md:table-cell">Phương thức</th>
                  <th className="text-left p-2 text-xs sm:text-sm hidden lg:table-cell">Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {checkedInAttendees.map((attendee) => (
                  <tr key={attendee.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{attendee.first_name} {attendee.last_name}</td>
                    <td className="p-2 hidden sm:table-cell">{attendee.email}</td>
                    <td className="p-2 hidden lg:table-cell">
                      {attendee.check_in_time ? new Date(attendee.check_in_time).toLocaleString('vi-VN') : '-'}
                    </td>
                    <td className="p-2 hidden md:table-cell">{attendee.check_in_method || '-'}</td>
                    <td className="p-2 text-xs sm:text-sm text-gray-600 hidden lg:table-cell">
                      {attendee.check_in_notes || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
