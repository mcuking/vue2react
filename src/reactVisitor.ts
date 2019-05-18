import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';

import { App } from './types';
import { genPropType, genDefaultProps } from './utils';

export default class reactVisitor {
  app: App;

  constructor(app: any) {
    this.app = app;
  }

  genImports(path: NodePath<t.Program>) {
    this.app.script.imports.forEach(node => {
      node.leadingComments = [];
      path.node.body.unshift(node);
    });

    if (Object.keys(this.app.script.props).length) {
      const importPropTypes = t.importDeclaration(
        [t.importDefaultSpecifier(t.identifier('PropTypes'))],
        t.stringLiteral('PropType')
      );
      path.node.body.unshift(importPropTypes);
    }

    const importReact = t.importDeclaration(
      [
        t.importDefaultSpecifier(t.identifier('react')),
        t.importSpecifier(t.identifier('Component'), t.identifier('Component'))
      ],
      t.stringLiteral('react')
    );
    path.node.body.unshift(importReact);
  }

  genStaticProps(path: NodePath<t.ClassBody>) {
    path.node.body.push(genPropType(this.app.script.props));
    path.node.body.push(genDefaultProps(this.app.script.props));
  }

  genClassMethods(path: NodePath<t.ClassBody>) {
    const methods = { ...this.app.script.methods, ...this.app.script.computed };
    for (const name in methods) {
      if (methods.hasOwnProperty(name)) {
        path.node.body.push(methods[name]);
      }
    }
  }

  genRenderMethods(path: NodePath<t.ClassBody>) {
    // process computed props, call the computed methods in render function
    let blocks: t.Node[] = [];
    for (const name in this.app.script.computed) {
      if (this.app.script.computed.hasOwnProperty(name)) {
        blocks.push(
          t.expressionStatement(
            t.callExpression(
              t.memberExpression(t.thisExpression(), t.identifier(name)),
              []
            )
          )
        );
      }
    }

    // generate render function
    const render = t.classMethod(
      'method',
      t.identifier('render'),
      [],
      t.blockStatement(blocks as t.Statement[])
    );

    path.node.body.push(render);
  }
}
