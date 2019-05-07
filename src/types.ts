import * as t from '@babel/types';

export interface Script {
  name: string;
  data: { [name: string]: any };
  props: { [name: string]: any };
  methods: { [name: string]: any };
  computed: { [name: string]: any };
  imports: t.ImportDeclaration[];
}

export interface Template {}

export interface App {
  template: Template;
  script: Script;
}
