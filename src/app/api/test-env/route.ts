import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'Environment variables test',
    supabaseUrl: process.env.SUPABASE_URL ? 'SET' : 'NOT SET',
    supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET',
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
}
