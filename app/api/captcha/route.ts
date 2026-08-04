import { NextResponse } from 'next/server';
import { createImageCaptcha } from '@/lib/captcha';

export async function GET() {
  try {
    const captcha = createImageCaptcha();
    return NextResponse.json({
      success: true,
      image: captcha.image,
      token: captcha.token,
    });
  } catch (error) {
    console.error('Error creating captcha:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create captcha' },
      { status: 500 }
    );
  }
}
