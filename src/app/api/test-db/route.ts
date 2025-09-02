import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // Test basic connection
    console.log('Testing database connection...');
    
    // Check if Order table exists and get its structure
    const { data: orderTable, error: orderError } = await supabase
      .from('"Order"')
      .select('*')
      .limit(1);
    
    console.log('Order table check:', { orderTable, orderError });
    
    // Check if Merch_Order table exists and get its structure
    const { data: merchOrderTable, error: merchOrderError } = await supabase
      .from('"Merch_Order"')
      .select('*')
      .limit(1);
    
    console.log('Merch_Order table check:', { merchOrderTable, merchOrderError });
    
    // Try to get table info
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_table_info');
    
    console.log('Tables info:', { tables, tablesError });
    
    return NextResponse.json({
      success: true,
      data: {
        orderTable: { exists: !orderError, error: orderError },
        merchOrderTable: { exists: !merchOrderError, error: merchOrderError },
        tables: { exists: !tablesError, error: tablesError }
      }
    });
    
  } catch (error) {
    console.error('Error in test-db API:', error);
    return NextResponse.json(
      { error: 'Database test failed', details: error },
      { status: 500 }
    );
  }
}
