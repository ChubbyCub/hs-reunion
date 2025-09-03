"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Download, Calendar, User, DollarSign, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface PaymentProof {
  id: number;
  created_at: string;
  updated_at: string;
  id_attendee: number;
  url_confirmation: string;
  id_order: number | null;
  Attendees: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
  };
  Order?: {
    id: number;
    id_attendee: number;
    order_status: string;
  } | null;
}

export default function PaymentProofsPage() {
  const [paymentProofs, setPaymentProofs] = useState<PaymentProof[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPaymentProofs();
  }, []);

  const fetchPaymentProofs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/payment-proofs');
      const result = await response.json();

      if (result.success) {
        setPaymentProofs(result.data);
      } else {
        setError(result.error || 'Failed to fetch payment proofs');
      }
    } catch (error) {
      setError('Failed to fetch payment proofs');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (order: PaymentProof['Order']) => {
    if (!order) return <Clock className="h-4 w-4 text-yellow-600" />;
    
    switch (order.order_status) {
      case 'payment_confirmed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'payment_pending_review':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusText = (order: PaymentProof['Order']) => {
    if (!order) return 'Chưa có đơn hàng';
    
    switch (order.order_status) {
      case 'payment_confirmed':
        return 'Đã xác nhận';
      case 'payment_pending_review':
        return 'Chờ xác nhận';
      default:
        return 'Không xác định';
    }
  };

  const getStatusColor = (order: PaymentProof['Order']) => {
    if (!order) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    
    switch (order.order_status) {
      case 'payment_confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'payment_pending_review':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };



  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-800 mb-2">Có lỗi xảy ra</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchPaymentProofs} variant="outline">
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Xác nhận thanh toán</h1>
          <p className="text-gray-600 mt-2">
            Quản lý và xem xét các xác nhận thanh toán từ người tham gia
          </p>
        </div>
        <Link href="/admin/dashboard">
          <Button variant="outline">
            Quay lại Dashboard
          </Button>
        </Link>
      </div>

      {paymentProofs.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có xác nhận thanh toán nào</h3>
          <p className="text-gray-500">Khi người tham gia tải lên xác nhận thanh toán, chúng sẽ xuất hiện ở đây.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paymentProofs.map((proof) => (
            <Card key={proof.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {proof.Attendees.first_name} {proof.Attendees.last_name}
                  </CardTitle>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(proof.Order)}`}>
                    {getStatusIcon(proof.Order)}
                    <span className="ml-1">{getStatusText(proof.Order)}</span>
                  </span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                                 {/* Payment Proof Image */}
                 <div className="relative group">
                   <Image
                     src={proof.url_confirmation}
                     alt={`Payment proof for ${proof.Attendees.first_name} ${proof.Attendees.last_name}`}
                     width={400}
                     height={192}
                     className="w-full h-48 object-cover rounded-lg border border-gray-200 group-hover:border-blue-300 transition-colors"
                   />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-2">
                                             <Button
                         size="sm"
                         variant="secondary"
                         onClick={() => window.open(proof.url_confirmation, '_blank')}
                         className="bg-white text-gray-900 hover:bg-gray-100"
                       >
                         <Eye className="h-4 w-4 mr-1" />
                         Xem
                       </Button>
                       <Button
                         size="sm"
                         variant="secondary"
                         onClick={() => {
                           const link = document.createElement('a');
                           link.href = proof.url_confirmation;
                           link.download = `payment-proof-${proof.Attendees.first_name}-${proof.Attendees.last_name}.jpg`;
                           link.click();
                         }}
                         className="bg-white text-gray-900 hover:bg-gray-100"
                       >
                         <Download className="h-4 w-4 mr-1" />
                         Tải
                       </Button>
                    </div>
                  </div>
                </div>

                                 {/* Attendee Info */}
                 <div className="space-y-2">
                   <div className="flex items-center text-sm text-gray-600">
                     <User className="h-4 w-4 mr-2" />
                     <span>{proof.Attendees.email}</span>
                   </div>
                   <div className="flex items-center text-sm text-gray-600">
                     <User className="h-4 w-4 mr-2" />
                     <span>{proof.Attendees.phone_number}</span>
                   </div>
                   <div className="flex items-center text-sm text-gray-600">
                     <DollarSign className="h-4 w-4 mr-2" />
                     <span className="font-medium">Order #{proof.Order?.id || 'N/A'}</span>
                   </div>
                 </div>

                                 {/* Upload Info */}
                 <div className="space-y-2 pt-2 border-t border-gray-100">
                                      <div className="flex items-center text-xs text-gray-500">
                     <Calendar className="h-3 w-3 mr-1" />
                     <span>Tải lên: {formatDate(proof.created_at)}</span>
                   </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      // TODO: Implement status update functionality

                    }}
                  >
                    Cập nhật trạng thái
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
