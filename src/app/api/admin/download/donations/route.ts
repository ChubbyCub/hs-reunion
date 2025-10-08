import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // Fetch all Donation table data
    const { data: donations, error } = await supabase
      .from('Donation')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching donations:', error);
      return NextResponse.json(
        { error: 'Failed to fetch donations data' },
        { status: 500 }
      );
    }

    // Convert to CSV format - raw table data
    const headers = ['ID', 'Created At', 'Updated At', 'Amount', 'ID Attendee'];
    const csvRows = [headers.join(',')];

    donations?.forEach(donation => {
      const row = [
        donation.id,
        new Date(donation.created_at).toISOString(),
        donation.updated_at ? new Date(donation.updated_at).toISOString() : '',
        donation.amount,
        donation.id_attendee || ''
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');
    const csvBuffer = Buffer.from(csvContent, 'utf-8');

    return new NextResponse(csvBuffer, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="donations-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error in donations download API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
