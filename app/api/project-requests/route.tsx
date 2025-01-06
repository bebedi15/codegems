import { NextResponse } from 'next/server';

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL!;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, githubLink, description, reason } = body;
    
    if (!DISCORD_WEBHOOK_URL) {
      console.error('Discord webhook URL not configured');
      return NextResponse.json(
        { error: 'Webhook URL not configured' },
        { status: 500 }
      );
    }

    console.log('Sending to Discord:', { title, githubLink, description, reason });

    const discordMessage = {
      embeds: [{
        title: '🆕 New Project Request',
        color: 0x6366f1,
        fields: [
          {
            name: '📝 Project Title',
            value: title || 'Not provided',
          },
          {
            name: '🔗 GitHub Link',
            value: githubLink || 'Not provided',
          },
          {
            name: '📋 Description',
            value: description || 'Not provided',
          },
          {
            name: '💡 Why is it good?',
            value: reason || 'Not provided',
          },
        ],
        timestamp: new Date().toISOString(),
      }],
    };

    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(discordMessage),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Discord API error:', errorText);
      throw new Error(`Discord API error: ${errorText}`);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error processing project request:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process request' },
      { status: 500 }
    );
  }
}