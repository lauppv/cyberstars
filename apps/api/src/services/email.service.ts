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

export type EmailLang = 'en' | 'ro';

// A code in a card, the way both emails show it
function codeEmail(heading: string, body: string, code: string, footer: string): string {
  return `
      <div style="font-family:sans-serif;max-width:420px;margin:0 auto;padding:32px;background:#16161d;color:#e8e8ff;border-radius:12px">
        <h2 style="margin:0 0 16px;color:#6C5CE7">${heading}</h2>
        <p style="margin:0 0 24px;color:#b0b0c0">${body}</p>
        <div style="text-align:center;padding:20px;background:#22222e;border-radius:8px;border:1px solid #6C5CE733">
          <span style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#fff">${code}</span>
        </div>
        <p style="margin:24px 0 0;font-size:13px;color:#666">${footer}</p>
      </div>
    `;
}

// Each email in the language of the page it was asked from
const RESET = {
  en: {
    subject: 'CyberStars: Password Reset Code',
    heading: 'Password Reset',
    body: 'Use the code below to reset your CyberStars password. It expires in 15 minutes.',
    footer: "If you didn't request this, ignore this email.",
  },
  ro: {
    subject: 'CyberStars: codul pentru resetarea parolei',
    heading: 'Resetarea parolei',
    body: 'Folosește codul de mai jos ca să-ți resetezi parola de CyberStars. Expiră în 15 minute.',
    footer: 'Dacă nu tu ai cerut asta, ignoră emailul.',
  },
};

const EMAIL_CHANGE = {
  en: {
    subject: 'CyberStars: Confirm Your New Email',
    heading: 'Confirm Your New Email',
    body: "Someone (hopefully you) asked to change a CyberStars account's email to this address. Enter the code below to confirm. It expires in 15 minutes.",
    footer: "If you didn't request this, ignore this email. Nothing will change.",
  },
  ro: {
    subject: 'CyberStars: confirmă noul email',
    heading: 'Confirmă noul email',
    body: 'Cineva (sperăm că tu) a cerut ca emailul unui cont CyberStars să devină această adresă. Scrie codul de mai jos ca să confirmi. Expiră în 15 minute.',
    footer: 'Dacă nu tu ai cerut asta, ignoră emailul. Nu se va schimba nimic.',
  },
};

export async function sendResetCode(
  to: string,
  code: string,
  lang: EmailLang = 'en',
): Promise<void> {
  const words = RESET[lang];
  await send(to, words.subject, codeEmail(words.heading, words.body, code, words.footer));
}

export async function sendEmailChangeCode(
  to: string,
  code: string,
  lang: EmailLang = 'en',
): Promise<void> {
  const words = EMAIL_CHANGE[lang];
  await send(to, words.subject, codeEmail(words.heading, words.body, code, words.footer));
}
