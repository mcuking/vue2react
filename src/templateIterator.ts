const compiler = require('vue-template-compiler');

import traverse, { NodePath } from '@babel/traverse';
import * as t from '@babel/types';

import { log } from './utils';
import { Script } from './types';

export default function templateIterator(template: string, script: Script) {
  const { ast, render, staticRenderFns, errors, tips } = compiler.compile(
    template
  );

  if (errors.length > 0) {
    errors.forEach((error: string) => {
      log(error);
    });
  }

  if (tips.length > 0) {
    tips.forEach((tip: string) => {
      log(tip);
    });
  }

  return undefined;
}
