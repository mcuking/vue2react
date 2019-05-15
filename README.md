# Vue-to-React

A tool that transforms Vue component to React component.

The tool will be more stronger and supports more syntax.

Here is an example:

##### Vue Code:

```javascript
<template>
  <div>
    <p class="title"
       @click="handleTitleClick">{{title}}</p>
    <p class="name"
       v-if="show">{{name}}</p>
    <p class="name"
       v-if="show">{{reverseName}}</p>
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

##### React Code:

```javascript
import react, { Component } from 'react';
import PropTypes from 'PropType';
import Loader from './Loader';
export default class CoolDemo extends Component {
  constructor(props) {
    super(props);
    this.state = {
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

  render() {
    const reverseName = this.state.name
      .split('')
      .reverse()
      .join('');
    const wrappedTitle = `Title is ${this.props.title}`;
  }
}
```
