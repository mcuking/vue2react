import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';

import { App } from './utils/types';
import { genPropTypes, genDefaultProps } from './utils/tools';

export default class ReactVisitor {
  app: App;

  constructor(app: any) {
    this.app = app;
  }

  genImports(path: NodePath<t.Program>, hasStyle: boolean) {
    // add 'import ./index.css'
    if (hasStyle) {
      const importCSS = t.importDeclaration([], t.stringLiteral('./index.css'));
      path.node.body.unshift(importCSS);
    }

    this.app.script.imports.forEach(node => {
      node.leadingComments = [];
      path.node.body.unshift(node);
    });

    // add 'import PropTypes from "PropType";'
    if (Object.keys(this.app.script.props).length) {
      const importPropTypes = t.importDeclaration(
        [t.importDefaultSpecifier(t.identifier('PropTypes'))],
        t.stringLiteral('prop-types')
      );
      path.node.body.unshift(importPropTypes);
    }

    // add 'import React, { Component } from "react";'
    const importReact = t.importDeclaration(
      [
        t.importDefaultSpecifier(t.identifier('React')),
        t.importSpecifier(t.identifier('Component'), t.identifier('Component'))
      ],
      t.stringLiteral('react')
    );
    path.node.body.unshift(importReact);
  }

  genStaticProps(path: NodePath<t.ClassBody>) {
    path.node.body.push(genPropTypes(this.app.script.props));
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
    let blocks: t.Node[] = [];

    let dataProperties: t.ObjectProperty[] = [];
    let propProperties: t.ObjectProperty[] = [];
    let methodProperties: t.ObjectProperty[] = [];
    let computed: string[] = [];

    this.app.template.attrsCollector.forEach(attr => {
      if (this.app.script.data[attr]) {
        dataProperties.push(
          t.objectProperty(t.identifier(attr), t.identifier(attr), false, true)
        );
      } else if (this.app.script.props[attr]) {
        propProperties.push(
          t.objectProperty(t.identifier(attr), t.identifier(attr), false, true)
        );
      } else if (this.app.script.methods[attr]) {
        methodProperties.push(
          t.objectProperty(t.identifier(attr), t.identifier(attr), false, true)
        );
      } else if (this.app.script.computed[attr]) {
        computed.push(attr);
      }
      return;
    });

    if (dataProperties.length > 0) {
      blocks.push(
        t.variableDeclaration('const', [
          t.variableDeclarator(
            t.objectPattern(dataProperties as any),
            t.memberExpression(t.thisExpression(), t.identifier('state'))
          )
        ])
      );
    }

    if (propProperties.length > 0) {
      blocks.push(
        t.variableDeclaration('const', [
          t.variableDeclarator(
            t.objectPattern(propProperties as any),
            t.memberExpression(t.thisExpression(), t.identifier('props'))
          )
        ])
      );
    }

    if (methodProperties.length > 0) {
      blocks.push(
        t.variableDeclaration('const', [
          t.variableDeclarator(
            t.objectPattern(methodProperties as any),
            t.thisExpression()
          )
        ])
      );
    }

    if (computed.length > 0) {
      computed.forEach(name => {
        blocks.push(
          t.variableDeclaration('const', [
            t.variableDeclarator(
              t.identifier(name),
              t.callExpression(
                t.memberExpression(t.thisExpression(), t.identifier(name)),
                []
              )
            )
          ])
        );
      });
    }

    blocks.push(t.returnStatement(this.app.template.ast));

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
