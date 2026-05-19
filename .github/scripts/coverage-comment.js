import fs from 'fs';

const coveragePath = './coverage/coverage-summary.json';

function errorComment(message) {
  return `## 📊 Code Coverage Report\n\n❌ **Coverage report could not be generated**\n\n${message}`;
}

function icon(pct) {
  if (pct >= 90) return '🟢';
  if (pct >= 70) return '🟡';
  return '🔴';
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

  console.log(`## 📊 Code Coverage Report

| Metric | Coverage | Status | Covered / Total |
|--------|----------|--------|-----------------|
| Lines | ${fmt(t.lines.pct)} | ${icon(t.lines.pct)} | ${t.lines.covered}/${t.lines.total} |
| Functions | ${fmt(t.functions.pct)} | ${icon(t.functions.pct)} | ${t.functions.covered}/${t.functions.total} |
| Branches | ${fmt(t.branches.pct)} | ${icon(t.branches.pct)} | ${t.branches.covered}/${t.branches.total} |
| Statements | ${fmt(t.statements.pct)} | ${icon(t.statements.pct)} | ${t.statements.covered}/${t.statements.total} |`);
} catch (e) {
  console.log(errorComment(e.message));
}
