import { parse } from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import * as t from '@babel/types';

import ScriptVisitor from './scriptVisitor';

export default function scriptIterator(script: string) {
  // AST for script in Vue
  const vast = parse(script, {
    sourceType: 'module'
  });

  const visitor = new ScriptVisitor();

  // collect props and data key firstly
  traverse(vast, {
    ObjectMethod(path: NodePath<t.ObjectMethod>) {
      const parent = path.parentPath.parent;
      const name = (path.node.key as t.Identifier).name;
      if (parent && t.isExportDefaultDeclaration(parent)) {
        switch (name) {
          case 'data':
            // Support following syntax:
            // data() => { return {a: 1}}
            visitor.dataHandler(path.node.body.body, false);
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
          case 'data':
            const node = path.node.value;
            if (t.isArrowFunctionExpression(node)) {
              if ((node.body as t.BlockStatement).body) {
                // Support following syntax:
                // data: () => { return {a: 1}}
                visitor.dataHandler(
                  (node.body as t.BlockStatement).body,
                  false
                );
              } else {
                // Support following syntax:
                // data: () => ({a: 1})
                visitor.dataHandler(
                  (node.body as t.ObjectExpression).properties,
                  true
                );
              }
            } else if (t.isFunctionExpression(node)) {
              // Support following syntax:
              // data: function () => { return {a: 1}}
              visitor.dataHandler(node.body.body, false);
            }
            break;
          case 'props':
            visitor.propsHandler(path);
            break;
          default:
            break;
        }
      }
    }
  });

  // collect import, name, methods, computed, cycle...
  traverse(vast, {
    ImportDeclaration(path: NodePath<t.ImportDeclaration>) {
      visitor.importHandler(path);
    },

    ObjectMethod(path: NodePath<t.ObjectMethod>) {
      const parent = path.parentPath.parent;
      const name = (path.node.key as t.Identifier).name;
      if (parent && t.isExportDefaultDeclaration(parent)) {
        switch (name) {
          case 'created':
          case 'mounted':
          case 'update':
          case 'beforeDestroy':
          case 'errorCaptured':
            // Support following syntax:
            // created() {...}
            visitor.methodsHandler(path, true);
            break;
          default:
            break;
        }
      } else if (parent && t.isObjectProperty(parent)) {
        const parentName = (parent.key as t.Identifier).name;
        switch (parentName) {
          case 'methods':
            // Support following syntax:
            // methods: { handleClick() {...} }
            visitor.methodsHandler(path, false);
            break;
          case 'computed':
            // Support following syntax:
            // computed: { reverseName() {...} }
            visitor.computedHandler(path);
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
            visitor.nameHandler(path);
            break;
          default:
            break;
        }
      }
    }
  });

  return visitor.script;
}
