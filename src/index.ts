const compiler = require('vue-template-compiler');

import fs from 'fs';
import path from 'path';
import generate from '@babel/generator';

import scriptIterator from './scriptIterator';
import templateIterator from './templateIterator';
import reactIterator from './reactIterator';
import reactTemplateBuilder from './reactTemplateBuilder';
import { anyObject } from './types';
import { log } from './utils';

export default function transform(
  src: string,
  targetPath: string,
  targetFilename: string
) {
  const sourceCode = fs.readFileSync(path.resolve(__dirname, src), 'utf8');
  const result = compiler.parseComponent(sourceCode, {
    pad: 'line'
  });

  if (result.errors.length > 0) {
    return result.errors.forEach((error: string) => log(error));
  }

  const preScript = result.script.content;
  const preTemplate = result.template.content;
  const { styles } = result;

  const hasStyle = styles.length > 0;

  const script = scriptIterator(preScript);
  const template = templateIterator(preTemplate, script);

  const app = {
    script,
    template
  };

  const rast = reactTemplateBuilder(app);

  const targetAst = reactIterator(rast, app, hasStyle);
  const targetCode = generate(targetAst).code;

  // write react js file
  if (!/\.js/.test(targetFilename)) {
    targetFilename += '.js';
  }

  fs.writeFileSync(
    path.resolve(__dirname, path.join(targetPath, targetFilename)),
    targetCode
  );

  // write react css file, delete null line in the start and end
  if (hasStyle) {
    const styleContent = result.styles
      .map((style: anyObject) => style.content.replace(/^\s+|\s+$/g, ''))
      .join('\n');

    fs.writeFileSync(
      path.resolve(__dirname, path.join(targetPath, 'index.css')),
      styleContent
    );
  }
}

transform('../example/cool.vue', '../example', 'hot');
