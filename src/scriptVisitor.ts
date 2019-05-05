import * as t from '@babel/types';

export default class scriptVisitor {
  script: any;

  constructor(ast: t.Node | t.Node[]) {
    this.script = {
      ast,
      name: '',
      data: {},
      props: {},
      methods: {}
    };
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

  nameHandler(name: string) {
    this.script.name = name;
  }
}
