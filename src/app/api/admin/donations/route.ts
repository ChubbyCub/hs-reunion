import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { normalizeVietnamese } from '@/lib/utils';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse query parameters
    const search = searchParams.get('search') || '';
    const amountMin = searchParams.get('amountMin');
    const amountMax = searchParams.get('amountMax');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const format = searchParams.get('format');

    // Build query
    let query = supabase
      .from('Donation')
      .select(`
        id,
        created_at,
        updated_at,
        amount,
        id_attendee,
        Attendees!Donation_id_attendee_fkey (
          full_name,
          email
        )
      `, { count: 'exact' });

    // Apply amount range filters
    if (amountMin) {
      query = query.gte('amount', parseFloat(amountMin));
    }
    if (amountMax) {
      query = query.lte('amount', parseFloat(amountMax));
    }

    // Apply sorting
    query = query.order('amount', { ascending: false });

    // For CSV export, get all data without pagination
    if (format !== 'csv') {
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);
    }

    // Execute query
    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching donations:', error);
      return NextResponse.json(
        { error: 'Failed to fetch donations' },
        { status: 500 }
      );
    }

    // Apply search filter if needed (client-side with Vietnamese accent-insensitive search)
    let filteredData = data || [];
    if (search) {
      const normalizedSearch = normalizeVietnamese(search).toLowerCase();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      filteredData = (data || []).filter((donation: any) => {
        const normalizedName = normalizeVietnamese(donation.Attendees?.full_name || '').toLowerCase();
        const normalizedEmail = normalizeVietnamese(donation.Attendees?.email || '').toLowerCase();

        return (
          normalizedName.includes(normalizedSearch) ||
          normalizedEmail.includes(normalizedSearch)
        );
      });
    }

    // Return CSV format if requested
    if (format === 'csv') {
      const csvHeaders = ['ID', 'Attendee Name', 'Email', 'Amount (VND)', 'Donation Date'];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const csvRows = filteredData.map((donation: any) => [
        donation.id,
        donation.Attendees?.full_name || '',
        donation.Attendees?.email || '',
        donation.amount,
        new Date(donation.created_at).toLocaleString('vi-VN'),
      ]);

      const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map(row => row.map(cell => `"${cell}"`).join(',')),
      ].join('\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename=donations.csv',
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
    console.error('Error in donations API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
