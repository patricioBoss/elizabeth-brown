import { NextRequest, NextResponse } from 'next/server';
import sendMail from '@/helpers/sendMail';
import sampleMailTemplate from '@/helpers/sampleMailTemplate';

const DOMAIN = process.env.NEXT_PUBLIC_SITE_URL || 'localhost:8084';

// POST - Send a custom email (admin route)
export async function POST(request: NextRequest) {
  try {
    const { email, name, subject, message } = await request.json();

    if (!email || !message) {
      return NextResponse.json(
        { message: 'email and message are required' },
        { status: 400 }
      );
    }

    const loginLink = `https://${DOMAIN}/login`;
    const html = sampleMailTemplate(name || '', loginLink, message);

    const sent = await sendMail(html, subject || 'Message from Support', email);

    if (!sent) {
      return NextResponse.json(
        { message: 'failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'email sent successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Send mail error:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
