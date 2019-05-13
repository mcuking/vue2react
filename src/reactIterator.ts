import traverse, { NodePath } from '@babel/traverse';
import * as t from '@babel/types';

import reactVisitor from './reactVisitor';

export default function reactIterator(rast: t.Node, app: any) {
  const visitor = new reactVisitor(app);

  traverse(rast, {
    Program(path: NodePath<t.Program>) {
      visitor.genImports(path);
    },

    ClassBody(path: NodePath<t.ClassBody>) {
      visitor.genStaticProps(path);
      visitor.genClassMethods(path);
      visitor.genRenderMethods(path);
    }
  });

  return rast;
}
