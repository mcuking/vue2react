# vue2react

A tool that transforms Vue component to React component.

The tool will be more stronger and supports more syntax.

## Install

```bash
npm i vue2react -g
```

or

```bash
yarn add vue2react -g
```

## Usage

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

## Example

Left code is Vue, and the right one is React.

#### Demo1

<table>
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
      <img src="./example/demo2/demo2_src.png"/>
    </td>
    <td>
      <img src="./example/demo2/demo2_dest.png"/>
    </td>
  </tr>
</table>

## Inspired by

[vue-to-react](https://github.com/dwqs/vue-to-react)
