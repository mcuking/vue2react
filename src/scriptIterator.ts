import traverse, { NodePath } from '@babel/traverse';
import * as t from '@babel/types';

import scriptVisitor from './scriptVisitor';

export default function scriptIterator(ast: t.Node | t.Node[]) {
  const visitor = new scriptVisitor(ast);

  traverse(ast, {
    ObjectMethod(path: NodePath<t.ObjectMethod>) {
      const parent = path.parentPath.parent;
      const name = (path.node.key as t.Identifier).name;
      if (parent && t.isExportDefaultDeclaration(parent)) {
        switch (name) {
          case 'data':
            const body = path.node.body.body;
            visitor.dataHandler(body, false);
            break;
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
          default:
            break;
        }
      }
    }
  });

  return visitor.script;
}
