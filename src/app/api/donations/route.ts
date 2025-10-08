import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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
    const data = await request.json();

    // Validate required fields
    if (!data.amount || !data.attendeeId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: amount and attendeeId' },
        { status: 400 }
      );
    }

    // Validate amount is positive
    if (data.amount < 0) {
      return NextResponse.json(
        { success: false, error: 'Donation amount must be positive' },
        { status: 400 }
      );
    }

    // Insert donation data
    const { data: donationData, error } = await supabase
      .from('Donation')
      .insert([{
        amount: data.amount,
        id_attendee: data.attendeeId,
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
      data: { id: donationData.id },
      message: 'Donation saved successfully'
    });

  } catch (error) {
    console.error('Donation creation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during donation creation'
      },
      { status: 500 }
    );
  }
}
