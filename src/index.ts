const compiler = require('vue-template-compiler');

import fs from 'fs';
import path from 'path';
import generate from '@babel/generator';

import scriptIterator from './scriptIterator';
import templateIterator from './templateIterator';
import reactIterator from './reactIterator';
import reactTemplateBuilder from './reactTemplateBuilder';
import { log } from './utils/tools';
import { anyObject } from './types';

export function transformCode(sourceCode: string) {
  const result = compiler.parseComponent(sourceCode, {
    pad: 'line'
  });

  if (result.errors.length > 0) {
    return result.errors.forEach((error: string) =>
      log(`${error} ---vue-template-compiler: parseComponent`)
    );
  }

  const preScript = result.script.content;
  const preTemplate = result.template.content;
  const styles = result.styles;

  const hasStyle = styles.length > 0;

  const script = scriptIterator(preScript);
  const template = templateIterator(preTemplate);

  const app = {
    script,
    template
  };

  const rast = reactTemplateBuilder(app);

  const targetAst = reactIterator(rast, app, hasStyle);
  const targetCode = generate(targetAst).code;
  return [targetCode, styles];
}

export function transformFile(src: string, targetPath: string, dist: string) {
  const sourceCode = fs.readFileSync(path.resolve(__dirname, src), 'utf8');

  const [script, styles] = transformCode(sourceCode);

  // write react js file
  fs.writeFileSync(targetPath, script);

  // write react css file, delete null line in the start and end
  if (styles.length > 0) {
    const styleContent = styles
      .map((style: anyObject) => style.content.replace(/^\s+|\s+$/g, ''))
      .join('\n');
    fs.writeFileSync(path.resolve(dist, 'index.css'), styleContent);
  }
}
