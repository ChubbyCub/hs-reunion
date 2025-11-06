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
    const attendeeId = parseInt(params.id);

    if (isNaN(attendeeId)) {
      return NextResponse.json(
        { error: 'Invalid attendee ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { invite_sent } = body;

    if (typeof invite_sent !== 'boolean') {
      return NextResponse.json(
        { error: 'invite_sent field must be a boolean' },
        { status: 400 }
      );
    }

    // Update the attendee invite_sent status
    const { data, error } = await supabase
      .from('Attendees')
      .update({ invite_sent })
      .eq('id', attendeeId)
      .select()
      .single();

    if (error) {
      console.error('Error updating attendee:', error);
      return NextResponse.json(
        { error: 'Failed to update invite status' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in attendee update API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
