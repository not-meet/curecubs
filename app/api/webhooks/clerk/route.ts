import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  // You'll need your webhook secret from Clerk Dashboard
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('Missing CLERK_WEBHOOK_SECRET');
    return new NextResponse('Error: Missing webhook secret', { status: 500 });
  }

  // Get the headers
  const headerPayload = req.headers;
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('Missing svix headers');
    return new NextResponse('Error: Missing svix headers', { status: 400 });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret
  const webhook = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = webhook.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new NextResponse('Error verifying webhook', { status: 400 });
  }

  console.log('Webhook verified successfully');

  // Get the event type
  const eventType = evt.type;
  console.log(`Webhook type: ${eventType}`);

  // Handle different event types
  if (eventType === 'user.created') {
    try {
      // Extract user data from the Clerk event
      const userData = {
        clerkId: evt.data.id,
        name: `${evt.data.first_name || ''} ${evt.data.last_name || ''}`.trim() || 'New User',
      };

      console.log('Preparing to send user data:', userData);

      // Call your external API to create a user
      const response = await fetch('https://hack-viz-microserver.vercel.app/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error response:', errorData);
        return new NextResponse(JSON.stringify({
          success: false,
          error: 'Failed to create user in external API',
          details: errorData
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const successData = await response.json();
      console.log('User created successfully:', successData);

      return new NextResponse(JSON.stringify({
        success: true,
        message: 'User created in external database',
        data: successData
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Error processing webhook:', error);
      return new NextResponse(JSON.stringify({
        success: false,
        error: 'Failed to process webhook',
        details: error instanceof Error ? error.message : String(error)
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // Default response for other event types
  return new NextResponse(JSON.stringify({
    success: true,
    message: `Webhook processed for ${eventType}`
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
