const compiler = require('vue-template-compiler');

import fs from 'fs';
import path from 'path';
import { parse } from '@babel/parser';
import generate from '@babel/generator';
import template from '@babel/template';
import * as t from '@babel/types';

import vueIterator from './vueIterator';
import reactIterator from './reactIterator';

export default function transform(src: string, target: string) {
  const sourceCode = fs.readFileSync(path.resolve(__dirname, src), 'utf8');
  const result = compiler.parseComponent(sourceCode, {
    pad: 'line'
  });

  const template = result.template.content;
  const js = result.script.content;

  const templateAst = compiler.compile(template).ast;
  const vast = parse(js, {
    sourceType: 'module'
  });

  const script = vueIterator(vast);

  const app = {
    template: {
      ast: templateAst
    },
    script
  };

  const rast = componentTemplateBuilder(app);

  const targetAst = reactIterator(rast, app);
  console.log((targetAst as t.File).program.body, 'targetAst');
  const targetCode = generate(targetAst).code;

  fs.writeFileSync(path.resolve(__dirname, target), targetCode);
}

function componentTemplateBuilder(app: any) {
  const componentTemplate = `
    export default class NAME extends Component {
      constructor(props) {
        super(props);
        this.state=STATE;
      }
    }
  `;

  const buildRequire = template(componentTemplate);

  const node = buildRequire({
    NAME: app.script.name || 'Mod',
    STATE: t.objectExpression(app.script.data._statements)
  });

  return t.file(t.program([node as any]));
}

transform('../example/cool.vue', '../example/cool.jsx');
