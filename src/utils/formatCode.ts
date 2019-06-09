// import prettier from 'prettier';
const prettier = require('prettier/standalone');
// const prettierBabel = require('prettier/parser-babel');
const prettierBabylon = require('prettier/parser-babylon');

export default function formatCode(code: string) {
  const options = {
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
  };
  return prettier.format(code, options);
}
