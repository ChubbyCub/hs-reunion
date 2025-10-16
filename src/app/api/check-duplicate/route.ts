import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    const phone = searchParams.get('phone');

    if (!email && !phone) {
      return NextResponse.json(
        { error: 'Email or phone parameter is required' },
        { status: 400 }
      );
    }

    if (email) {
      const { data, error } = await supabase
        .from('Attendees')
        .select('id')
        .eq('email', email)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error('Error checking email:', error);
        return NextResponse.json(
          { error: 'Database error' },
          { status: 500 }
        );
      }

      return NextResponse.json({ exists: !!data });
    }

    if (phone) {
      const { data, error } = await supabase
        .from('Attendees')
        .select('id')
        .eq('phone_number', phone)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking phone:', error);
        return NextResponse.json(
          { error: 'Database error' },
          { status: 500 }
        );
      }

      return NextResponse.json({ exists: !!data });
    }

    return NextResponse.json({ exists: false });
  } catch (error) {
    console.error('Error in check-duplicate API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
