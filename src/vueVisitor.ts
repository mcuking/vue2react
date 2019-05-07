import * as t from '@babel/types';

import { Script } from './types';

export default class vueVisitor {
  script: Script;

  constructor() {
    this.script = {
      imports: [],
      name: '',
      data: {},
      props: {},
      methods: {},
      computed: {}
    };
  }

  importHandler(node: t.ImportDeclaration) {
    this.script.imports.push(node);
  }

  nameHandler(name: string) {
    this.script.name = name;
  }

  dataHandler(body: t.Node[], isObject: boolean) {
    let propNodes: any[] = [];
    if (isObject) {
      this.script.data._statements = [].concat(body as any);
      propNodes = body as t.ObjectProperty[];
    } else {
      body.forEach(child => {
        if (
          t.isReturnStatement(child) &&
          t.isObjectExpression(child.argument)
        ) {
          this.script.data._statements = [].concat(child.argument
            .properties as any);
          propNodes = child.argument.properties;
        }
      });
    }
    propNodes.forEach(propNode => {
      this.script.data[propNode.key.name] = propNode;
    });
  }

  methodsHandler(name: string, params: any[], body: t.BlockStatement) {
    // transform vue method and cylce to react method and cycle
    if (name === 'componentDidCatch') {
      params = [t.identifier('error'), t.identifier('info')];
    }
    const classMethod = t.classMethod(
      'method',
      t.identifier(name),
      params,
      body
    );
    this.script.methods[name] = classMethod;
  }

  computedHandler(name: string, body: t.BlockStatement) {
    this.script.computed[name] = body;
  }
}
