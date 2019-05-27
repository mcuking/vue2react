const compiler = require('vue-template-compiler');

import fs from 'fs';
import path from 'path';
import generate from '@babel/generator';

import scriptIterator from './scriptIterator';
import templateIterator from './templateIterator';
import reactIterator from './reactIterator';
import reactTemplateBuilder from './reactTemplateBuilder';
import output from './output';
import { log } from './utils/tools';
import { anyObject } from './types';

export default function transform(
  src: string,
  targetPath: string,
  dist: string
) {
  const sourceCode = fs.readFileSync(path.resolve(__dirname, src), 'utf8');
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

  // write react js file
  output(targetCode, targetPath, true);

  // write react css file, delete null line in the start and end
  if (hasStyle) {
    const styleContent = result.styles
      .map((style: anyObject) => style.content.replace(/^\s+|\s+$/g, ''))
      .join('\n');
    output(styleContent, path.resolve(dist, 'index.css'), false);
  }
}
