"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { format } from "date-fns";
import {
  Search,
  RefreshCw,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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

interface Attendee {
  id: number;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone_number: string;
  class: string;
  occupation: string | null;
  employer: string | null;
  address: string | null;
  country: string | null;
  message: string | null;
  checked_in: boolean;
  invite_sent: boolean;
  qr_code_url: string | null;
}

interface AttendeesResponse {
  data: Attendee[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function AttendeesPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [checkedInFilter, setCheckedInFilter] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to first page on search
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch attendees
  const { data, isLoading, refetch } = useQuery<AttendeesResponse>({
    queryKey: [
      "attendees",
      page,
      limit,
      debouncedSearch,
      classFilter,
      checkedInFilter,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(classFilter && { class: classFilter }),
        ...(checkedInFilter && { checkedIn: checkedInFilter }),
      });

      const response = await fetch(`/api/admin/attendees?${params}`);
      if (!response.ok) throw new Error("Failed to fetch attendees");
      return response.json();
    },
  });

  // Toggle invite sent status
  const toggleInviteSent = async (attendeeId: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/attendees/${attendeeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ invite_sent: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update invite status');
      }

      await refetch();
    } catch (error) {
      console.error('Error updating invite status:', error);
      alert('Không thể cập nhật trạng thái gửi thư mời. Vui lòng thử lại.');
    }
  };

  // Define columns
  const columns: ColumnDef<Attendee>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <div className="w-16">{row.original.id}</div>,
    },
    {
      accessorKey: "full_name",
      header: "Họ và tên",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.full_name}</div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">{row.original.email}</div>
      ),
    },
    {
      accessorKey: "phone_number",
      header: "Số điện thoại",
      cell: ({ row }) => (
        <div className="text-sm">{row.original.phone_number}</div>
      ),
    },
    {
      accessorKey: "class",
      header: "Lớp",
      cell: ({ row }) => (
        <Badge variant="secondary">{row.original.class}</Badge>
      ),
    },
    {
      accessorKey: "occupation",
      header: "Nghề nghiệp",
      cell: ({ row }) => (
        <div className="text-sm">{row.original.occupation || '-'}</div>
      ),
    },
    {
      accessorKey: "employer",
      header: "Nơi làm việc",
      cell: ({ row }) => (
        <div className="text-sm">{row.original.employer || '-'}</div>
      ),
    },
    {
      accessorKey: "address",
      header: "Địa chỉ",
      cell: ({ row }) => (
        <div className="text-sm max-w-xs truncate" title={row.original.address || ''}>
          {row.original.address || '-'}
        </div>
      ),
    },
    {
      accessorKey: "country",
      header: "Quốc gia",
      cell: ({ row }) => (
        <div className="text-sm">{row.original.country || '-'}</div>
      ),
    },
    {
      accessorKey: "message",
      header: "Lời nhắn",
      cell: ({ row }) => (
        <div className="text-sm max-w-xs truncate" title={row.original.message || ''}>
          {row.original.message || '-'}
        </div>
      ),
    },
    {
      accessorKey: "checked_in",
      header: "Check-in",
      cell: ({ row }) => (
        <Badge variant={row.original.checked_in ? "success" : "outline"}>
          {row.original.checked_in ? "Đã check-in" : "Chưa check-in"}
        </Badge>
      ),
    },
    {
      accessorKey: "invite_sent",
      header: "Thư mời",
      cell: ({ row }) => (
        <button
          onClick={() => toggleInviteSent(row.original.id, row.original.invite_sent)}
          className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          style={{
            backgroundColor: row.original.invite_sent ? '#16a34a' : '#d1d5db'
          }}
          title={row.original.invite_sent ? 'Đã gửi' : 'Chưa gửi'}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              row.original.invite_sent ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      ),
    },
    {
      accessorKey: "qr_code_url",
      header: "QR Code",
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.qr_code_url ? (
            <a
              href={row.original.qr_code_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Xem
            </a>
          ) : (
            '-'
          )}
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Ngày đăng ký",
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">
          {format(new Date(row.original.created_at), "dd/MM/yyyy HH:mm")}
        </div>
      ),
    },
    {
      accessorKey: "updated_at",
      header: "Cập nhật",
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">
          {format(new Date(row.original.updated_at), "dd/MM/yyyy HH:mm")}
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleExport = async () => {
    const params = new URLSearchParams({
      ...(debouncedSearch && { search: debouncedSearch }),
      ...(classFilter && { class: classFilter }),
      ...(checkedInFilter && { checkedIn: checkedInFilter }),
    });

    const response = await fetch(`/api/admin/download/attendees?${params}`);
    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `attendees-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Quản lý Attendees
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Tổng số: {data?.pagination.total || 0} attendees
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Làm mới
            </Button>
            <Button onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Tải CSV
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm tên, email, SĐT..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={classFilter}
              onChange={(e) => {
                setClassFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Tất cả các lớp</option>
              <option value="12A1">12A1</option>
              <option value="12A2">12A2</option>
              <option value="12A3">12A3</option>
              <option value="12A4">12A4</option>
              <option value="12A5">12A5</option>
              <option value="12A6">12A6</option>
              <option value="12A7">12A7</option>
              <option value="12A8">12A8</option>
              <option value="12B1">12B1</option>
              <option value="12B2">12B2</option>
              <option value="12B3">12B3</option>
              <option value="12B4">12B4</option>
              <option value="12B5">12B5</option>
              <option value="12C">12C</option>
              <option value="12CA">12CA</option>
              <option value="12CH">12CH</option>
            </Select>
            <Select
              value={checkedInFilter}
              onChange={(e) => {
                setCheckedInFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="true">Đã check-in</option>
              <option value="false">Chưa check-in</option>
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
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      <div className="flex items-center justify-center">
                        <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
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
              Hiển thị{" "}
              {data?.pagination
                ? `${(page - 1) * limit + 1} - ${Math.min(
                    page * limit,
                    data.pagination.total
                  )}`
                : "0"}{" "}
              trong tổng số {data?.pagination.total || 0}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1 || isLoading}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center px-3 text-sm font-medium">
                Trang {page} / {data?.pagination.totalPages || 1}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={
                  page === data?.pagination.totalPages || isLoading || !data
                }
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
