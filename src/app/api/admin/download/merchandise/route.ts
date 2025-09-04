import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // Fetch merchandise data
    const { data: merchandise, error } = await supabase
      .from('Merchandise')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching merchandise:', error);
      return NextResponse.json(
        { error: 'Failed to fetch merchandise data' },
        { status: 500 }
      );
    }

    // Convert to CSV format - raw table data
    const headers = ['ID', 'Created At', 'Updated At', 'Name', 'Price', 'Gender', 'Size'];
    const csvRows = [headers.join(',')];

    merchandise?.forEach(item => {
      const row = [
        item.id,
        new Date(item.created_at).toISOString(),
        new Date(item.updated_at).toISOString(),
        `"${item.name || ''}"`,
        item.price,
        `"${item.gender || ''}"`,
        `"${item.size || ''}"`
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');
    const csvBuffer = Buffer.from(csvContent, 'utf-8');

    return new NextResponse(csvBuffer, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="merchandise-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error in merchandise download API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
