"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckInService, AttendeeSummary, CheckInStats } from "@/lib/checkin";

export default function CheckInPage() {
  const [qrData, setQrData] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [checkedInAttendees, setCheckedInAttendees] = useState<AttendeeSummary[]>([]);
  const [stats, setStats] = useState<CheckInStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

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

  const handleCheckIn = async () => {
    if (!qrData.trim()) {
      setMessage({ type: 'error', text: 'Vui lòng nhập dữ liệu QR' });
      return;
    }

    setIsProcessing(true);
    setMessage(null);

    try {
      const result = await CheckInService.checkInAttendee(qrData);
      
      if (result.success) {
        setMessage({ 
          type: 'success', 
          text: 'Check-in thành công!' 
        });
        setQrData("");
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
        text: 'Lỗi không xác định trong quá trình check-in' 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const clearMessage = () => setMessage(null);

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Hệ thống Check-in</h1>
      
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-100 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-800">
            {isLoadingStats ? '...' : stats?.totalAttendees || 0}
          </div>
          <div className="text-sm text-blue-600">Tổng đăng ký</div>
        </div>
        <div className="bg-green-100 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-800">
            {isLoadingStats ? '...' : stats?.totalCheckedIn || 0}
          </div>
          <div className="text-sm text-green-600">Đã check-in</div>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-800">
            {isLoadingStats ? '...' : `${stats?.checkInRate || 0}%`}
          </div>
          <div className="text-sm text-purple-600">Tỷ lệ check-in</div>
        </div>
      </div>

      {/* Check-in Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Check-in Attendee</h2>
        
        <div className="flex gap-4 mb-4">
          <Input
            type="text"
            placeholder="Nhập dữ liệu QR hoặc email"
            value={qrData}
            onChange={(e) => setQrData(e.target.value)}
            className="flex-1"
            onKeyPress={(e) => e.key === 'Enter' && handleCheckIn()}
          />
          <Button 
            onClick={handleCheckIn}
            disabled={isProcessing || !qrData.trim()}
            className="px-8"
          >
            {isProcessing ? 'Đang xử lý...' : 'Check-in'}
          </Button>
        </div>
        
        <p className="text-sm text-gray-600">
          Nhập dữ liệu QR code hoặc email của attendee để check-in
        </p>
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
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Danh sách đã check-in</h2>
        
        {checkedInAttendees.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Chưa có ai check-in</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Tên</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Thời gian check-in</th>
                  <th className="text-left p-2">Phương thức</th>
                  <th className="text-left p-2">Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {checkedInAttendees.map((attendee) => (
                  <tr key={attendee.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{attendee.first_name} {attendee.last_name}</td>
                    <td className="p-2">{attendee.email}</td>
                    <td className="p-2">
                      {attendee.check_in_time ? new Date(attendee.check_in_time).toLocaleString('vi-VN') : '-'}
                    </td>
                    <td className="p-2">{attendee.check_in_method || '-'}</td>
                    <td className="p-2 text-sm text-gray-600">
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
