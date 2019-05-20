const compiler = require('vue-template-compiler');

import fs from 'fs';
import path from 'path';
import generate from '@babel/generator';

import scriptIterator from './scriptIterator';
import templateIterator from './templateIterator';
import reactIterator from './reactIterator';
import reactTemplateBuilder from './reactTemplateBuilder';
import { log } from './utils';

export default function transform(src: string, target: string) {
  const sourceCode = fs.readFileSync(path.resolve(__dirname, src), 'utf8');
  const result = compiler.parseComponent(sourceCode, {
    pad: 'line'
  });

  if (result.errors.length > 0) {
    result.errors.forEach((error: string) => log(error));
  }

  const preScript = result.script.content;
  const preTemplate = result.template.content;

  const script = scriptIterator(preScript);
  const template = templateIterator(preTemplate, script);

  const app = {
    script,
    template
  };

  const rast = reactTemplateBuilder(app);

  const targetAst = reactIterator(rast, app);
  const targetCode = generate(targetAst).code;

  fs.writeFileSync(path.resolve(__dirname, target), targetCode);
}

transform('../example/cool.vue', '../example/cool.jsx');
