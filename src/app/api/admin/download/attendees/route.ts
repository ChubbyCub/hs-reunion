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

    // Convert to CSV format
    const headers = ['ID', 'Họ', 'Tên', 'Email', 'Số điện thoại', 'Nghề nghiệp', 'Công ty', 'Đồng ý thông báo', 'Ngày đăng ký', 'Đã check-in'];
    const csvRows = [headers.join(',')];

    attendees?.forEach(attendee => {
      const row = [
        attendee.id,
        `"${attendee.last_name || ''}"`,
        `"${attendee.first_name || ''}"`,
        `"${attendee.email || ''}"`,
        `"${attendee.phone || ''}"`,
        `"${attendee.occupation || ''}"`,
        `"${attendee.company || ''}"`,
        attendee.allow_notifications ? 'Có' : 'Không',
        new Date(attendee.created_at).toLocaleString('vi-VN'),
        attendee.checked_in ? 'Có' : 'Không'
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
