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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const format = searchParams.get('format');

    // Build query - fetch payments with related data
    let query = supabase
      .from('Payment')
      .select(`
        id,
        created_at,
        updated_at,
        amount,
        url_confirmation,
        id_attendee,
        id_order,
        id_donation,
        Attendees!Payment_id_attendee_fkey (
          full_name,
          email
        ),
        Order!Payment_id_order_fkey (
          amount
        ),
        Donation!Payment_id_donation_fkey (
          amount
        )
      `, { count: 'exact' });

    // Apply sorting
    query = query.order('created_at', { ascending: false });

    // For CSV export, get all data without pagination
    if (format !== 'csv') {
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);
    }

    // Execute query
    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching payments:', error);
      return NextResponse.json(
        { error: 'Failed to fetch payments' },
        { status: 500 }
      );
    }

    // Apply search filter if needed (client-side)
    let filteredData = data || [];
    if (search) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      filteredData = (data || []).filter((payment: any) =>
        payment.Attendees?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        payment.Attendees?.email?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Return CSV format if requested
    if (format === 'csv') {
      const csvHeaders = [
        'ID',
        'Attendee Name',
        'Email',
        'Total Amount (VND)',
        'Order Amount (VND)',
        'Donation Amount (VND)',
        'Payment Date',
        'Proof URL',
      ];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const csvRows = filteredData.map((payment: any) => [
        payment.id,
        payment.Attendees?.full_name || '',
        payment.Attendees?.email || '',
        payment.amount,
        payment.Order?.amount || 0,
        payment.Donation?.amount || 0,
        new Date(payment.created_at).toLocaleString('vi-VN'),
        payment.url_confirmation,
      ]);

      const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map(row => row.map(cell => `"${cell}"`).join(',')),
      ].join('\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename=payments.csv',
        },
      });
    }

    // Calculate pagination metadata
    const totalPages = count ? Math.ceil(count / limit) : 0;

    return NextResponse.json({
      data: filteredData,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error in payments API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
