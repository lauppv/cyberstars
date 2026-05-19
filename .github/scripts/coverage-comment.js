import fs from 'fs';

const coveragePath = './coverage/coverage-summary.json';

function errorComment(message) {
  return `## Code Coverage Report\n\n**Coverage report could not be generated**\n\n${message}`;
}

function emoji(pct) {
  if (pct >= 90) return 'green';
  if (pct >= 70) return 'yellow';
  return 'red';
}

function fmt(pct) {
  return `${pct.toFixed(1)}%`;
}

try {
  if (!fs.existsSync(coveragePath)) {
    console.log(errorComment('Coverage summary file not found. Tests may not have run successfully.'));
    process.exit(0);
  }

  const coverage = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
  const t = coverage.total;

  console.log(`## Code Coverage Report

| Metric | Coverage | Covered / Total |
|--------|----------|-----------------|
| Lines | ![](https://img.shields.io/badge/${fmt(t.lines.pct)}-${emoji(t.lines.pct)}) | ${t.lines.covered}/${t.lines.total} |
| Functions | ![](https://img.shields.io/badge/${fmt(t.functions.pct)}-${emoji(t.functions.pct)}) | ${t.functions.covered}/${t.functions.total} |
| Branches | ![](https://img.shields.io/badge/${fmt(t.branches.pct)}-${emoji(t.branches.pct)}) | ${t.branches.covered}/${t.branches.total} |
| Statements | ![](https://img.shields.io/badge/${fmt(t.statements.pct)}-${emoji(t.statements.pct)}) | ${t.statements.covered}/${t.statements.total} |`);
} catch (e) {
  console.log(errorComment(e.message));
}
