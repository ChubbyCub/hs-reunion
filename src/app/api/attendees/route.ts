import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Debug: Check environment variables


// Check if environment variables are available
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing required Supabase environment variables');
}

// Server-side Supabase client with service role key
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();

    // Validate required fields (qrCodeUrl is optional)
    const requiredFields = ['fullName', 'email', 'phone', 'class', 'country'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Insert attendee data
    const { data, error } = await supabase
      .from('Attendees')
      .insert([{
        full_name: formData.fullName,
        email: formData.email,
        phone_number: formData.phone,
        class: formData.class,
        occupation: formData.occupation || null,
        employer: formData.workplace || null,
        address: formData.address || null,
        country: formData.country,
        message: formData.message || null,
        qr_code_url: formData.qrCodeUrl || null,
        attend_live_event: formData.willAttendEvent !== undefined ? formData.willAttendEvent : true,
      }])
      .select('id')
      .single();
    
    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      data: { id: data.id },
      message: 'Attendee registered successfully' 
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error during registration' 
      },
      { status: 500 }
    );
  }
}
