import { Resend } from 'resend';
import { config } from '../config/index.js';

const client = config.resend.apiKey ? new Resend(config.resend.apiKey) : null;

async function send(to: string, subject: string, html: string): Promise<void> {
  if (!client) {
    console.log(`[DEV] Email to ${to} (${subject}): ${html.match(/\d{6}/)?.[0] ?? ''}`);
    return;
  }
  const { error } = await client.emails.send({ from: config.resend.from, to, subject, html });
  if (error) throw new Error(`Resend send failed: ${error.message}`);
}

export async function sendResetCode(to: string, code: string): Promise<void> {
  await send(
    to,
    'Password Reset Code — CyberStars',
    `
      <div style="font-family:sans-serif;max-width:420px;margin:0 auto;padding:32px;background:#16161d;color:#e8e8ff;border-radius:12px">
        <h2 style="margin:0 0 16px;color:#6C5CE7">Password Reset</h2>
        <p style="margin:0 0 24px;color:#b0b0c0">Use the code below to reset your CyberStars password. It expires in 15 minutes.</p>
        <div style="text-align:center;padding:20px;background:#22222e;border-radius:8px;border:1px solid #6C5CE733">
          <span style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#fff">${code}</span>
        </div>
        <p style="margin:24px 0 0;font-size:13px;color:#666">If you didn't request this, ignore this email.</p>
      </div>
    `,
  );
}

export async function sendEmailChangeCode(to: string, code: string): Promise<void> {
  await send(
    to,
    'Confirm Your New Email — CyberStars',
    `
      <div style="font-family:sans-serif;max-width:420px;margin:0 auto;padding:32px;background:#16161d;color:#e8e8ff;border-radius:12px">
        <h2 style="margin:0 0 16px;color:#6C5CE7">Confirm Your New Email</h2>
        <p style="margin:0 0 24px;color:#b0b0c0">Someone (hopefully you) asked to change a CyberStars account's email to this address. Enter the code below to confirm. It expires in 15 minutes.</p>
        <div style="text-align:center;padding:20px;background:#22222e;border-radius:8px;border:1px solid #6C5CE733">
          <span style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#fff">${code}</span>
        </div>
        <p style="margin:24px 0 0;font-size:13px;color:#666">If you didn't request this, ignore this email — nothing will change.</p>
      </div>
    `,
  );
}
