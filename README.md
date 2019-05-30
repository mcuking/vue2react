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

### From(Vue Code)

```javascript
<template>
  <div v-if="show"
       v-show="show"
       v-html="html"
       :a="list"
       @click="handleTitleClick"
       b="1">
    <p v-for="item in list"
       :key="item.key"
       v-bind:rt="show"
       sd="ss"
       :swe="show"
       tr="23"
       :class="{'wrapper': show}"
       class="er df">{{item.value}}</p>
    <h1 href="">{{reverseName}}</h1>
    <loader />
  </div>
</template>

<script>
import Loader from "./Loader";
export default {
  name: "cool-demo",

  component: {
    Loader
  },

  props: {
    list: Boolean,
    text: [String, Number],
    title: {
      type: String,
      default: "hello world"
    },
    list2: {
      type: Array,
      default: () => [],
      require: true
    },
    list3: {
      type: Object,
      default: function() {
        return { message: "hello" };
      }
    }
  },

  data() {
    return {
      html: "<div>hello, i am hack</div>",
      show: true,
      name: "tom",
      item: {
        id: "123"
      }
    };
  },

  created() {
    this.name = "jerry";
    this.name.we = 1;
  },

  mounted() {
    console.log(this.name);
    document.addEventListener("click", this.handlePageClick);
  },

  beforeDestroy() {
    document.removeEventListener("click", this.handlePageClick);
  },

  methods: {
    handlePageClick(e) {
      const { name } = this;
      console.log("page click", e, name);
    },

    handleTitleClick(e) {
      const { id } = this.item;
      console.log("title clicked", e, id);
    }
  },

  computed: {
    reverseName() {
      return this.name
        .split("")
        .reverse()
        .join("");
    },

    wrappedTitle() {
      return `Title is ${this.title}`;
    }
  }
};
</script>

<style>
.title {
  font-size: 28px;
  color: #333;
}

.name {
  font-size: 32px;
  color: #999;
}
</style>
```

### To(React Code)

#### JS 文件

```javascript
import react, { Component } from 'react';
import PropTypes from 'PropType';
import Loader from './Loader';
import 'index.css';
export default class CoolDemo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      html: '<div>hello, i am hack</div>',
      show: true,
      name: 'tom',
      item: {
        id: '123'
      }
    };
  }

  static propType = {
    list: PropTypes.boolean,
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    list2: PropTypes.array.isRequired,
    list3: PropTypes.object
  };
  static defaultProps = {
    title: 'hello world',
    list2: [],
    list3: {
      message: 'hello'
    }
  };

  componentWillMount() {
    this.setState({
      name: 'jerry'
    });
    this.state.name.we = 1;
  }

  componentDidMount() {
    console.log(this.state.name);
    document.addEventListener('click', this.handlePageClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handlePageClick);
  }

  handlePageClick(e) {
    const { name } = this;
    console.log('page click', e, name);
  }

  handleTitleClick(e) {
    const { id } = this.state.item;
    console.log('title clicked', e, id);
  }

  reverseName() {
    return this.state.name
      .split('')
      .reverse()
      .join('');
  }

  wrappedTitle() {
    return `Title is ${this.props.title}`;
  }

  render() {
    const { show, html } = this.data;
    const { list } = this.props;
    const { handleTitleClick } = this;
    const reverseName = this.reverseName();
    return (
      <div>
        {show && (
          <div
            a={list}
            b="1"
            onClick={handleTitleClick}
            style={{
              display: show ? 'block' : 'none'
            }}
            dangerouslySetInnerHTML={{
              __html: html
            }}
          >
            {list.map(item => (
              <p
                rt={show}
                sd="ss"
                swe={show}
                tr="23"
                className="er df"
                key={item.key}
              >
                {item.value}
              </p>
            ))}
            <h1 href="">{reverseName}</h1>
            <loader />
          </div>
        )}
      </div>
    );
  }
}
```

#### CSS 文件

```css
.title {
  font-size: 28px;
  color: #333;
}

.name {
  font-size: 32px;
  color: #999;
}
```

## Inspired by

[vue-to-react](https://github.com/dwqs/vue-to-react)
