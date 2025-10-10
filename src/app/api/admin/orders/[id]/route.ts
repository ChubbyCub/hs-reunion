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
    const { order_status } = await request.json();
    const resolvedParams = await context.params;
    const orderId = parseInt(resolvedParams.id);

    console.log('Updating order:', orderId, 'to status:', order_status);

    if (!order_status) {
      return NextResponse.json(
        { error: 'Missing order_status field' },
        { status: 400 }
      );
    }

    // Validate status - using actual enum values from database
    const validStatuses = ['pending', 'complete'];
    if (!validStatuses.includes(order_status)) {
      return NextResponse.json(
        { error: 'Invalid order_status. Must be one of: pending, complete' },
        { status: 400 }
      );
    }

    // Update order status
    const { data, error } = await supabase
      .from('Order')
      .update({
        order_status,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error updating order status:', error);
      return NextResponse.json(
        { error: 'Failed to update order status', details: error.message },
        { status: 500 }
      );
    }

    console.log('Successfully updated order:', data);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error in order status update API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
