import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client with service role key
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('Attendees')
      .select('id, first_name, last_name, email, phone_number, occupation, employer, checked_in, check_in_time, check_in_method, check_in_notes')
      .eq('checked_in', true)
      .order('check_in_time', { ascending: false });
    
    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true, data });
    
  } catch (error) {
    console.error('Get attendees error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error getting attendees' 
      },
      { status: 500 }
    );
  }
}
