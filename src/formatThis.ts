import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';

import { Script } from './utils/types';

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
  ThisExpression(this: any, subpath: NodePath<t.ThisExpression>) {
    if (subpath.parent && t.isMemberExpression(subpath.parent)) {
      // Support following syntax:
      // this.name = 'Tom' -> this.setState({name: 'Tom'})
      if (
        subpath.parentPath.parent &&
        t.isAssignmentExpression(subpath.parentPath.parent) &&
        subpath.parentPath.parent.left === subpath.parent &&
        subpath.parentPath.parent.operator === '='
      ) {
        (subpath.parentPath.parentPath
          .parent as t.ExpressionStatement).expression = t.callExpression(
          t.memberExpression(t.thisExpression(), t.identifier('setState')),
          [
            t.objectExpression([
              t.objectProperty(
                subpath.parent.property,
                subpath.parentPath.parent.right
              )
            ])
          ]
        );
      } else {
        // Support following syntax:
        // const name = this.name -> cosnt name = this.props.name / const name = this.state.name
        const key = (subpath.parent.property as t.Identifier).name;
        const identify = getThisIdentify(this.script, key);
        if (identify) {
          subpath.replaceWith(t.memberExpression(t.thisExpression(), identify));
        }
      }
    }

    // todo...
    // such as const { name } = this -> this.props.name / this.state.name
    subpath.stop();
  }
};

export default function formatThisExpression(
  path: NodePath<t.ObjectMethod>,
  script: Script
): t.BlockStatement {
  let block: t.Statement[] = [];
  path.traverse(
    {
      enter(subpath: NodePath<any>) {
        subpath.traverse(replaceThisExpression, { script });
        if (subpath.parentPath.parent === path.node) {
          block.push(subpath.node);
        }
      }
    },
    { script, block }
  );

  return t.blockStatement(block);
}
