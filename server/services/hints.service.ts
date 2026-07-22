import fs from 'fs';
import path from 'path';
import { AppError } from '../middleware/errorHandler.js';
import { contentDir } from './paths.js';
import { generateText, isGeminiConfigured } from './gemini.service.js';
import { MAX_HINT_LEVEL, type HintLevel, type HintResponse } from '../../shared/hints.js';

// Read a lesson file with Romanian fallback: prefer ro/<name> when lang=ro and it
// exists, else the English source. Returns '' when the file is absent.
function readLocalized(dir: string, name: string, lang: 'en' | 'ro'): string {
  if (lang === 'ro') {
    const roPath = path.join(dir, 'ro', name);
    if (fs.existsSync(roPath)) return fs.readFileSync(roPath, 'utf8');
  }
  const enPath = path.join(dir, name);
  return fs.existsSync(enPath) ? fs.readFileSync(enPath, 'utf8') : '';
}

const LEVEL_GUIDANCE: Record<HintLevel, { en: string; ro: string }> = {
  1: {
    en: 'Level 1 — a gentle conceptual nudge. Point at what to think about or which part of the task to focus on. NO code at all.',
    ro: 'Nivel 1 — un indiciu conceptual blând. Arată la ce să se gândească sau pe ce parte a temei să se concentreze. FĂRĂ cod deloc.',
  },
  2: {
    en: 'Level 2 — more specific. Name the concept/approach needed and the likely mistake in their current code. At most one short line of code if truly essential.',
    ro: 'Nivel 2 — mai specific. Numește conceptul/abordarea necesară și greșeala probabilă din codul curent. Cel mult o linie scurtă de cod dacă e chiar esențial.',
  },
  3: {
    en: 'Level 3 — the most detailed hint: a short step-by-step plan or pseudocode. Still NOT the full working solution — leave the actual coding to them.',
    ro: 'Nivel 3 — cel mai detaliat indiciu: un plan scurt pas cu pas sau pseudocod. TOTUȘI nu soluția completă funcțională — lasă-i lor scrierea propriu-zisă a codului.',
  },
};

function buildSystemPrompt(lang: 'en' | 'ro', level: HintLevel): string {
  const guidance = LEVEL_GUIDANCE[level][lang];
  if (lang === 'ro') {
    return [
      'Ești un tutor prietenos de programare pentru începători pe o platformă educațională.',
      'Sarcina ta: oferă UN SINGUR indiciu care ajută persoana să progreseze singură, fără să-i dai răspunsul.',
      'Reguli stricte:',
      '- Răspunde DOAR în limba română.',
      '- NU scrie niciodată soluția completă și nici codul complet funcțional.',
      '- Fii scurt: 2-4 propoziții. Ton încurajator. Adresează-te cu „tu”.',
      '- Nu folosi semne de exclamare.',
      '- Nu-i cere persoanei să-ți spună cum a mers și nu aștepta un răspuns — acesta e un indiciu într-un singur sens, nu o conversație.',
      '- Nu folosi titluri markdown și nu menționa că ești un AI.',
      guidance,
    ].join('\n');
  }
  return [
    'You are a friendly programming tutor for beginners on an educational platform.',
    'Your job: give ONE hint that helps the person move forward on their own, without giving away the answer.',
    'Strict rules:',
    '- Respond in English only.',
    '- NEVER write the full solution or complete working code.',
    '- Keep it short: 2-4 sentences. Encouraging tone. Address the learner as "you".',
    '- Do not use exclamation marks.',
    '- Do not ask the learner to report back or tell you how it goes, and do not expect a reply — this is a one-way hint, not a conversation.',
    '- No markdown headers, and do not mention that you are an AI.',
    guidance,
  ].join('\n');
}

function buildUserPrompt(
  lang: 'en' | 'ro',
  statement: string,
  solution: string,
  code: string,
): string {
  const codeBlock = code.trim().length > 0 ? code : '(the student has not written any code yet)';
  const parts = [
    lang === 'ro' ? 'Enunțul lecției:' : 'Lesson statement:',
    statement,
    '',
    lang === 'ro' ? 'Codul curent al persoanei:' : "The student's current code:",
    '```',
    codeBlock,
    '```',
  ];
  if (solution.trim().length > 0) {
    parts.push(
      '',
      lang === 'ro'
        ? 'Soluția de referință (DOAR pentru context — nu o dezvălui):'
        : 'Reference solution (for your context ONLY — do not reveal it):',
      solution,
    );
  }
  return parts.join('\n');
}

export async function generateHint(
  courseKey: string,
  lessonSlug: string,
  code: string,
  level: HintLevel,
  lang: 'en' | 'ro',
): Promise<Omit<HintResponse, 'usage'>> {
  if (!isGeminiConfigured()) {
    throw new AppError(503, 'AI hints are not available right now');
  }

  const dir = contentDir(courseKey);
  const statement = readLocalized(dir, `${lessonSlug}.md`, lang);
  if (!statement) {
    throw new AppError(404, 'Lesson not found');
  }
  const solution = readLocalized(dir, `${lessonSlug}-solution.md`, lang);

  let hint: string;
  try {
    hint = await generateText({
      system: buildSystemPrompt(lang, level),
      user: buildUserPrompt(lang, statement, solution, code),
    });
  } catch (err) {
    console.error(`[hints] Gemini call failed for ${courseKey}/${lessonSlug}:`, err);
    throw new AppError(502, 'Could not generate a hint right now — please try again');
  }

  if (!hint) {
    throw new AppError(502, 'Could not generate a hint right now — please try again');
  }

  return { hint, level, maxLevel: MAX_HINT_LEVEL };
}
