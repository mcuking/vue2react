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