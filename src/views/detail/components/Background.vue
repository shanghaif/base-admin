<template>
  <div id="background">
    <img
      class="bg"
      :src="img"
    >
  </div>
</template>

<script>
export default {
  data() {
    return {
      img: require('@/assets/bg.jpg')
    }
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.bg {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  object-fit: cover;
  opacity: 1;
}
</style>
