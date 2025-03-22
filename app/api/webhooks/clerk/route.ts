import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  // You'll need your webhook secret from Clerk Dashboard
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET to your environment variables');
  }

  // Get the headers
  const headerPayload = req.headers;
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
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

  // Get the ID and type
  const eventType = evt.type;

  console.log(`Webhook received: ${eventType}`);

  // Handle different event types
  switch (eventType) {
    case 'user.created': {
      // Extract user data from the Clerk event
      const { id, first_name, last_name } = evt.data;

      // Prepare the data for your API
      const userData = {
        clerkId: id,
        name: `${first_name || ''} ${last_name || ''}`.trim() || 'New User',
        // You can add other default values if needed
      };

      try {
        // Call your external API to create a user
        const response = await fetch('https://hack-viz-microserver.vercel.app/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error('Error creating user in external API:', data);
        } else {
          console.log('User successfully created in external API:', data);
        }
      } catch (error) {
        console.error('Failed to call external API:', error);
      }
      break;
    }

    case 'user.updated': {
      // You could implement update logic here if needed
      // This would require a PUT or PATCH endpoint in your API
      break;
    }

    case 'user.deleted': {
      // You could implement delete logic here if needed
      // This would require a DELETE endpoint in your API
      const { id } = evt.data;

      // You would need a delete endpoint in your API for this
      // await fetch(`https://hack-viz-microserver.vercel.app/api/users/${id}`, {
      //   method: 'DELETE',
      // });
      break;
    }
  }

  return new NextResponse('Webhook processed successfully', { status: 200 });
}
