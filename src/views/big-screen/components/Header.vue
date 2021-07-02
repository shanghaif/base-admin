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
  props: {},
  data() {
    return {
      updateTime: this.$dayjs().format('YYYY/MM/DD HH:mm:ss'),

      selectFreshTime: '30',
      cellFreshTimeOptions: [
        { value: '10', label: '10秒' },
        { value: '30', label: '30秒' },
        { value: '60', label: '1分钟' },
        { value: '300', label: '5分钟' },
        { value: '600', label: '10分钟' }
      ]
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

  methods: {
    change(val) {
      console.log('val :>> ', val)
      this.$emit('change', val)
    }
  }
}
</script>

<style lang="scss" scoped></style>
