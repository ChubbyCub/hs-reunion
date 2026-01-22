"use client";

import { useState, useEffect, useRef } from "react";
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
  ChevronDown,
  Check,
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/services/database/supabase";

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
  attend_live_event: boolean;
  have_lunch: boolean;
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
  stats: {
    totalCheckedIn: number;
    totalLunch: number;
  };
}

const CLASS_OPTIONS = [
  "12A1", "12A2", "12A3", "12A4", "12A5", "12A6", "12A7", "12A8",
  "12B1", "12B2", "12B3", "12B4", "12B5",
  "12C", "12CA", "12CH", "12CL", "12CS", "12CT", "12CTC", "12CTIN",
  "12D1", "12D2", "12D3", "12D4", "12D5",
  "12NT", "12SN1", "12SN2"
];

export default function AttendeesPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [checkedInFilter, setCheckedInFilter] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [classDropdownOpen, setClassDropdownOpen] = useState(false);
  const [classSearchTerm, setClassSearchTerm] = useState("");
  const classDropdownRef = useRef<HTMLDivElement>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to first page on search
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (classDropdownRef.current && !classDropdownRef.current.contains(event.target as Node)) {
        setClassDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter class options based on search term
  const filteredClassOptions = CLASS_OPTIONS.filter(cls =>
    cls.toLowerCase().includes(classSearchTerm.toLowerCase())
  );

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

  // Toggle lunch status
  const toggleHaveLunch = async (attendeeId: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/attendees/${attendeeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ have_lunch: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update lunch status');
      }

      await refetch();
    } catch (error) {
      console.error('Error updating lunch status:', error);
      alert('Không thể cập nhật trạng thái ăn trưa. Vui lòng thử lại.');
    }
  };

  // Subscribe to realtime changes on Attendees table
  useEffect(() => {
    const channel = supabase
      .channel('attendees-realtime')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'Attendees',
        },
        (payload) => {
          console.log('Realtime update received:', payload);
          // Refetch data when changes occur
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

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
        <div className="text-sm max-w-[150px] truncate" title={row.original.employer || ''}>
          {row.original.employer || '-'}
        </div>
      ),
    },
    {
      accessorKey: "address",
      header: "Địa chỉ",
      cell: ({ row }) => (
        <div className="text-sm max-w-[150px] truncate" title={row.original.address || ''}>
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
      accessorKey: "checked_in",
      header: "Check-in",
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Check className={`w-5 h-5 ${row.original.checked_in ? 'text-green-600' : 'text-gray-300'}`} />
        </div>
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
      accessorKey: "attend_live_event",
      header: "Tham dự trực tiếp",
      cell: ({ row }) => (
        <Badge variant={row.original.attend_live_event ? "success" : "outline"}>
          {row.original.attend_live_event ? "Có" : "Không"}
        </Badge>
      ),
    },
    {
      accessorKey: "have_lunch",
      header: "Ăn trưa tại trường",
      cell: ({ row }) => (
        <button
          onClick={() => toggleHaveLunch(row.original.id, row.original.have_lunch)}
          className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          style={{
            backgroundColor: row.original.have_lunch ? '#16a34a' : '#d1d5db'
          }}
          title={row.original.have_lunch ? 'Có ăn trưa' : 'Không ăn trưa'}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              row.original.have_lunch ? 'translate-x-6' : 'translate-x-1'
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

        {/* Check-in Statistics */}
        <div className="bg-gradient-to-r from-green-50 to-orange-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Đã check-in</p>
                <p className="text-3xl font-bold text-green-600">{data?.stats?.totalCheckedIn || 0}</p>
              </div>
              <div className="h-12 w-px bg-gray-300"></div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Ăn trưa</p>
                <p className="text-3xl font-bold text-orange-600">{data?.stats?.totalLunch || 0}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Cập nhật trực tiếp</p>
              <div className="flex items-center gap-1 text-green-600 mt-1">
                <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium">Live</span>
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
                placeholder="Tìm kiếm tên, email, SĐT..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="relative" ref={classDropdownRef}>
              <button
                type="button"
                onClick={() => setClassDropdownOpen(!classDropdownOpen)}
                className="w-full px-3 py-2 text-left border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white flex items-center justify-between"
              >
                <span className={classFilter ? "text-gray-900" : "text-gray-500"}>
                  {classFilter || "Lọc theo lớp..."}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {classDropdownOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-hidden">
                  <div className="p-2 border-b border-gray-200">
                    <Input
                      placeholder="Tìm lớp..."
                      value={classSearchTerm}
                      onChange={(e) => setClassSearchTerm(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                    />
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    <button
                      onClick={() => {
                        setClassFilter("");
                        setClassSearchTerm("");
                        setClassDropdownOpen(false);
                        setPage(1);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-gray-100 text-gray-500"
                    >
                      Tất cả các lớp
                    </button>
                    {filteredClassOptions.map((cls) => (
                      <button
                        key={cls}
                        onClick={() => {
                          setClassFilter(cls);
                          setClassSearchTerm("");
                          setClassDropdownOpen(false);
                          setPage(1);
                        }}
                        className={`w-full px-3 py-2 text-left hover:bg-gray-100 ${
                          classFilter === cls ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-900"
                        }`}
                      >
                        {cls}
                      </button>
                    ))}
                    {filteredClassOptions.length === 0 && (
                      <div className="px-3 py-2 text-gray-500 text-sm">
                        Không tìm thấy lớp nào
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
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
          <div className="overflow-auto max-h-[calc(100vh-300px)]">
            <table className="w-full caption-bottom text-sm relative">
              <thead className="sticky top-0 z-10 bg-gray-50 shadow-sm">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border-b">
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="h-12 px-4 text-left align-middle font-medium text-muted-foreground bg-gray-50">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {isLoading ? (
                  <tr className="border-b transition-colors hover:bg-muted/50">
                    <td
                      colSpan={columns.length}
                      className="h-24 text-center p-4 align-middle"
                    >
                      <div className="flex items-center justify-center">
                        <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
                      </div>
                    </td>
                  </tr>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="border-b transition-colors hover:bg-muted/50">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="p-4 align-middle">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr className="border-b transition-colors hover:bg-muted/50">
                    <td
                      colSpan={columns.length}
                      className="h-24 text-center p-4 align-middle"
                    >
                      Không tìm thấy dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
