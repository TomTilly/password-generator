const prettierSettings = require('./.prettierrc.cjs');

module.exports = {
   root: true,
   parser: '@typescript-eslint/parser',
   parserOptions: {
      tsconfigRootDir: __dirname,
      project: ['./tsconfig.json'],
   },
   overrides: [
      {
         files: ['./tsconfig.node.json'],
         parserOptions: {
            project: ['./tsconfig.node.json']
         }
      }
   ],
   plugins: ['@typescript-eslint', 'prettier'],
   extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:@typescript-eslint/recommended-requiring-type-checking',
      'prettier',
   ],
   rules: {
      'eqeqeq': 'error',
      "@typescript-eslint/no-non-null-assertion": "warn",
      'prettier/prettier': [
         'error',
         {
            ...prettierSettings,
         },
      ],
   },
};