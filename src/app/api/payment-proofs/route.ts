import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // Get all payments with related attendee and order information
    const { data: payments, error: paymentsError } = await supabase
      .from('Payment')
      .select(`
        id,
        created_at,
        updated_at,
        id_attendee,
        url_confirmation,
        id_order,
        Attendees (
          id,
          full_name,
          email,
          phone_number
        ),
        Order (
          id,
          id_attendee,
          order_status
        )
      `)
      .order('created_at', { ascending: false });

    if (paymentsError) {
      console.error('Database error:', paymentsError);
      return NextResponse.json(
        { error: 'Failed to fetch payments' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: payments,
      count: payments.length
    });

  } catch (error) {
    console.error('Error fetching payment proofs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment proofs' },
      { status: 500 }
    );
  }
}
