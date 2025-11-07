import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { format } from 'date-fns';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // Fetch all Donation table data with attendee information
    const { data: donations, error } = await supabase
      .from('Donation')
      .select('*, Attendees(full_name, email, phone_number)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching donations:', error);
      return NextResponse.json(
        { error: 'Failed to fetch donations data' },
        { status: 500 }
      );
    }

    // Convert to CSV format - raw table data with attendee info
    const headers = ['ID', 'Created At', 'Updated At', 'Amount', 'ID Attendee', 'Attendee Name', 'Attendee Email', 'Attendee Phone'];
    const csvRows = [headers.join(',')];

    donations?.forEach(donation => {
      const row = [
        donation.id,
        format(new Date(donation.created_at), 'dd/MM/yyyy HH:mm:ss'),
        donation.updated_at ? format(new Date(donation.updated_at), 'dd/MM/yyyy HH:mm:ss') : '',
        donation.amount,
        donation.id_attendee || '',
        `"${donation.Attendees?.full_name || ''}"`,
        `"${donation.Attendees?.email || ''}"`,
        `"${donation.Attendees?.phone_number || ''}"`
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
