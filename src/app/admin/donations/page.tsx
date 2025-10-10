"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Search, RefreshCw, Download, DollarSign, Users, TrendingUp } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Donation {
  id: number;
  created_at: string;
  amount: number;
  Attendees: {
    full_name: string;
    email: string;
  };
}

export default function DonationsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [search, setSearch] = useState("");
  const [amountMin, setAmountMin] = useState("");
  const [amountMax, setAmountMax] = useState("");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["donations", page, limit, search, amountMin, amountMax],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(amountMin && { amountMin }),
        ...(amountMax && { amountMax }),
      });

      const response = await fetch(`/api/admin/donations?${params}`);
      if (!response.ok) throw new Error("Failed to fetch donations");
      return response.json();
    },
  });

  const formatVND = (amount: number) => {
    return amount.toLocaleString("vi-VN") + " VND";
  };

  // Calculate summary statistics
  const totalDonations = data?.data?.reduce((sum: number, d: Donation) => sum + d.amount, 0) || 0;
  const avgDonation = data?.data?.length > 0 ? totalDonations / data.data.length : 0;
  const donorCount = data?.data?.length || 0;

  const handleExportCSV = async () => {
    try {
      const params = new URLSearchParams({
        ...(search && { search }),
        ...(amountMin && { amountMin }),
        ...(amountMax && { amountMax }),
        format: "csv",
      });

      const response = await fetch(`/api/admin/donations?${params}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `donations-${new Date().toISOString()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to export CSV:", error);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý Donations</h1>
            <p className="text-sm text-gray-600 mt-1">
              Tổng số: {data?.pagination.total || 0} donations
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportCSV} disabled={isLoading}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => refetch()} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Làm mới
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng Donations</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatVND(totalDonations)}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Số lượng Donors</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{donorCount}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Trung bình Donation</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatVND(Math.round(avgDonation))}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm tên attendee..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9"
              />
            </div>
            <Input
              type="number"
              placeholder="Số tiền tối thiểu (VND)"
              value={amountMin}
              onChange={(e) => {
                setAmountMin(e.target.value);
                setPage(1);
              }}
            />
            <Input
              type="number"
              placeholder="Số tiền tối đa (VND)"
              value={amountMax}
              onChange={(e) => {
                setAmountMax(e.target.value);
                setPage(1);
              }}
            />
            <Select
              value={limit.toString()}
              onChange={(e) => {
                setLimit(parseInt(e.target.value));
                setPage(1);
              }}
            >
              <option value="25">25 / trang</option>
              <option value="50">50 / trang</option>
              <option value="100">100 / trang</option>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Donation ID</TableHead>
                  <TableHead>Attendee</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Donation Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      <RefreshCw className="w-6 h-6 animate-spin text-gray-400 mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : data?.data && data.data.length > 0 ? (
                  data.data.map((donation: Donation) => (
                    <TableRow key={donation.id}>
                      <TableCell className="font-mono text-sm">#{donation.id}</TableCell>
                      <TableCell>
                        <div className="font-medium">{donation.Attendees.full_name}</div>
                        <div className="text-xs text-gray-500">{donation.Attendees.email}</div>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatVND(donation.amount)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {format(new Date(donation.created_at), "dd/MM/yyyy HH:mm")}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      Không tìm thấy dữ liệu
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Hiển thị {data?.pagination ? `${(page - 1) * limit + 1} - ${Math.min(page * limit, data.pagination.total)}` : "0"} trong tổng số {data?.pagination.total || 0}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1 || isLoading}>
                Trước
              </Button>
              <div className="flex items-center px-3 text-sm font-medium">
                Trang {page} / {data?.pagination.totalPages || 1}
              </div>
              <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page === data?.pagination.totalPages || isLoading || !data}>
                Sau
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
