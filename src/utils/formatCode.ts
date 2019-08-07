const prettier = require('prettier/standalone');
const prettierHtml = require('prettier/parser-html');
const prettierBabylon = require('prettier/parser-babylon');

import { anyObject } from './types';

const matchAndReplace = (str: string) =>
  str.replace(RegExp('(<input.*?)(></input>)', 'g'), '$1/>');

const toGB2312 = (str: string) => unescape(str.replace(/\\u/gi, '%u'));

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

  if (type === 'react') {
    code = matchAndReplace(toGB2312(code));
  }

  return prettier.format(code, options[type]);
}
