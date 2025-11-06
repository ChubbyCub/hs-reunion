import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // Fetch attendees data
    const { data: attendees, error } = await supabase
      .from('Attendees')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching attendees:', error);
      return NextResponse.json(
        { error: 'Failed to fetch attendees data' },
        { status: 500 }
      );
    }

    // Convert to CSV format - all columns
    const headers = [
      'ID',
      'Created At',
      'Updated At',
      'First Name',
      'Last Name',
      'Full Name',
      'Email',
      'Phone Number',
      'Class',
      'Occupation',
      'Employer',
      'Address',
      'Country',
      'Message',
      'Checked In',
      'Invite Sent',
      'QR Code URL'
    ];
    const csvRows = [headers.join(',')];

    attendees?.forEach(attendee => {
      const row = [
        attendee.id,
        new Date(attendee.created_at).toISOString(),
        new Date(attendee.updated_at).toISOString(),
        `"${attendee.first_name || ''}"`,
        `"${attendee.last_name || ''}"`,
        `"${attendee.full_name || ''}"`,
        `"${attendee.email || ''}"`,
        `"${attendee.phone_number || ''}"`,
        `"${attendee.class || ''}"`,
        `"${attendee.occupation || ''}"`,
        `"${attendee.employer || ''}"`,
        `"${attendee.address || ''}"`,
        `"${attendee.country || ''}"`,
        `"${(attendee.message || '').replace(/"/g, '""')}"`, // Escape quotes in message
        attendee.checked_in ? 'TRUE' : 'FALSE',
        attendee.invite_sent ? 'TRUE' : 'FALSE',
        `"${attendee.qr_code_url || ''}"`
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');
    const csvBuffer = Buffer.from(csvContent, 'utf-8');

    return new NextResponse(csvBuffer, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="attendees-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error in attendees download API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
