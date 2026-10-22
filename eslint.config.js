import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import unusedImports from 'eslint-plugin-unused-imports';
import path from 'node:path';
import { defineConfig, globalIgnores } from 'eslint/config';

// The framework/<package>/ folder a file is in, or null outside one
function frameworkPackage(file) {
  const [top, name, ...rest] = path.relative(import.meta.dirname, file).split(path.sep);
  return top === 'framework' && rest.length > 0
    ? path.join(import.meta.dirname, 'framework', name) + path.sep
    : null;
}

// A framework package is published on its own, so a relative import that
// leaves its folder (into the app, another package or the repo) breaks there
const stayInside = {
  meta: {
    type: 'problem',
    messages: {
      outside: 'A framework package imports only from inside its own folder: {{source}}',
    },
  },
  create(context) {
    const root = frameworkPackage(context.filename);
    const check = (node) => {
      const source = node?.source?.value;
      if (!root || typeof source !== 'string' || !/^[./]/.test(source)) return;
      const target = path.resolve(path.dirname(context.filename), source);
      if (!`${target}${path.sep}`.startsWith(root)) {
        context.report({ node: node.source, messageId: 'outside', data: { source } });
      }
    };
    return {
      ImportDeclaration: check,
      ExportNamedDeclaration: check,
      ExportAllDeclaration: check,
      ImportExpression: check,
    };
  },
};

export default defineConfig([
  globalIgnores(['**/dist', 'coverage', 'e2e', 'playwright-report', 'test-results', '.claude']),
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'unused-imports': unusedImports,
    },
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^_' },
      ],
    },
  },
  {
    files: ['apps/ui/**/*.{ts,tsx}', 'packages/**/*.ts'],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['apps/api/**/*.ts'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['framework/**/*.{ts,tsx}'],
    plugins: { framework: { rules: { 'stay-inside': stayInside } } },
    rules: {
      'framework/stay-inside': 'error',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@cyberstars/*'],
              message:
                'Framework packages never import the app or its shared and content packages.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.js'],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 2020,
      globals: { ...globals.node },
      sourceType: 'module',
    },
  },
]);
