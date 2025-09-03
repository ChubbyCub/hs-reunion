import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client with service role key
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { qrData } = await request.json();
    
    if (!qrData) {
      return NextResponse.json(
        { success: false, error: 'QR data is required' },
        { status: 400 }
      );
    }

    let attendeeEmail: string;

    // Try to parse as QR data first
    try {
      const attendeeInfo = JSON.parse(qrData);
      attendeeEmail = attendeeInfo.em;
    } catch {
      // If parsing fails, treat as plain email
      attendeeEmail = qrData.trim();
    }

    // Validate email format
    if (!attendeeEmail || !attendeeEmail.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Find attendee by email
    const { data: attendee, error: findError } = await supabase
      .from('Attendees')
      .select('id, checked_in, first_name, last_name')
      .eq('email', attendeeEmail)
      .single();
    
    if (findError || !attendee) {
      return NextResponse.json(
        { success: false, error: 'Attendee not found' },
        { status: 404 }
      );
    }
    
    // Check if already checked in
    if (attendee.checked_in) {
      return NextResponse.json(
        { success: false, error: 'Attendee is already checked in' },
        { status: 409 }
      );
    }
    
    // Perform check-in
    const { error: updateError } = await supabase
      .from('Attendees')
      .update({
        checked_in: true,
      })
      .eq('id', attendee.id);
    
    if (updateError) {
      return NextResponse.json(
        { success: false, error: updateError.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Check-in error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error during check-in' 
      },
      { status: 500 }
    );
    }
}

export async function GET() {
  try {
    // Get check-in statistics
    const { data, error } = await supabase
      .from('Attendees')
      .select('checked_in');
    
    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    
    const stats = {
      totalCheckedIn: data.filter(d => d.checked_in).length,
      totalAttendees: data.length,
      checkInRate: data.length > 0 ? Math.round((data.filter(d => d.checked_in).length / data.length) * 100) : 0,
    };
    
    return NextResponse.json({ success: true, data: stats });
    
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error getting stats' 
      },
      { status: 500 }
    );
  }
}
