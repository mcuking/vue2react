const compiler = require('vue-template-compiler');

import jsxElementGenerator from './jsxElementGenerator';
import logger from './utils/logUtil';
import { Template } from './types';

export default function templateIterator(template: string): Template {
  const { ast, errors, tips } = compiler.compile(template, {
    whitespace: 'condense'
  });

  if (errors.length > 0) {
    return errors.forEach((error: string) => {
      logger.log(`${error} ---vue-template-compiler: compile`, 'error');
    });
  }

  if (tips.length > 0) {
    tips.forEach((tip: string) => {
      logger.log(`${tip} ---vue-template-compiler: compile`, 'tip');
    });
  }

  return jsxElementGenerator(ast, null, new Set());
}
