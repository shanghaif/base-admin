<template>
  <div id="status">
    <img
      class="status-img"
      :src="imgList[img]"
    >
    <p class="status-text">{{ text }}</p>
  </div>
</template>

<script>
export default {
  props: {
    img: { type: String, default: '' },
    text: { type: String, default: '提示文本' }
  },
  data() {
    return {
      imgList: {
        null: require('@/assets/status_null.svg'),
        net404: require('@/assets/status_404.svg'),
        denied: require('@/assets/status_denied.svg')
      }
    }
  },
  mounted() {},
  methods: {
    showList() {
      this.show = !this.show
    },
    update(index) {
      this.index = index
      this.$emit('update', index)
    }
  }
}
</script>

<style lang="scss" scoped>
#status {
  display: flex;
  flex-direction: column;
  margin: auto;
}
.status-img {
  margin: auto auto 0 auto;
  height: 60px;
  width: 90px;
}
.status-text {
  margin: 10px auto;
  width: 100%;
  text-align: center;
  font-size: 14px;
  opacity: 0.5;
}
</style>
