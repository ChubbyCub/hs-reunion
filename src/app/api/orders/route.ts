import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { attendeeId, items } = await request.json();
    


    if (!attendeeId || !items || !Array.isArray(items) || items.length === 0) {

      return NextResponse.json(
        { error: 'Invalid order data' },
        { status: 400 }
      );
    }

    // Create the order

    
    // Try without quotes first, then with quotes if that fails
    let order, orderError;
    
    try {

      const result = await supabase
        .from('Order')
        .insert({
          id_attendee: attendeeId
        })
        .select()
        .single();
      
      order = result.data;
      orderError = result.error;
      
      if (!orderError) {

      }
    } catch {

      const result = await supabase
        .from('"Order"')
        .insert({
          id_attendee: attendeeId
        })
        .select()
        .single();
      
      order = result.data;
      orderError = result.error;
      
      if (!orderError) {

      }
    }

    if (orderError) {
      console.error('Error creating order:', orderError);
      return NextResponse.json(
        { error: 'Failed to create order', details: orderError },
        { status: 500 }
      );
    }

    // Create merchandise order items
    const merchOrderItems = items.map(item => ({
      id_order: order.id,
      id_merch: item.merchandiseId,
      quantity: item.quantity
      // Note: price comes from the original Merchandise table, but quantity is needed for Merch_Order
    }));



    // Try without quotes first, then with quotes if that fails
    let merchOrderError;
    
    try {

      const result = await supabase
        .from('Merch_Order')
        .insert(merchOrderItems);
      
      merchOrderError = result.error;
      
      if (!merchOrderError) {

      }
    } catch {

      const result = await supabase
        .from('"Merch_Order"')
        .insert(merchOrderItems);
      
      merchOrderError = result.error;
      
      if (!merchOrderError) {

      }
    }

    if (merchOrderError) {
      console.error('Error creating merchandise orders:', merchOrderError);
      // Try to delete the order if merchandise orders fail
      try {
        await supabase.from('Order').delete().eq('id', order.id);
      } catch {
        await supabase.from('"Order"').delete().eq('id', order.id);
      }
      return NextResponse.json(
        { error: 'Failed to create merchandise orders', details: merchOrderError },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        message: 'Order created successfully'
      }
    });

  } catch (error) {
    console.error('Error in orders API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
