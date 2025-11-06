import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const attendeeId = formData.get('attendeeId') as string;
    const orderId = formData.get('orderId') as string;
    const donationId = formData.get('donationId') as string;
    const amount = formData.get('amount') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!attendeeId) {
      return NextResponse.json(
        { error: 'Missing attendeeId' },
        { status: 400 }
      );
    }

    if (amount === null || amount === undefined || parseFloat(amount) < 0) {
      return NextResponse.json(
        { error: 'Missing or invalid payment amount' },
        { status: 400 }
      );
    }

    // Must have at least orderId or donationId
    if (!orderId && !donationId) {
      return NextResponse.json(
        { error: 'Must provide at least orderId or donationId' },
        { status: 400 }
      );
    }

    // Validate file type (only images)
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Create a unique filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileExtension = file.name.split('.').pop();
    const filename = `payment-proofs/${attendeeId}/${timestamp}.${fileExtension}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false,
    });

    // Prepare payment data - donation_id is now optional
    const paymentData: {
      id_attendee: number;
      url_confirmation: string;
      amount: number;
      id_order: number | null;
      id_donation: number | null;
    } = {
      id_attendee: parseInt(attendeeId),
      url_confirmation: blob.url,
      amount: parseFloat(amount),
      id_order: orderId ? parseInt(orderId) : null,
      id_donation: donationId ? parseInt(donationId) : null,
    };

    // Store the blob URL in the Payment table
    const { error: dbError } = await supabase
      .from('Payment')
      .insert(paymentData);

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save payment record to database', details: dbError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: blob.url,
      filename: filename,
      message: 'Payment proof uploaded successfully'
    });

  } catch (error) {
    console.error('Error uploading payment proof:', error);
    return NextResponse.json(
      { error: 'Failed to upload payment proof' },
      { status: 500 }
    );
  }
}
