<template>
  <div class="img-verify-box"
       @click="handleClick">
    <img class="verify-img"
         :src="src" />
  </div>
</template>

<script>
export default {
  name: "image-verify",
  data() {
    return {
      timer: null,
      src: "",
      sending: false
    };
  },

  props: {
    getVerifyCode: { type: Function, default: () => {} }
  },

  methods: {
    // 初始化
    init() {
      this.sending = true;
      this.getVerifyCode().then(
        res => {
          const { image, img, pid } = res;
          this.src = image || img;
          this.$emit("img-code-fetch-success", pid);
          this.sending = false;
        },
        () => {
          this.sending = false;
        }
      );
    },

    // 点击验证码图片，重发请求
    handleClick() {
      if (this.sending) return false;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.init();
      }, 500);
    }
  },

  created() {
    this.init();
  }
};
</script>

<style lang="less" scoped>
.img-verify-box {
  cursor: pointer;
}
.verify-img {
  width: 142px;
  height: 42px;
}
</style>
