import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Type definitions for the database query results
interface Merchandise {
  name: string;
  price: number;
  gender: string;
  size: string;
}

interface MerchOrder {
  quantity: number;
  Merchandise: Merchandise;
}

interface Attendee {
  first_name: string;
  last_name: string;
  email: string;
}

interface Order {
  id: number;
  created_at: string;
  Attendees: Attendee;
  Merch_Order: MerchOrder[];
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // Fetch orders with attendee and merchandise details
    const { data: orders, error: ordersError } = await supabase
      .from('Order')
      .select(`
        *,
        Attendees!inner (
          first_name,
          last_name,
          email
        ),
        Merch_Order!inner (
          quantity,
          Merchandise!inner (
            name,
            price,
            gender,
            size
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (ordersError) {
      console.error('Error fetching orders:', ordersError);
      return NextResponse.json(
        { error: 'Failed to fetch orders data' },
        { status: 500 }
      );
    }

    // Convert to CSV format
    const headers = ['ID Đơn hàng', 'Tên Attendee', 'Email', 'Sản phẩm', 'Số lượng', 'Giá (VND)', 'Giới tính', 'Kích thước', 'Ngày đặt hàng'];
    const csvRows = [headers.join(',')];

    orders?.forEach((order: Order) => {
      order.Merch_Order?.forEach((merchOrder: MerchOrder) => {
        const row = [
          order.id,
          `"${order.Attendees?.first_name || ''} ${order.Attendees?.last_name || ''}"`,
          `"${order.Attendees?.email || ''}"`,
          `"${merchOrder.Merchandise?.name || ''}"`,
          merchOrder.quantity,
          merchOrder.Merchandise?.price || '',
          merchOrder.Merchandise?.gender || '',
          merchOrder.Merchandise?.size || '',
          new Date(order.created_at).toLocaleString('vi-VN')
        ];
        csvRows.push(row.join(','));
      });
    });

    const csvContent = csvRows.join('\n');
    const csvBuffer = Buffer.from(csvContent, 'utf-8');

    return new NextResponse(csvBuffer, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="orders-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error in orders download API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
