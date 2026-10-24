// Makes Laniakea's questions from the templates in each lesson's quiz file
// (laniakea-templates.ts): runs every program they need in the lessons' Python
// image through quiz-runner.py, twice with other hash seeds so a program whose
// output changes from run to run (a set printed) is caught, and writes the
// questions they make to <slug>-quiz-made.json and ro/<slug>-quiz-made.json.
// With --check it writes nothing and fails when a file would change or a
// template doesn't make its questions, naming the template and its values (CI).
//
//   npm run make:quiz                # every lesson
//   npm run make:quiz -- print       # some lessons
//   npm run check:quiz               # what CI runs
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import prettier from 'prettier';
import { pythonRuntime } from '../src/runtimes/python.js';
import {
  parseQuiz,
  quizFiles,
  quizSlugs,
  type QuizQuestionSpec,
} from '../src/services/laniakea-quiz.js';
import {
  parseTemplates,
  planLesson,
  sameQuestions,
  type ProgramRun,
  type QuestionPlan,
} from '../src/services/laniakea-templates.js';

const RUNNER = path.join(import.meta.dirname, 'quiz-runner.py');
const LANGS = ['en', 'ro'] as const;

function runAll(programs: string[], seed: number): Promise<ProgramRun[]> {
  return new Promise((resolve, reject) => {
    const docker = spawn('docker', [
      'run',
      '--rm',
      '-i',
      '--network=none',
      '--memory=256m',
      '-e',
      `PYTHONHASHSEED=${seed}`,
      '-v',
      `${RUNNER}:/runner.py:ro`,
      pythonRuntime.image,
      'python3',
      '/runner.py',
    ]);
    let out = '';
    let err = '';
    docker.stdout.on('data', (d) => (out += d));
    docker.stderr.on('data', (d) => (err += d));
    docker.on('error', reject);
    docker.on('close', (code) =>
      code === 0 ? resolve(JSON.parse(out)) : reject(new Error(`docker exited ${code}: ${err}`)),
    );
    docker.stdin.end(JSON.stringify(programs));
  });
}

// A question as the made file holds it: no code or output when it has none.
function stored(q: QuizQuestionSpec) {
  return {
    id: q.id,
    text: q.text,
    ...(q.code !== null && { code: q.code }),
    ...(q.output !== null && { output: q.output }),
    options: q.options,
    answer: q.answer,
  };
}

const readJson = (file: string): unknown => JSON.parse(fs.readFileSync(file, 'utf8'));

async function main() {
  const args = process.argv.slice(2);
  const check = args.includes('--check');
  const only = args.filter((a) => !a.startsWith('--'));
  const all = quizSlugs().sort();
  const unknown = only.filter((slug) => !all.includes(slug));
  if (unknown.length > 0) throw new Error(`no quiz file for ${unknown.join(', ')}`);
  const slugs = only.length > 0 ? only : all;

  const errors: string[] = [];
  const lessons: {
    slug: string;
    raw: Record<string, unknown>;
    plans: Record<string, QuestionPlan[]>;
  }[] = [];
  for (const slug of slugs) {
    try {
      const ro = quizFiles(slug, 'ro').quiz;
      if (!fs.existsSync(ro)) throw new Error('has no Romanian quiz file');
      const raw = { en: readJson(quizFiles(slug, 'en').quiz), ro: readJson(ro) };
      const plans = planLesson(parseTemplates(raw.en), parseTemplates(raw.ro));
      lessons.push({ slug, raw, plans });
    } catch (e) {
      errors.push(`${slug}: ${(e as Error).message}`);
    }
  }

  const programs = [
    ...new Set(
      lessons.flatMap((l) => LANGS.flatMap((lang) => l.plans[lang])).flatMap((p) => p.programs),
    ),
  ];
  const [first, second] =
    programs.length > 0 ? await Promise.all([runAll(programs, 1), runAll(programs, 2)]) : [[], []];
  const runs = new Map(
    programs.map((p, i): [string, ProgramRun] => [
      p,
      JSON.stringify(first[i]) === JSON.stringify(second[i])
        ? first[i]
        : { ok: false, error: 'its output changes from run to run' },
    ]),
  );

  let made = 0;
  for (const { slug, raw, plans } of lessons) {
    for (const lang of LANGS) {
      const where = `${slug} (${lang})`;
      const questions: QuizQuestionSpec[] = [];
      for (const plan of plans[lang]) {
        try {
          questions.push(plan.build(plan.programs.map((p) => runs.get(p)!)));
        } catch (e) {
          errors.push(`${where}: ${(e as Error).message}`);
        }
      }
      if (questions.length < plans[lang].length) continue;
      try {
        const pool = parseQuiz(raw[lang], { questions: questions.map(stored) });
        errors.push(...sameQuestions(pool.questions).map((p) => `${where}: ${p}`));
      } catch (e) {
        errors.push(`${where}: ${(e as Error).message}`);
        continue;
      }

      const file = quizFiles(slug, lang).made;
      const name = path.relative(process.env.INIT_CWD ?? process.cwd(), file);
      const before = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
      if (questions.length === 0) {
        if (before === null) continue;
        if (check) errors.push(`${name} is left over: its lesson has no templates`);
        else fs.rmSync(file);
        continue;
      }
      const json = JSON.stringify({
        note: `Made by npm run make:quiz from the templates in ${slug}-quiz.json; don't edit it by hand.`,
        questions: questions.map(stored),
      });
      const after = await prettier.format(json, {
        ...(await prettier.resolveConfig(file)),
        filepath: file,
      });
      made += questions.length;
      if (after === before) continue;
      if (check) errors.push(`${name} is out of date: run npm run make:quiz`);
      else {
        fs.writeFileSync(file, after);
        console.log(`wrote ${name} (${questions.length} questions)`);
      }
    }
  }

  if (errors.length > 0) {
    console.error(errors.join('\n'));
    process.exit(1);
  }
  console.log(`${made} made questions from ${lessons.length} lessons, all as they should be`);
}

await main();
