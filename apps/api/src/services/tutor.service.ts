import type { UserRole } from '@cyberstars/shared/auth';
import { AppError } from '../middleware/errorHandler.js';
import {
  converse,
  isGeminiConfigured,
  type FunctionDeclaration,
  type GeminiContent,
  type GeminiPart,
} from './gemini.service.js';
import { listPages, readLesson, searchLessons } from './tutor-tools.service.js';

type Lang = 'en' | 'ro';

// A message may make the model call tools this many times before it has to
// answer with what it has, so one question can't loop.
const MAX_TOOL_ROUNDS = 3;

// Words that give a language away. Matched without diacritics; a diacritic of
// its own already means Romanian.
const RO_WORDS = new Set(
  'si sau care este cum ce nu de la pentru unde vreau imi mi ma poti cu din pe sa asta aici bucla eroare codul meu mea lectia lectie problema merge am fac face trebuie ajutor salut buna multumesc rog nu inteleg'.split(
    ' ',
  ),
);
const EN_WORDS = new Set(
  'the is how what why which where does do i my to and can you it this that lesson error code not with help please hi hello thanks work doesn dont isn me of are understand'.split(
    ' ',
  ),
);

// The language of the student's own words, not of the UI: code is left out
// first, and a message with nothing to tell by (only code) keeps the UI's.
export function detectLanguage(message: string, fallback: Lang): Lang {
  const prose = message.replace(/```[\s\S]*?(```|$)/g, ' ').replace(/`[^`]*`/g, ' ');
  if (/[ăâîșțşţ]/i.test(prose)) return 'ro';
  const plain = prose
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
  let ro = 0;
  let en = 0;
  for (const word of plain.match(/\p{L}+/gu) ?? []) {
    if (RO_WORDS.has(word)) ro++;
    if (EN_WORDS.has(word)) en++;
  }
  if (ro > en) return 'ro';
  if (en > ro) return 'en';
  return fallback;
}

function lessonOnPage(page: string): string | null {
  const match = /^\/lesson\/([^/]+)\/([^/]+)$/.exec(page);
  return match ? `${match[1]}/${match[2]}` : null;
}

function buildSystemPrompt(lang: Lang, page: string): string {
  const lesson = lessonOnPage(page);
  if (lang === 'ro') {
    return [
      'Ești tutorele din CyberStars, un site gratuit unde începătorii învață Python, Java, C și Linux în browser, prin lecții și probleme de algoritmi verificate de un evaluator automat.',
      'Cum vorbești:',
      '- Fii cald și încurajator. Observă ce a făcut studentul bine și arată-i că poate reuși. Nu-l face niciodată să se simtă încet.',
      '- Fii scurt: două până la cinci propoziții, dacă studentul nu cere mai multe detalii.',
      '- Explică ideea, apoi pune o întrebare care îl ajută să facă singur următorul pas.',
      '- Adresează-te cu „tu”. Nu folosi titluri, emoji, semne de exclamare sau linii de pauză (em dash, en dash). Nu spune că ești un AI.',
      'Cu ce ajuți:',
      '- Programare, lecțiile și problemele, și cum se folosește CyberStars. Pentru orice altceva, spune politicos că ajuți cu programarea și cu aplicația.',
      '- Nu scrie niciodată soluția unei lecții sau probleme, nici măcar o parte din ea. Dacă un cod ajută, arată un exemplu scurt cu aceeași idee pe o altă problemă, cu alte nume și alte date, care n-ar merge lipit în lecție.',
      'Cum găsești lucrurile:',
      '- Folosește uneltele ca să găsești lecții, probleme și pagini. Nu inventa niciodată o lecție, o pagină sau un link.',
      '- Dă linkurile în markdown, cu căi din aplicație, de exemplu [Bucla for](/lesson/python/for).',
      'Răspunde în limba română.',
      `Studentul este acum pe pagina ${page}.`,
      ...(lesson
        ? [`Pagina este lecția ${lesson}; citește-o cu read_lesson când întrebarea e despre ea.`]
        : []),
    ].join('\n');
  }
  return [
    'You are the tutor inside CyberStars, a free website where beginners learn Python, Java, C and Linux in the browser, through lessons and algorithm challenges checked by a judge.',
    'How you talk:',
    '- Be warm and encouraging. Notice what the student got right and show them they can do it. Never make them feel slow.',
    '- Keep it short: two to five sentences, unless the student asks for more detail.',
    '- Explain the idea, then ask one question that helps them take the next step on their own.',
    '- Address the student as "you". Do not use headings, emoji, exclamation marks, em dashes or en dashes. Do not say you are an AI.',
    'What you help with:',
    '- Programming, the lessons and challenges, and how to use CyberStars. For anything else, say kindly that you help with coding and the app.',
    '- Never write the solution to a lesson or challenge, not even part of it. If code helps, show a short example of the same idea on a different problem, with other names and other data, that would not work if pasted into the lesson.',
    'Finding things:',
    '- Use the tools to find lessons, challenges and pages. Never invent a lesson, a page or a link.',
    '- Give links as markdown with in-app paths, like [For loops](/lesson/python/for).',
    'Answer in English.',
    `The student is now on the page ${page}.`,
    ...(lesson
      ? [
          `That page is the lesson ${lesson}; read it with read_lesson when the question is about it.`,
        ]
      : []),
  ].join('\n');
}

const TOOLS: FunctionDeclaration[] = [
  {
    name: 'search_lessons',
    description:
      'Search every lesson and algorithm challenge by words, in English or Romanian. Returns up to 6, each with its title, course, kind and link.',
    parameters: {
      type: 'object',
      properties: { query: { type: 'string', description: 'A few words, like "for loops"' } },
      required: ['query'],
    },
  },
  {
    name: 'read_lesson',
    description:
      "Read the statement of one lesson or challenge. Its link is /lesson/<course>/<slug>. The statement only: never the solution or the judge's tests.",
    parameters: {
      type: 'object',
      properties: {
        course: { type: 'string', description: 'The course key, like "python" or "algo-c"' },
        slug: { type: 'string', description: 'The lesson slug, like "for"' },
      },
      required: ['course', 'slug'],
    },
  },
  {
    name: 'list_pages',
    description:
      "List the app's pages this student can open and its courses, each with its link and what it is for.",
  },
];

interface Student {
  role: UserRole | undefined;
  isProd: boolean;
}

function runTool(
  call: NonNullable<GeminiPart['functionCall']>,
  lang: Lang,
  student: Student,
): Record<string, unknown> {
  const args = call.args ?? {};
  switch (call.name) {
    case 'search_lessons':
      return { results: searchLessons(String(args.query ?? '')) };
    case 'read_lesson': {
      const lesson = readLesson(String(args.course ?? ''), String(args.slug ?? ''), lang);
      return lesson ? { ...lesson } : { error: 'No such lesson' };
    }
    case 'list_pages':
      return { ...listPages(student.role, student.isProd) };
    default:
      return { error: `No tool named ${call.name}` };
  }
}

interface AskOptions extends Student {
  message: string;
  page: string;
  uiLang: Lang;
}

const UNAVAILABLE = 'The tutor could not answer right now, please try again';

export async function askTutor(opts: AskOptions): Promise<string> {
  if (!isGeminiConfigured()) {
    throw new AppError(503, 'The tutor is not available right now');
  }

  const lang = detectLanguage(opts.message, opts.uiLang);
  const system = buildSystemPrompt(lang, opts.page);
  const contents: GeminiContent[] = [{ role: 'user', parts: [{ text: opts.message }] }];

  for (let round = 0; ; round++) {
    const allowTools = round < MAX_TOOL_ROUNDS;
    let turn;
    try {
      turn = await converse({
        system,
        contents,
        tools: TOOLS,
        allowTools,
        maxOutputTokens: 600,
        temperature: 0.5,
      });
    } catch (err) {
      console.error('[tutor] Gemini call failed:', err);
      throw new AppError(502, UNAVAILABLE);
    }

    const calls = turn.content.parts.flatMap((p) => (p.functionCall ? [p.functionCall] : []));
    if (calls.length === 0 || !allowTools) {
      const text = turn.content.parts
        .map((p) => p.text ?? '')
        .join('')
        .trim();
      if (!text) throw new AppError(502, UNAVAILABLE);
      return text;
    }

    // The model's turn goes back as it came (its thoughtSignature included),
    // followed by every result it asked for.
    contents.push(turn.content);
    contents.push({
      role: 'user',
      parts: calls.map((call) => ({
        functionResponse: { name: call.name, id: call.id, response: runTool(call, lang, opts) },
      })),
    });
  }
}
