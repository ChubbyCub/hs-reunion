import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse query parameters
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const format = searchParams.get('format');

    // Fetch orders with attendee info
    let query = supabase
      .from('Order')
      .select(`
        id,
        created_at,
        updated_at,
        id_attendee,
        order_status,
        amount,
        Attendees!Order_id_attendee_fkey (
          full_name,
          email
        )
      `, { count: 'exact' });

    // Apply status filter
    if (status) {
      query = query.eq('order_status', status);
    }

    // Apply search filter (search attendee name or email)
    // Note: This is a limitation - can't easily search across joined tables with .or()
    // For now, we'll fetch and filter client-side if search is provided

    // Apply sorting
    query = query.order('created_at', { ascending: false });

    // For CSV export, get all data without pagination
    if (format !== 'csv') {
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);
    }

    // Execute query
    const { data: orders, error, count } = await query;

    if (error) {
      console.error('Error fetching orders:', error);
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      );
    }

    // For each order, fetch merchandise items
    const ordersWithMerchandise = await Promise.all(
      (orders || []).map(async (order) => {
        const { data: merchOrders } = await supabase
          .from('Merch_Order')
          .select(`
            quantity,
            Merchandise!Merch_Order_id_merch_fkey (
              id,
              name,
              price,
              gender,
              size
            )
          `)
          .eq('id_order', order.id);

        return {
          ...order,
          merchandise_items: merchOrders || [],
        };
      })
    );

    // Apply search filter if needed (client-side)
    let filteredOrders = ordersWithMerchandise;
    if (search) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      filteredOrders = ordersWithMerchandise.filter((order: any) =>
        order.Attendees?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        order.Attendees?.email?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Return CSV format if requested
    if (format === 'csv') {
      const csvHeaders = [
        'Order ID',
        'Attendee Name',
        'Email',
        'Status',
        'Amount (VND)',
        'Order Date',
        'Merchandise Items',
      ];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const csvRows = filteredOrders.map((order: any) => {
        // Format merchandise items as a single string
        const merchItems = order.merchandise_items
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((item: any) => {
            const details = item.Merchandise.gender && item.Merchandise.size
              ? ` (${item.Merchandise.gender} - ${item.Merchandise.size})`
              : '';
            return `${item.Merchandise.name}${details} x${item.quantity}`;
          })
          .join('; ');

        return [
          order.id,
          order.Attendees?.full_name || '',
          order.Attendees?.email || '',
          order.order_status || 'pending',
          order.amount,
          new Date(order.created_at).toLocaleString('vi-VN'),
          merchItems,
        ];
      });

      const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map(row => row.map(cell => `"${cell}"`).join(',')),
      ].join('\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename=orders.csv',
        },
      });
    }

    // Calculate pagination metadata
    const totalPages = count ? Math.ceil(count / limit) : 0;

    return NextResponse.json({
      data: filteredOrders,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error in orders API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
