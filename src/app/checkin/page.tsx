"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckInService } from "@/services/database/checkin";
import type { CheckInStats } from "@/types/common";
import QRScanner from "@/components/QRScanner";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/services/database/supabase";

export default function CheckInPage() {
  const [qrData, setQrData] = useState("");
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [stats, setStats] = useState<CheckInStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  // Subscribe to realtime changes on Attendees table
  useEffect(() => {
    const channel = supabase
      .channel('checkin-realtime')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'Attendees',
        },
        (payload) => {
          console.log('Realtime update received:', payload);
          // Reload stats when changes occur
          loadStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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

    setMessage(null);

    try {
      const result = await CheckInService.checkInAttendee(data);

      if (result.success) {
        const successMessage = result.data?.fullName && result.data?.email
          ? `${result.data.fullName}\n${result.data.email}\nđã được check-in thành công!`
          : 'Check-in thành công!';
        setMessage({
          type: 'success',
          text: successMessage
        });
        setQrData("");
        // Reload data
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
    }
  };

  const handleQRScan = async (data: string): Promise<{ success: boolean; message: string }> => {
    if (!data.trim()) {
      return { success: false, message: 'Dữ liệu QR không hợp lệ' };
    }

    try {
      const result = await CheckInService.checkInAttendee(data);

      if (result.success) {
        // Reload stats after successful check-in
        await loadStats();
        return {
          success: true,
          message: result.data?.fullName && result.data?.email
            ? `${result.data.fullName}\n${result.data.email}\nđã được check-in thành công!`
            : 'Check-in thành công!'
        };
      } else {
        return {
          success: false,
          message: result.error || 'Check-in thất bại'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  };

  const handleScannerError = (error: string) => {
    setMessage({ type: 'error', text: error });
  };

  const clearMessage = () => setMessage(null);

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Hệ thống Check-in</h1>

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

          {/* QR Scanner */}
          <div className="mb-4">
            <QRScanner
              onScan={handleQRScan}
              onError={handleScannerError}
            />
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">hoặc</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Manual Email Input */}
          <div className="space-y-4">
            <h3 className="text-md font-semibold">Check-in bằng Email</h3>

            {/* Message Display for manual check-in */}
            {message && (
              <div className={`p-4 rounded-lg ${
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
                    className="text-gray-600 hover:text-gray-800 touch-manipulation p-2"
                  >
                    ✕
                  </Button>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Input
                type="email"
                placeholder="Nhập địa chỉ email bạn dùng đăng ký cho buổi họp mặt"
                value={qrData}
                onChange={(e) => setQrData(e.target.value)}
                className="flex-1 text-sm sm:text-base py-3"
                onKeyPress={(e) => e.key === 'Enter' && handleCheckIn(qrData)}
                autoComplete="email"
                inputMode="email"
              />
              <Button
                onClick={() => handleCheckIn(qrData)}
                disabled={!qrData.trim()}
                className="px-6 sm:px-8 text-sm sm:text-base py-3 touch-manipulation"
              >
                Check-in
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
