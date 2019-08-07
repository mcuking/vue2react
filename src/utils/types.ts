import * as t from '@babel/types';

export type anyObject = { [name: string]: any };
export interface Script {
  name: string;
  data: anyObject;
  props: anyObject;
  methods: anyObject;
  computed: anyObject;
  imports: t.ImportDeclaration[];
}

export interface Template {
  ast: t.JSXElement | undefined;
  attrsCollector: Set<string>;
}

export interface App {
  template: Template;
  script: Script;
}

export interface Log {
  msg: string;
  type: string;
}
