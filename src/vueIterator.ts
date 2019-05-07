import traverse, { NodePath } from '@babel/traverse';
import * as t from '@babel/types';

import vueVisitor from './vueVisitor';
import { cycle } from './utils';

export default function vueIterator(vast: t.Node | t.Node[]) {
  const visitor = new vueVisitor();

  traverse(vast, {
    ImportDeclaration(path: NodePath<t.ImportDeclaration>) {
      visitor.importHandler(path.node);
    },

    ObjectMethod(path: NodePath<t.ObjectMethod>) {
      const parent = path.parentPath.parent;
      const name = (path.node.key as t.Identifier).name;
      if (parent && t.isExportDefaultDeclaration(parent)) {
        switch (name) {
          case 'data':
            visitor.dataHandler(path.node.body.body, false);
            break;
          case 'created':
          case 'mounted':
          case 'updated':
          case 'beforeDestroy':
          case 'errorCaptured':
            visitor.methodsHandler(cycle[name], [], path.node.body);
          default:
            break;
        }
      }
    },

    ObjectProperty(path: NodePath<t.ObjectProperty>) {
      const parent = path.parentPath.parent;
      const name = (path.node.key as t.Identifier).name;
      if (parent && t.isExportDefaultDeclaration(parent)) {
        switch (name) {
          case 'name':
            const name = (path.node.value as t.StringLiteral).value;
            visitor.nameHandler(name);
            break;
          case 'data':
            const node = path.node.value;
            if (t.isArrowFunctionExpression(node)) {
              if ((node.body as t.BlockStatement).body) {
                visitor.dataHandler(
                  (node.body as t.BlockStatement).body,
                  false
                );
              } else {
                visitor.dataHandler(
                  (node.body as t.ObjectExpression).properties,
                  true
                );
              }
            }
            break;
          case 'methods':
            const nodeList = (path.node.value as t.ObjectExpression)
              .properties as t.ObjectMethod[];
            nodeList.forEach(node => {
              visitor.methodsHandler(
                (node.key as t.Identifier).name,
                node.params,
                node.body
              );
            });
            break;
          case 'computed':
            const nodeList2 = (path.node.value as t.ObjectExpression)
              .properties as t.ObjectMethod[];
            nodeList2.forEach(node => {
              visitor.computedHandler(
                (node.key as t.Identifier).name,
                node.body
              );
            });
            break;
          default:
            break;
        }
      }
    }
  });

  return visitor.script;
}
