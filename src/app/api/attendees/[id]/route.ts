import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const attendeeId = parseInt(id);
    const updateData = await request.json();

    if (!attendeeId || isNaN(attendeeId)) {
      return NextResponse.json(
        { error: 'Invalid attendee ID' },
        { status: 400 }
      );
    }

    // Map the form fields to database column names
    const mappedData = {
      full_name: updateData.fullName,
      email: updateData.email,
      phone_number: updateData.phone,
      class: updateData.class,
      occupation: updateData.occupation,
      employer: updateData.workplace,
      updated_at: new Date().toISOString()
    };

    // Remove undefined values
    Object.keys(mappedData).forEach(key => {
      if (mappedData[key as keyof typeof mappedData] === undefined) {
        delete mappedData[key as keyof typeof mappedData];
      }
    });

    const { data, error } = await supabase
      .from('Attendees')
      .update(mappedData)
      .eq('id', attendeeId)
      .select()
      .single();

    if (error) {
      console.error('Error updating attendee:', error);
      return NextResponse.json(
        { error: 'Failed to update attendee' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        message: 'Attendee updated successfully'
      }
    });

  } catch (error) {
    console.error('Error in attendees update API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
