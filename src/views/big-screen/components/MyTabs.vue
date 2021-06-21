<template>
  <div class="tabs">
    <div
      v-for="(item,i) in list"
      :key="i + 'a'"
      class="tab"
      :class="{active:activeTab === i,min: size === 'min'}"
      @click="choose(i)"
    >
      {{ item.text }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyTabs',

  props: {
    size: {
      type: String,
      default: ''
    },
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      activeTab: 0
    }
  },
  computed: {},
  watch: {},

  created() {
    // 生命周期钩子：组件实例创建完成，属性已绑定，但 DOM 还未生成，el 属性还不存在
    // 初始化渲染页面
  },

  mounted() {
    // 生命周期钩子：模板编译、挂载之后（此时不保证已在 document 中）
  },

  updated() {
    // 生命周期钩子：组件更新之后
  },

  methods: {
    choose(val) {
      this.activeTab = val
    }
  }
}
</script>

<style lang="scss" scoped>
.tabs {
  display: flex;
  width: 100%;
  .tab {
    display: flex;
    justify-content: center;
    align-items: center;
    // width: 25%;
    height: 30px;
    padding: 0 12px;
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    font-size: 14px;
    cursor: pointer;
    &.min {
      height: 24px;
    }
    &.active {
      background: $selfColor;
    }
  }
}
</style>
