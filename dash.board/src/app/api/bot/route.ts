import { NextRequest, NextResponse } from 'next/server';

const { TELEGRAM_BOT_TOKEN } = process.env;

if (!TELEGRAM_BOT_TOKEN) throw new Error("TELEGRAM_BOT_TOKEN is not defined.");

const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const chatId = body.message.chat.id;
    const text = body.message.text;

    // Echo the received message
    const response = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.statusText}`);
    }

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Error handling Telegram webhook:', error);

    // Type assertion to access the 'message' property
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json({ status: 'error', message: errorMessage }, { status: 500 });
  }
};
