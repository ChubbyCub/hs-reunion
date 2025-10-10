"use client";
import { useQuery } from "@tanstack/react-query";
import { Users, ShoppingCart, DollarSign } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";

export default function AdminDashboard() {
  // Fetch total attendees
  const { data: attendeesData } = useQuery({
    queryKey: ["dashboard-attendees"],
    queryFn: async () => {
      const response = await fetch("/api/admin/attendees?limit=1");
      if (!response.ok) throw new Error("Failed to fetch attendees");
      return response.json();
    },
  });

  // Fetch total orders
  const { data: ordersData } = useQuery({
    queryKey: ["dashboard-orders"],
    queryFn: async () => {
      const response = await fetch("/api/admin/orders?limit=1000");
      if (!response.ok) throw new Error("Failed to fetch orders");
      return response.json();
    },
  });

  // Fetch total donations
  const { data: donationsData } = useQuery({
    queryKey: ["dashboard-donations"],
    queryFn: async () => {
      const response = await fetch("/api/admin/donations?limit=1000");
      if (!response.ok) throw new Error("Failed to fetch donations");
      return response.json();
    },
  });

  const totalAttendees = attendeesData?.pagination?.total || 0;
  const totalOrderAmount = ordersData?.data?.reduce((sum: number, order: { amount: number }) => sum + order.amount, 0) || 0;
  const totalDonationAmount = donationsData?.data?.reduce((sum: number, donation: { amount: number }) => sum + donation.amount, 0) || 0;

  const formatVND = (amount: number) => {
    return amount.toLocaleString("vi-VN") + " VND";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Bảng điều khiển quản trị</h1>
          <p className="text-base text-gray-600">Tổng quan về sự kiện và thống kê tài chính</p>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Attendees */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tổng số Attendees</p>
                <p className="text-3xl font-bold text-gray-900">{totalAttendees}</p>
              </div>
              <div className="bg-blue-100 p-4 rounded-lg">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Total Order Amount */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tổng tiền Orders</p>
                <p className="text-2xl font-bold text-gray-900">{formatVND(totalOrderAmount)}</p>
              </div>
              <div className="bg-purple-100 p-4 rounded-lg">
                <ShoppingCart className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Total Donation Amount */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tổng tiền Donations</p>
                <p className="text-2xl font-bold text-gray-900">{formatVND(totalDonationAmount)}</p>
              </div>
              <div className="bg-green-100 p-4 rounded-lg">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Total Revenue Card */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg shadow-md text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Tổng doanh thu</p>
              <p className="text-4xl font-bold">{formatVND(totalOrderAmount + totalDonationAmount)}</p>
              <p className="text-sm opacity-75 mt-2">Orders + Donations</p>
            </div>
            <div className="bg-white/20 p-4 rounded-lg">
              <DollarSign className="w-12 h-12" />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 