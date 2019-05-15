import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';

import { Script } from './types';

/*
  Support following syntax:
  this.name -> this.state.name/this.props.name
  this.name = 'tom' -> this.setState({name: 'jerry'})
  const { name } = this -> const { name } = this.state
  ...
*/

function getThisIdentify(script: Script, key: string) {
  if (script.data[key]) {
    return t.identifier('state');
  } else if (script.props[key]) {
    return t.identifier('props');
  }
  return null;
}

const replaceThisExpression = {
  // Support following syntax:
  // this.name -> this.props.name / this.state.name
  ThisExpression(this: any, tPath: NodePath<t.ThisExpression>) {
    if (t.isMemberExpression(tPath.parent)) {
      // Support following syntax:
      // const name = this.name;
      const key = ((tPath.parent as t.MemberExpression)
        .property as t.Identifier).name;
      const identify = getThisIdentify(this.script, key);
      if (identify) {
        tPath.replaceWith(t.memberExpression(t.thisExpression(), identify));
      }
    } else {
      // todo...
      // such as const { name } = this;
    }
    tPath.stop();
  }
};

export default function formatThisExpression(
  path: NodePath<t.ObjectMethod>,
  script: Script
): t.BlockStatement {
  let block: t.Statement[] = [];
  path.traverse(
    {
      VariableDeclaration(path: NodePath<t.VariableDeclaration>) {
        // Support following syntax:
        // const name = this.name;
        path.traverse(replaceThisExpression, { script });
        block.push(path.node);
      },
      ExpressionStatement(path: NodePath<t.ExpressionStatement>) {
        const expression = path.node.expression;
        if (t.isCallExpression(expression)) {
          // Support following syntax:
          // console.log(this.name);
          path.traverse(replaceThisExpression, { script });
        } else if (t.isAssignmentExpression(expression)) {
          // Not support following syntax:
          // this.user.name = 'tom'
          if (
            t.isMemberExpression(expression.left) &&
            t.isThisExpression(expression.left.object)
          ) {
            // Support following syntax:
            // this.name = 'tom' -> this.setState({name: 'tom'})
            path.node.expression = t.callExpression(
              t.memberExpression(t.thisExpression(), t.identifier('setState')),
              [
                t.objectExpression([
                  t.objectProperty(expression.left.property, expression.right)
                ])
              ]
            );
          } else {
            path.traverse(replaceThisExpression, { script });
          }
        }
        block.push(path.node);
      },
      ReturnStatement(path: NodePath<t.ReturnStatement>) {
        // Support following syntax:
        // return this.name
        path.traverse(replaceThisExpression, { script });
        block.push(path.node);
      }
    },
    { script, block }
  );

  return t.blockStatement(block);
}
