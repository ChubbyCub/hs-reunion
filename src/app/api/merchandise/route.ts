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
      .from('Merchandise')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true, data });
    
  } catch (error) {
    console.error('Merchandise fetch error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error fetching merchandise' 
      },
      { status: 500 }
    );
  }
}
