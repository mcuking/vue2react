const compiler = require('vue-template-compiler');

import jsxElementGenerator from './jsxElementGenerator';
import { log } from './utils/tools';
import { Script } from './types';

export default function templateIterator(template: string, script: Script) {
  const { ast, errors, tips } = compiler.compile(template, {
    whitespace: 'condense'
  });

  if (errors.length > 0) {
    return errors.forEach((error: string) => {
      log(`${error} ---vue-template-compiler: compile`);
    });
  }

  if (tips.length > 0) {
    tips.forEach((tip: string) => {
      log(`${tip} ---vue-template-compiler: compile`, 'tip');
    });
  }

  return jsxElementGenerator(ast, null);
}
