"use client";

import { useState, Fragment } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Search, RefreshCw, ChevronDown, ChevronUp, ChevronsUpDown, Download } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface MerchandiseItem {
  quantity: number;
  Merchandise: {
    id: number;
    name: string;
    price: number;
    gender: string | null;
    size: string | null;
  };
}

interface Order {
  id: number;
  created_at: string;
  amount: number;
  order_status: string;
  Attendees: {
    full_name: string;
    email: string;
  };
  merchandise_items: MerchandiseItem[];
}

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["orders", page, limit, search, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
      });

      const response = await fetch(`/api/admin/orders?${params}`);
      if (!response.ok) throw new Error("Failed to fetch orders");
      return response.json();
    },
  });

  const toggleRow = (orderId: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedRows(newExpanded);
  };

  const formatVND = (amount: number) => {
    return amount.toLocaleString("vi-VN") + " VND";
  };

  const getNextStatus = (currentStatus: string): string => {
    const statuses = ['pending', 'complete'];
    const currentIndex = statuses.indexOf(currentStatus || 'pending');
    const nextIndex = (currentIndex + 1) % statuses.length;
    return statuses[nextIndex];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
      case 'completed':
        return 'success';
      case 'pending':
      default:
        return 'secondary';
    }
  };

  const updateOrderStatus = async (orderId: number, currentStatus: string) => {
    const newStatus = getNextStatus(currentStatus);

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order_status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      // Refetch orders to update the UI
      await refetch();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại.');
    }
  };

  const handleExportCSV = async () => {
    try {
      const params = new URLSearchParams({
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
        format: "csv",
      });

      const response = await fetch(`/api/admin/orders?${params}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `orders-${new Date().toISOString()}.csv`;
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
            <h1 className="text-2xl font-bold text-gray-900">Quản lý Orders</h1>
            <p className="text-sm text-gray-600 mt-1">
              Tổng số: {data?.pagination.total || 0} orders
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
            <Select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="pending">Pending</option>
              <option value="complete">Complete</option>
            </Select>
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
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Attendee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Order Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <RefreshCw className="w-6 h-6 animate-spin text-gray-400 mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : data?.data && data.data.length > 0 ? (
                  data.data.map((order: Order) => (
                    <Fragment key={order.id}>
                      <TableRow className="cursor-pointer hover:bg-gray-50">
                        <TableCell onClick={() => toggleRow(order.id)}>
                          {expandedRows.has(order.id) ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </TableCell>
                        <TableCell className="font-mono text-sm">#{order.id}</TableCell>
                        <TableCell>
                          <div className="font-medium">{order.Attendees.full_name}</div>
                          <div className="text-xs text-gray-500">{order.Attendees.email}</div>
                        </TableCell>
                        <TableCell>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateOrderStatus(order.id, order.order_status);
                            }}
                            className="focus:outline-none"
                          >
                            <Badge
                              variant={getStatusColor(order.order_status || "pending")}
                              className="cursor-pointer hover:opacity-80 flex items-center gap-1"
                            >
                              {order.order_status || "pending"}
                              <ChevronsUpDown className="w-3 h-3" />
                            </Badge>
                          </button>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatVND(order.amount)}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {format(new Date(order.created_at), "dd/MM/yyyy HH:mm")}
                        </TableCell>
                      </TableRow>
                      {expandedRows.has(order.id) && (
                        <TableRow>
                          <TableCell colSpan={6} className="bg-gray-50 p-4">
                            <div className="space-y-2">
                              <h4 className="font-semibold text-sm mb-2">Merchandise Items:</h4>
                              <div className="border border-gray-300 rounded-md overflow-hidden">
                                <table className="w-full text-sm">
                                  <thead className="bg-gray-100">
                                    <tr>
                                      <th className="text-left px-3 py-2 font-semibold text-gray-700">Item</th>
                                      <th className="text-left px-3 py-2 font-semibold text-gray-700">Details</th>
                                      <th className="text-center px-3 py-2 font-semibold text-gray-700">Quantity</th>
                                      <th className="text-right px-3 py-2 font-semibold text-gray-700">Unit Price</th>
                                      <th className="text-right px-3 py-2 font-semibold text-gray-700">Total</th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {order.merchandise_items.map((item, idx) => {
                                      const itemTotal = item.Merchandise.price * item.quantity;

                                      return (
                                        <tr key={idx}>
                                          <td className="px-3 py-2">
                                            {item.Merchandise.name}
                                          </td>
                                          <td className="px-3 py-2 text-gray-600">
                                            {item.Merchandise.gender && item.Merchandise.size
                                              ? `${item.Merchandise.gender} - ${item.Merchandise.size}`
                                              : '-'}
                                          </td>
                                          <td className="px-3 py-2 text-center">{item.quantity}</td>
                                          <td className="px-3 py-2 text-right">{formatVND(item.Merchandise.price)}</td>
                                          <td className="px-3 py-2 text-right font-medium">{formatVND(itemTotal)}</td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
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
