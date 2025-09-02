import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { attendeeId, items, totalAmount } = await request.json();
    
    console.log('Received order data:', { attendeeId, items });

    if (!attendeeId || !items || !Array.isArray(items) || items.length === 0) {
      console.log('Validation failed:', { attendeeId, items });
      return NextResponse.json(
        { error: 'Invalid order data' },
        { status: 400 }
      );
    }

    // Create the order
    console.log('Creating order with data:', { id_attendee: attendeeId, total_amount: totalAmount });
    
    // Try without quotes first, then with quotes if that fails
    let order, orderError;
    
    try {
      console.log('Attempting to create order without quotes...');
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
        console.log('Order created successfully without quotes');
      }
    } catch {
      console.log('First attempt failed, trying with quotes...');
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
        console.log('Order created successfully with quotes');
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

    console.log('Creating merchandise orders with data:', merchOrderItems);
    console.log('Each item includes quantity:', items.map(item => ({ merchandiseId: item.merchandiseId, quantity: item.quantity })));

    // Try without quotes first, then with quotes if that fails
    let merchOrderError;
    
    try {
      console.log('Attempting to create merchandise orders without quotes...');
      const result = await supabase
        .from('Merch_Order')
        .insert(merchOrderItems);
      
      merchOrderError = result.error;
      
      if (!merchOrderError) {
        console.log('Merchandise orders created successfully without quotes');
      }
    } catch {
      console.log('First attempt failed for Merch_Order, trying with quotes...');
      const result = await supabase
        .from('"Merch_Order"')
        .insert(merchOrderItems);
      
      merchOrderError = result.error;
      
      if (!merchOrderError) {
        console.log('Merchandise orders created successfully with quotes');
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
