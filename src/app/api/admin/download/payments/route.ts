import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // Fetch all Payment table data
    const { data: payments, error } = await supabase
      .from('Payment')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching payments:', error);
      return NextResponse.json(
        { error: 'Failed to fetch payments data' },
        { status: 500 }
      );
    }

    // Convert to CSV format - exact table structure
    const headers = ['ID', 'Created At', 'Updated At', 'ID Attendee', 'URL Confirmation', 'ID Order'];
    const csvRows = [headers.join(',')];

    payments?.forEach(payment => {
      const row = [
        payment.id,
        new Date(payment.created_at).toISOString(),
        new Date(payment.updated_at).toISOString(),
        payment.id_attendee,
        `"${payment.url_confirmation || ''}"`,
        payment.id_order || ''
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');
    const csvBuffer = Buffer.from(csvContent, 'utf-8');

    return new NextResponse(csvBuffer, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="payments-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error in payments download API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
