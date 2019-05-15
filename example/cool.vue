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