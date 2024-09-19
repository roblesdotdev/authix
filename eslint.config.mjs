import { fixupPluginRules } from '@eslint/compat'
import globals from 'globals'

const ERROR = 'error'
const WARN = 'warn'

const config = [
  {
    ignores: [
      '**/.vercel/**',
      '**/.netlify/**',
      '**/functions/**',
      '**/.cache/**',
      '**/node_modules/**',
      '**/build/**',
      '**/public/build/**',
      '**/playwright-report/**',
      '**/server-build/**',
      '**/dist/**',
    ],
  },

  // all files
  {
    plugins: {
      import: (await import('eslint-plugin-import-x')).default,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'no-unexpected-multiline': ERROR,
      'no-warning-comments': [
        ERROR,
        { terms: ['FIXME'], location: 'anywhere' },
      ],
      'import/no-duplicates': [WARN, { 'prefer-inline': true }],
      'import/order': [
        WARN,
        {
          alphabetize: { order: 'asc', caseInsensitive: true },
          pathGroups: [{ pattern: '#*/**', group: 'internal' }],
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
        },
      ],
    },
  },

  // JSX/TSX files
  {
    files: ['**/*.tsx', '**/*.jsx'],
    plugins: {
      react: (await import('eslint-plugin-react')).default,
    },
    languageOptions: {
      parser: (await import('typescript-eslint')).parser,
      parserOptions: {
        jsx: true,
      },
    },
    rules: {
      'react/jsx-key': WARN,
    },
  },

  // react-hook rules are applicable in ts/js/tsx/jsx, but only with React as a
  // dep
  {
    files: ['**/*.ts?(x)', '**/*.js?(x)'],
    plugins: {
      'react-hooks': fixupPluginRules(
        await import('eslint-plugin-react-hooks'),
      ),
    },
    rules: {
      'react-hooks/rules-of-hooks': ERROR,
      'react-hooks/exhaustive-deps': WARN,
    },
  },

  // JS and JSX files
  {
    files: ['**/*.js?(x)'],
    rules: {
      // most of these rules are useful for JS but not TS because TS handles these better
      // if it weren't for https://github.com/import-js/eslint-plugin-import/issues/2132
      // we could enable this :(
      // 'import/no-unresolved': ERROR,
      'no-unused-vars': [
        WARN,
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^ignored',
        },
      ],
    },
  },

  // TS and TSX files
  {
    files: ['**/*.ts?(x)'],
    languageOptions: {
      parser: (await import('typescript-eslint')).parser,
      parserOptions: {
        projectService: true,
      },
    },
    plugins: {
      '@typescript-eslint': (await import('typescript-eslint')).plugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        WARN,
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^ignored',
        },
      ],
      'import/consistent-type-specifier-style': [WARN, 'prefer-inline'],
      '@typescript-eslint/consistent-type-imports': [
        WARN,
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: true,
          fixStyle: 'inline-type-imports',
        },
      ],

      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: false },
      ],

      '@typescript-eslint/no-floating-promises': 'error',
    },
  },
]

export default config
