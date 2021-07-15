<template>
  <div class="detail-item-center--top top">
    <div class="comp-name">神火集团 温度监测系统</div>
    <div class="update">
      <span>数据更新时间：</span>
      <span>{{ updateTime }}</span>
      <span class="update-text">更新频率：</span>

      <div class="content-select">
        <el-select
          v-model="selectFreshTime"
          placeholder="请选择"
          class="screen-select"
          @change="change"
        >
          <el-option
            v-for="item in cellFreshTimeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Header',
  components: {},
  props: {
    step: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      updateTime: this.$dayjs().format('YYYY/MM/DD HH:mm:ss'),

      selectFreshTime: 0,
      cellFreshTimeOptions: [{ value: 15 * 60 * 1000, label: '15分钟' }]
    }
  },
  computed: {},
  watch: {
    step(newVal, oldVal) {
      this.selectFreshTime = newVal
    }
  },

  created() {
    // 生命周期钩子：组件实例创建完成，属性已绑定，但 DOM 还未生成，el 属性还不存在
    // 初始化渲染页面
  },

  mounted() {
    // 生命周期钩子：模板编译、挂载之后（此时不保证已在 document 中）
    this.selectFreshTime = this.step
  },

  methods: {
    change(val) {
      this.selectFreshTime = val
      console.log('val :>> ', val)
      this.$emit('change', val)
    }
  }
}
</script>

<style lang="scss" scoped></style>
