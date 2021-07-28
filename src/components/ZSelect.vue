<template>
  <div
    class="z-select"
    :style="{fontSize: fontSize + 'px'}"
    @click="showList()"
  >
    {{ text }}{{ text === '' ? '' : ': ' }}{{ current.label }}
    <div
      class="iconfont icon-arrow"
      :class="show ? 'rotate' : ''"
    />
    <div
      v-show="show"
      class="list"
    >
      <div
        v-for="(item, i) of list"
        :key="i"
        class="list-item"
        :style="{fontSize: fontSize + 'px'}"
        @click="update(item,i)"
      >{{ item.label }}</div>
    </div>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'update'
  },
  props: {
    value: String,
    list: Array,
    text: { type: String, default: '' },
    fontSize: { type: Number, default: 14 }
  },
  data() {
    return {
      index: this.value,
      show: false,
      current: { label: '', value: '' }
    }
  },

  mounted() {
    document.addEventListener('click', (e) => {
      if (!this.$el.contains(e.target)) {
        this.show = false
      }
    })
    this.current = this.list.find((v) => v.value === this.value)
  },
  methods: {
    showList() {
      this.show = !this.show
    },
    update(obj, index) {
      this.current = { ...obj }
      this.index = index
      this.$emit('update', obj.value)
    }
  }
}
</script>

<style lang="scss" scoped>
.z-select {
  width: 100%;
  position: relative;
  display: flex;
  padding: 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  cursor: default;
  .icon-arrow {
    margin: auto 0 auto auto;
    font-size: 12px;
    opacity: 0.7;
    transition: all ease, 0.3s;
  }
  .rotate {
    transform: rotate(180deg);
  }
  .list {
    position: absolute;
    padding: 2px;
    overflow-y: auto;
    max-height: 180px;
    width: 100%;
    top: 34px;
    left: 0;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.12);
    box-shadow: 0 20px 20px -10px rgba(0, 0, 0, 0.5);
    animation: showList 0.3s;
    backdrop-filter: blur(4px);
    z-index: 100;
    &-item {
      padding: 10px 6px;
      width: 100%;
      border-radius: 2px;
      box-shadow: 0 5px 0 -4px hsla(255, 255, 255, 0.05);
      transition: all ease, 0.3s;
      cursor: default;
      &:nth-last-child(1) {
        box-shadow: none;
      }
      &:hover {
        background: var(--theme);
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
      }
    }
  }
}
@keyframes showList {
  0% {
    opacity: 0;
    top: 14px;
  }
  100% {
    opacity: 1;
    top: 34px;
  }
}
</style>
