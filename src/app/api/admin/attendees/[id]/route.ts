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
    const { invite_sent, have_lunch } = body;

    // Build update object based on which fields are provided
    const updates: { invite_sent?: boolean; have_lunch?: boolean } = {};

    if (invite_sent !== undefined) {
      if (typeof invite_sent !== 'boolean') {
        return NextResponse.json(
          { error: 'invite_sent field must be a boolean' },
          { status: 400 }
        );
      }
      updates.invite_sent = invite_sent;
    }

    if (have_lunch !== undefined) {
      if (typeof have_lunch !== 'boolean') {
        return NextResponse.json(
          { error: 'have_lunch field must be a boolean' },
          { status: 400 }
        );
      }
      updates.have_lunch = have_lunch;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    // Update the attendee
    const { data, error } = await supabase
      .from('Attendees')
      .update(updates)
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
