"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Search, RefreshCw, Download, Eye, X } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Dialog } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Payment {
  id: number;
  created_at: string;
  amount: number;
  url_confirmation: string;
  id_attendee: number;
  confirmed: boolean;
  Attendees: {
    full_name: string;
    email: string;
  };
  Order: {
    amount: number;
  } | null;
  Donation: {
    amount: number;
  } | null;
}

export default function PaymentsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [search, setSearch] = useState("");
  const [selectedProof, setSelectedProof] = useState<string | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["payments", page, limit, search],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
      });

      const response = await fetch(`/api/admin/payments?${params}`);
      if (!response.ok) throw new Error("Failed to fetch payments");
      return response.json();
    },
  });

  const formatVND = (amount: number) => {
    return amount.toLocaleString("vi-VN") + " VND";
  };

  const handleExportCSV = async () => {
    try {
      const params = new URLSearchParams({
        ...(search && { search }),
        format: "csv",
      });

      const response = await fetch(`/api/admin/payments?${params}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `payments-${new Date().toISOString()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to export CSV:", error);
    }
  };

  const toggleConfirmedStatus = async (paymentId: number, currentStatus: boolean) => {
    try {
      console.log('Toggling payment', paymentId, 'from', currentStatus, 'to', !currentStatus);

      const response = await fetch(`/api/admin/payments/${paymentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ confirmed: !currentStatus }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('API error:', errorData);
        throw new Error('Failed to update payment status');
      }

      const result = await response.json();
      console.log('Update successful:', result);

      // Refetch data to update the UI
      await refetch();
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Failed to update payment status: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý Payments</h1>
            <p className="text-sm text-gray-600 mt-1">
              Tổng số: {data?.pagination.total || 0} payments
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

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div></div>
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
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Attendee</TableHead>
                  <TableHead className="text-right">Total Amount</TableHead>
                  <TableHead className="text-right">Order Amount</TableHead>
                  <TableHead className="text-right">Donation Amount</TableHead>
                  <TableHead>Payment Date</TableHead>
                  <TableHead>Confirmed</TableHead>
                  <TableHead>Proof</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      <RefreshCw className="w-6 h-6 animate-spin text-gray-400 mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : data?.data && data.data.length > 0 ? (
                  data.data.map((payment: Payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-mono text-sm">#{payment.id}</TableCell>
                      <TableCell>
                        <div className="font-medium">{payment.Attendees.full_name}</div>
                        <div className="text-xs text-gray-500">{payment.Attendees.email}</div>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatVND(payment.amount)}
                      </TableCell>
                      <TableCell className="text-right text-sm text-gray-600">
                        {formatVND(payment.Order?.amount || 0)}
                      </TableCell>
                      <TableCell className="text-right text-sm text-gray-600">
                        {formatVND(payment.Donation?.amount || 0)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {format(new Date(payment.created_at), "dd/MM/yyyy HH:mm")}
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => toggleConfirmedStatus(payment.id, payment.confirmed)}
                          className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                          style={{
                            backgroundColor: payment.confirmed ? '#16a34a' : '#d1d5db'
                          }}
                          title={payment.confirmed ? 'Confirmed' : 'Not Confirmed'}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              payment.confirmed ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedProof(payment.url_confirmation)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Xem
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
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

      {/* Payment Proof Modal */}
      {selectedProof && (
        <Dialog open={!!selectedProof} onOpenChange={(open) => !open && setSelectedProof(null)}>
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto relative">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Payment Proof</h3>
                <button
                  onClick={() => setSelectedProof(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-4">
                <img
                  src={selectedProof}
                  alt="Payment Proof"
                  className="w-full h-auto rounded-lg"
                  loading="lazy"
                />
              </div>
              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedProof(null)}>
                  Đóng
                </Button>
                <a
                  href={selectedProof}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Tải xuống
                </a>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </AdminLayout>
  );
}
