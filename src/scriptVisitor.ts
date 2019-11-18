import * as t from '@babel/types';
import { NodePath } from '@babel/traverse';

import { cycle } from './utils/tools';
import logger from './utils/logUtil';
import { Script } from './utils/types';
import formatThisExpression from './formatThis';

export default class ScriptVisitor {
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

  importHandler(path: NodePath<t.ImportDeclaration>) {
    this.script.imports.push(path.node);
  }

  nameHandler(path: NodePath<t.ObjectProperty>) {
    const name = (path.node.value as t.StringLiteral).value;
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

  methodsHandler(path: NodePath<t.ObjectMethod>, isCycle: boolean) {
    const name = isCycle
      ? cycle[(path.node.key as t.Identifier).name]
      : (path.node.key as t.Identifier).name;
    let params = isCycle ? [] : path.node.params;
    const blockStatement = formatThisExpression(path, this.script);

    // transform vue method and cylce to react method and cycle
    if (name === 'componentDidCatch') {
      params = [t.identifier('error'), t.identifier('info')];
    }

    const classMethod = t.classMethod(
      'method',
      t.identifier(name),
      params,
      blockStatement
    );
    this.script.methods[name] = classMethod;
  }

  computedHandler(path: NodePath<t.ObjectMethod>) {
    const blockStatement = formatThisExpression(path, this.script);
    this.script.computed[(path.node.key as t.Identifier).name] = t.classMethod(
      'method',
      path.node.key,
      [],
      blockStatement
    );
  }

  propsHandler(path: NodePath<t.ObjectProperty>) {
    const nodeList = (path.node.value as t.ObjectExpression)
      .properties as t.ObjectMethod[];

    nodeList.forEach(node => {
      const key = (node.key as t.Identifier).name;
      if (t.isIdentifier(node.value)) {
        // Support following syntax:
        // props: { title: Boolean }
        this.script.props[key] = {
          type: node.value.name.toLowerCase(),
          typeValue: node.value.name.toLowerCase(),
          defaultValue: undefined,
          required: false,
          validator: false
        };
      } else if (t.isArrayExpression(node.value)) {
        // Support following syntax:
        // props: { title: [Boolean, String] }
        const types = node.value.elements.map(element =>
          (element as t.Identifier).name.toLowerCase()
        );

        this.script.props[key] = {
          type: types.length > 1 ? 'typesOfArray' : types[0],
          typeValue: types.length > 1 ? types : types[0],
          defaultValue: undefined,
          required: false,
          validator: false
        };
      } else if (t.isObjectExpression(node.value)) {
        // Support following syntax:
        // list: {type: Array, default: () => [], require: true}
        // or
        // title: {type: String, default: "title"}
        // or
        // title: {type: [String, Number], default: "title"}
        this.script.props[key] = {
          type: '',
          typeValue: '',
          defaultValue: undefined,
          required: false,
          validator: false
        };

        // recurse in ObjectExpression to deal with Property and FunctionExpression
        const fetchPropsContent = {
          Property(this: any, path: NodePath) {
            const gradparentKey = (path.parentPath.parent as t.Property).key;
            if (
              gradparentKey &&
              (gradparentKey as t.Identifier).name === this.key
            ) {
              const node = path.node as t.Property;
              const name = (node.key as t.Identifier).name;
              switch (name) {
                case 'type':
                  if (t.isIdentifier(node.value)) {
                    // Support following syntax:
                    // title: {type: String}
                    this.prop.type = node.value.name.toLowerCase();
                    this.prop.typeValue = node.value.name.toLowerCase();
                  } else if (t.isArrayExpression(node.value)) {
                    // Support following syntax:
                    // title: {type: [String, Number]}
                    const types = node.value.elements.map(element =>
                      (element as t.Identifier).name.toLowerCase()
                    );

                    this.prop.type =
                      types.length > 1 ? 'typesOfArray' : types[0];
                    this.prop.typeValue = types.length > 1 ? types : types[0];
                  } else {
                    logger.log(
                      `The type in ${this.key} prop only supports identifier or array expression, eg: Boolean, [String]`,
                      'info'
                    );
                  }
                  break;
                case 'default':
                  if (
                    t.isStringLiteral(node.value) ||
                    t.isBooleanLiteral(node.value) ||
                    t.isNumericLiteral(node.value)
                  ) {
                    this.prop.defaultValue = node.value.value;
                  } else if (
                    t.isArrayExpression(node.value) ||
                    t.isObjectExpression(node.value)
                  ) {
                    this.prop.defaultValue = node.value;
                  }
                  break;
                case 'require':
                  this.prop.required = (node.value as t.BooleanLiteral).value;
                  break;
                default:
                  break;
              }
            }
          },

          FunctionExpression: FunctionOrArrowFunctionVisitor,

          ArrowFunctionExpression: FunctionOrArrowFunctionVisitor
        };

        const prop = this.script.props[key];

        path.traverse(fetchPropsContent, { prop, key });
      } else {
        logger.log(
          `Not supports expression for the ${key} prop in props.`,
          'info'
        );
      }
    });
  }
}

function FunctionOrArrowFunctionVisitor(this: any, path: NodePath) {
  const gradparentKey = (path.parentPath.parentPath.parent as t.Property).key;
  if (gradparentKey && (gradparentKey as t.Identifier).name === this.key) {
    // maybe 'default' or 'validator'
    const parentKey = (path.parent as t.Property).key;
    switch ((parentKey as t.Identifier).name) {
      case 'default':
        const body = (path.node as t.ArrowFunctionExpression).body;
        if (t.isArrayExpression(body)) {
          // Support following syntax:
          // title: {type: Array, default: () => []}
          this.prop.defaultValue = body;
        } else if (t.isBlockStatement(body)) {
          // Support following syntax:
          // title: {type: Array, default: () => { return 'hello world' }}
          const childNodes = body.body;
          // must have only one return statement
          if (childNodes.length === 1 && t.isReturnStatement(childNodes[0])) {
            this.prop.defaultValue = childNodes[0].argument;
          }
        }
        break;
      case 'validator':
        logger.log(
          `Not supports validator for the ${this.key} prop in props.`,
          'info'
        );
        break;
      default:
        break;
    }
  }
}
