import nodemailer from 'nodemailer';
import { config } from '../config/index.js';

const transporter = config.smtp.user
  ? nodemailer.createTransport({
      service: 'gmail',
      auth: { user: config.smtp.user, pass: config.smtp.pass },
    })
  : null;

export async function sendResetCode(to: string, code: string): Promise<void> {
  if (!transporter) {
    console.log(`[DEV] Reset code for ${to}: ${code}`);
    return;
  }

  await transporter.sendMail({
    from: `"CyberStars" <${config.smtp.user}>`,
    to,
    subject: 'Password Reset Code — CyberStars',
    html: `
      <div style="font-family:sans-serif;max-width:420px;margin:0 auto;padding:32px;background:#16161d;color:#e8e8ff;border-radius:12px">
        <h2 style="margin:0 0 16px;color:#6C5CE7">Password Reset</h2>
        <p style="margin:0 0 24px;color:#b0b0c0">Use the code below to reset your CyberStars password. It expires in 15 minutes.</p>
        <div style="text-align:center;padding:20px;background:#22222e;border-radius:8px;border:1px solid #6C5CE733">
          <span style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#fff">${code}</span>
        </div>
        <p style="margin:24px 0 0;font-size:13px;color:#666">If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
}

export async function sendEmailChangeCode(to: string, code: string): Promise<void> {
  if (!transporter) {
    console.log(`[DEV] Email change code for ${to}: ${code}`);
    return;
  }

  await transporter.sendMail({
    from: `"CyberStars" <${config.smtp.user}>`,
    to,
    subject: 'Confirm Your New Email — CyberStars',
    html: `
      <div style="font-family:sans-serif;max-width:420px;margin:0 auto;padding:32px;background:#16161d;color:#e8e8ff;border-radius:12px">
        <h2 style="margin:0 0 16px;color:#6C5CE7">Confirm Your New Email</h2>
        <p style="margin:0 0 24px;color:#b0b0c0">Someone (hopefully you) asked to change a CyberStars account's email to this address. Enter the code below to confirm. It expires in 15 minutes.</p>
        <div style="text-align:center;padding:20px;background:#22222e;border-radius:8px;border:1px solid #6C5CE733">
          <span style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#fff">${code}</span>
        </div>
        <p style="margin:24px 0 0;font-size:13px;color:#666">If you didn't request this, ignore this email — nothing will change.</p>
      </div>
    `,
  });
}
