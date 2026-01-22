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
    const classFilter = searchParams.get('class') || '';
    const checkedIn = searchParams.get('checkedIn');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build query
    let query = supabase
      .from('Attendees')
      .select('*', { count: 'exact' });

    // Don't apply search filter in SQL when we have a search term
    // We'll do Vietnamese accent-insensitive filtering in JavaScript instead

    // Apply class filter
    if (classFilter) {
      query = query.eq('class', classFilter);
    }

    // Apply check-in filter
    if (checkedIn !== null && checkedIn !== '') {
      query = query.eq('checked_in', checkedIn === 'true');
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // When searching, fetch all records (up to a reasonable limit) for client-side filtering
    // Otherwise, apply normal pagination
    if (search) {
      // Fetch more records for filtering - adjust this limit based on your data size
      query = query.range(0, 9999);
    } else {
      // Apply pagination normally when not searching
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);
    }

    // Execute query
    const { data: rawData, error, count: rawCount } = await query;

    if (error) {
      console.error('Error fetching attendees:', error);
      return NextResponse.json(
        { error: 'Failed to fetch attendees' },
        { status: 500 }
      );
    }

    let data = rawData || [];
    let count = rawCount || 0;

    // Apply client-side Vietnamese accent-insensitive filtering
    if (search) {
      const normalizedSearch = normalizeVietnamese(search).toLowerCase();

      data = data.filter((attendee) => {
        const normalizedName = normalizeVietnamese(attendee.full_name || '').toLowerCase();
        const normalizedEmail = normalizeVietnamese(attendee.email || '').toLowerCase();
        const normalizedPhone = normalizeVietnamese(attendee.phone_number || '').toLowerCase();

        return (
          normalizedName.includes(normalizedSearch) ||
          normalizedEmail.includes(normalizedSearch) ||
          normalizedPhone.includes(normalizedSearch)
        );
      });

      // Update count to reflect filtered results
      count = data.length;

      // Apply pagination to filtered results
      const from = (page - 1) * limit;
      const to = from + limit;
      data = data.slice(from, to);
    }

    // Calculate pagination metadata
    const totalPages = count ? Math.ceil(count / limit) : 0;

    // Get total checked-in count (without filters)
    const { count: totalCheckedInCount } = await supabase
      .from('Attendees')
      .select('*', { count: 'exact', head: true })
      .eq('checked_in', true);

    // Get total lunch count (without filters)
    const { count: totalLunchCount } = await supabase
      .from('Attendees')
      .select('*', { count: 'exact', head: true })
      .eq('have_lunch', true);

    // Get total attending live event count (without filters)
    const { count: totalAttendLiveCount } = await supabase
      .from('Attendees')
      .select('*', { count: 'exact', head: true })
      .eq('attend_live_event', true);

    // Get total NOT attending live event count (without filters)
    const { count: totalNotAttendLiveCount } = await supabase
      .from('Attendees')
      .select('*', { count: 'exact', head: true })
      .eq('attend_live_event', false);

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages,
      },
      stats: {
        totalCheckedIn: totalCheckedInCount || 0,
        totalLunch: totalLunchCount || 0,
        totalAttendLive: totalAttendLiveCount || 0,
        totalNotAttendLive: totalNotAttendLiveCount || 0,
      },
    });
  } catch (error) {
    console.error('Error in attendees API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
