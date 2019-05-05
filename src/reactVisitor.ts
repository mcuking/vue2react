import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';

import { App } from './types';

export default class reactVisitor {
  app: App;

  constructor(app: any) {
    this.app = app;
  }

  genImports(path: NodePath<t.Program>) {
    this.app.script.imports.forEach(node => {
      // 去除顶部 template 的影响
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

  genClassMethods(path: NodePath<t.ClassBody>) {
    for (const name in this.app.script.methods) {
      if (this.app.script.methods.hasOwnProperty(name)) {
        const classMethod = this.app.script.methods[name];
        const nodeLists = path.node.body;
        nodeLists.push(classMethod);
      }
    }
  }
}
