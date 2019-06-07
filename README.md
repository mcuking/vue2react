# vue2react

A tool that transforms Vue component to React component.

Now support tranform SFC (.vue) file.

There are 2 ways to use the transform tool: web page or cli.

## Web Page

https://mcuking.github.io/vue2react/

To get better perfomance, suggest access to it via Chrome.

The demo screen is here.

<img src="./vue2react.png"/>

## CLI

#### Install

```bash
npm i vue2react -g
```

or

```bash
yarn add vue2react -g
```

#### Usage

bash example

```bash
vtr -i hello.vue -o ./screen -n nihao.js
vtr hello.vue ./screen nihao.js
vtr hello.vue
```

vtr help infomation

```bash
Usage: vtr [options]

Options:
  -V, --version  output the version number
  -i, --input    the input path for vue component
  -o, --output   the output path for react component, which default value is process.cwd()
  -n, --name     the output file name, which default value is "react.js"
  -h, --help     output usage information
```

## Support

- Data
  - [x] data
  - [x] props
  - [x] propsData
  - [x] computed
  - [x] methods
  - [ ] watch
- DOM
  - [ ] el
  - [x] template
  - [ ] render
  - [ ] renderError
- Lifecycle Hooks
  - [x] created
  - [x] mounted
  - [x] updated
  - [x] beforeDestroy
  - [x] errorCaptured
- Directives
  - [ ] v-text
  - [x] v-html
  - [x] v-show
  - [x] v-if
  - [ ] v-else
  - [ ] v-else-if
  - [x] v-for
  - [x] v-on / @
  - [x] v-bind / :
  - [ ] v-model
  - [ ] v-pre
  - [ ] v-cloak
  - [ ] v-once
- Special Attributes
  - [x] key
  - [ ] ref

## Example

#### Demo1

<table>
  <tr>
    <td>
      Vue Code
    </td>
    <td>
      React Code
    </td>
  </tr>
  <tr>
    <td>
      <img src="./example/demo1/demo1_src.png"/>
    </td>
    <td>
      <img src="./example/demo1/demo1_dest.png"/>
    </td>
  </tr>
</table>

#### Demo2

<table>
  <tr>
    <td>
      Vue Code
    </td>
    <td>
      React Code
    </td>
  </tr>
  <tr>
    <td>
      <img src="./example/demo2/demo2_src.png"/>
    </td>
    <td>
      <img src="./example/demo2/demo2_dest.png"/>
    </td>
  </tr>
</table>

## Inspiration

[algorithm-visualizer](https://github.com/algorithm-visualizer/algorithm-visualizer)

[vue-to-react](https://github.com/dwqs/vue-to-react)
