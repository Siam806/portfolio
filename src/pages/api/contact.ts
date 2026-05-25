import type { APIRoute } from 'astro';

export const prerender = false;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Use process.env for runtime env vars in SSR mode
const getApiKey = () => {
  const key = process.env.RESEND_API_KEY;
  return typeof key === 'string' ? key : undefined;
};

export const POST: APIRoute = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 422,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { name, email, message } = body as Record<string, unknown>;

  const errors: Record<string, string> = {};
  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.name = 'Name is required';
  }
  if (!email || typeof email !== 'string' || !email.trim()) {
    errors.email = 'Email is required';
  } else if (!emailRegex.test(email.trim())) {
    errors.email = 'Invalid email address';
  }
  if (!message || typeof message !== 'string' || !message.trim()) {
    errors.message = 'Message is required';
  }

  if (Object.keys(errors).length > 0) {
    return new Response(JSON.stringify({ errors }), {
      status: 422,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    console.error('RESEND_API_KEY not configured');
    return new Response(JSON.stringify({ error: 'Server configuration error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Dynamic import to prevent build-time elimination
  const { Resend } = await import('resend');
  const resend = new Resend(apiKey);

  try {
    const result = await resend.emails.send({
      from: 'contact@siams.app',
      to: 'siamthedoom@gmail.com',
      replyTo: (email as string).trim(),
      subject: `Portfolio Contact: ${(name as string).trim()}`,
      text: `Name: ${(name as string).trim()}\nEmail: ${(email as string).trim()}\n\nMessage:\n${(message as string).trim()}`,
    });

    if (result.error) {
      console.error('Resend API error:', result.error);
      return new Response(JSON.stringify({ error: 'Failed to send email', details: result.error }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Email send exception:', err);
    return new Response(JSON.stringify({ error: 'Failed to send email' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
