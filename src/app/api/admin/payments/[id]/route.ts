import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const paymentId = parseInt(params.id);

    if (isNaN(paymentId)) {
      return NextResponse.json(
        { error: 'Invalid payment ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { confirmed } = body;

    if (typeof confirmed !== 'boolean') {
      return NextResponse.json(
        { error: 'Confirmed field must be a boolean' },
        { status: 400 }
      );
    }

    // Update the payment confirmed status
    const { data, error } = await supabase
      .from('Payment')
      .update({ confirmed })
      .eq('id', paymentId)
      .select()
      .single();

    if (error) {
      console.error('Error updating payment:', error);
      return NextResponse.json(
        { error: 'Failed to update payment status' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in payment update API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
