import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // Fetch all Order table data with attendee information
    const { data: orders, error } = await supabase
      .from('Order')
      .select('*, Attendees(full_name, email, phone_number)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return NextResponse.json(
        { error: 'Failed to fetch orders data' },
        { status: 500 }
      );
    }

    // Convert to CSV format - raw table data with attendee info
    const headers = ['ID', 'Created At', 'Updated At', 'ID Attendee', 'Attendee Name', 'Attendee Email', 'Attendee Phone', 'Order Status'];
    const csvRows = [headers.join(',')];

    orders?.forEach(order => {
      const row = [
        order.id,
        new Date(order.created_at).toISOString(),
        new Date(order.updated_at).toISOString(),
        order.id_attendee,
        `"${order.Attendees?.full_name || ''}"`,
        `"${order.Attendees?.email || ''}"`,
        `"${order.Attendees?.phone_number || ''}"`,
        `"${order.order_status || ''}"`
      ];
      csvRows.push(row.join(','));
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
