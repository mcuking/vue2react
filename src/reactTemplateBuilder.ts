import template from '@babel/template';
import * as t from '@babel/types';

import { App } from './types';

export default function reactTemplateBuilder(app: App) {
  const componentTemplate = `
    export default class NAME extends Component {
      constructor(props) {
        super(props);
        this.state=STATE;
      }
    }
  `;

  const buildRequire = template(componentTemplate);

  const node = buildRequire({
    NAME: t.identifier(app.script.name),
    STATE: t.objectExpression(app.script.data._statements)
  });

  return t.file(t.program([node as any]));
}
