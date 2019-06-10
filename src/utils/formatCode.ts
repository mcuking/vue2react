const prettier = require('prettier/standalone');
const prettierBabylon = require('prettier/parser-babylon');
const prettierHtml = require('prettier/parser-html');

import { anyObject } from '../types';

export default function formatCode(code: string, type: string) {
  const options: anyObject = {
    vue: {
      parser: 'vue',
      plugins: [prettierHtml]
    },
    react: {
      parser: 'babel',
      plugins: [prettierBabylon],
      arrowParens: 'avoid',
      bracketSpacing: true,
      htmlWhitespaceSensitivity: 'css',
      insertPragma: false,
      jsxBracketSameLine: false,
      jsxSingleQuote: false,
      printWidth: 80,
      proseWrap: 'preserve',
      quoteProps: 'as-needed',
      requirePragma: false,
      semi: true,
      singleQuote: false,
      tabWidth: 2,
      trailingComma: 'none',
      useTabs: false
    }
  };

  return prettier.format(code, options[type]);
}
