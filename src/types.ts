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

export interface App {
  template: t.Expression | undefined;
  script: Script;
}
