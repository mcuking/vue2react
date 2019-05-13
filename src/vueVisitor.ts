import * as t from '@babel/types';
import { NodePath } from '@babel/traverse';

import { Script } from './types';

export default class vueVisitor {
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

  importHandler(node: t.ImportDeclaration) {
    this.script.imports.push(node);
  }

  nameHandler(name: string) {
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

  methodsHandler(name: string, params: any[], body: t.BlockStatement) {
    // transform vue method and cylce to react method and cycle
    if (name === 'componentDidCatch') {
      params = [t.identifier('error'), t.identifier('info')];
    }
    const classMethod = t.classMethod(
      'method',
      t.identifier(name),
      params,
      body
    );
    this.script.methods[name] = classMethod;
  }

  computedHandler(body: t.ObjectMethod[]) {
    body.forEach(node => {
      this.script.computed[(node.key as t.Identifier).name] = node.body;
    });
  }

  propsHandler(path: NodePath, body: t.ObjectMethod[]) {
    body.forEach(node => {
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
                    this.prop.type = (node.value as t.Identifier).name.toLowerCase();
                    this.prop.typeValue = (node.value as t.Identifier).name.toLowerCase();
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
                    console.error(
                      `Vue-to-React: The type in ${
                        this.key
                      } prop only supports identifier or array expression, eg: Boolean, [String]`
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
        console.error(
          `Vue-to-React: Not supports expression for the ${key} prop in props.`
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
            this.prop.defaultValue = (childNodes[0] as t.ReturnStatement).argument;
          }
        }
        break;
      case 'validator':
        console.error(
          `Vue-to-React: Not supports validator for the ${
            this.key
          } prop in props.`
        );
        break;
      default:
        break;
    }
  }
}
