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
  name: "cool",

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

  // static propType = {
  //   title: PropTypes.string,
  //   text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  //   list: PropTypes.array.isRequired,
  // }

  // static defaultProps = {
  //   title: "title",
  //   list: []
  // }

  data() {
    return {
      show: true,
      name: "tom"
    };
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
      console.log("page click", e);
    },

    handleTitleClick(e) {
      console.log("title clicked", e);
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