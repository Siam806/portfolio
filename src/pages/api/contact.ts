import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  const apiKey = import.meta.env.RESEND_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Server configuration error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const resend = new Resend(apiKey);

  try {
    await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: 'contact@siam-it.de',
      subject: `Portfolio Contact: ${(name as string).trim()}`,
      text: `Name: ${(name as string).trim()}\nEmail: ${(email as string).trim()}\n\nMessage:\n${(message as string).trim()}`,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Failed to send email' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
