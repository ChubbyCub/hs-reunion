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
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!attendeeId || !orderId) {
      return NextResponse.json(
        { error: 'Missing attendeeId or orderId' },
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
    const filename = `payment-proofs/${attendeeId}/${orderId}-${timestamp}.${fileExtension}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false,
    });

    // Store the blob URL in the Payment table
    const { error: dbError } = await supabase
      .from('Payment')
      .insert({
        id_attendee: parseInt(attendeeId),
        url_confirmation: blob.url,
        id_order: orderId !== 'temp' ? parseInt(orderId.replace('order-', '')) : null
      });

    if (dbError) {
      console.error('Database error:', dbError);
      // Note: We don't fail the upload if DB insert fails
      // The file is still uploaded and accessible
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
