import expo from 'eslint-config-expo/flat.js';

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/.expo/**',
      '**/android/**',
      '**/ios/**',
      '**/dist/**',
      '**/web-build/**',
      '**/.next/**',
    ],
  },
  ...expo,
];
