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
  directives: {},
  filters: {},
  extends: {},
  mixins: {},
  props: {},
  data() {
    return {
      updateTime: this.$dayjs().format('YYYY/MM/DD HH:mm:ss'),

      selectFreshTime: '',
      cellFreshTimeOptions: [
        { value: '10秒', label: '10秒' },
        { value: '30秒', label: '30秒' },
        { value: '1分钟', label: '1分钟' },
        { value: '5分钟', label: '5分钟' },
        { value: '10分钟', label: '10分钟' }
      ]
    }
  },
  computed: {},
  watch: {},
  beforeCreate() {
    // 生命周期钩子：组件实例刚被创建，组件属性计算之前，如 data 属性等
  },
  created() {
    // 生命周期钩子：组件实例创建完成，属性已绑定，但 DOM 还未生成，el 属性还不存在
    // 初始化渲染页面
  },
  beforeMount() {
    // 生命周期钩子：模板编译/挂载之前
  },
  mounted() {
    // 生命周期钩子：模板编译、挂载之后（此时不保证已在 document 中）
  },
  beforeUpate() {
    // 生命周期钩子：组件更新之前
  },
  updated() {
    // 生命周期钩子：组件更新之后
  },
  activated() {
    // 生命周期钩子：keep-alive 组件激活时调用
  },
  deactivated() {
    // 生命周期钩子：keep-alive 组件停用时调用
  },
  beforeDestroy() {
    // 生命周期钩子：实例销毁前调用
  },
  destroyed() {
    // 生命周期钩子：实例销毁后调用
  },
  errorCaptured(err, vm, info) {
    // 生命周期钩子：当捕获一个来自子孙组件的错误时被调用。此钩子会收到三个参数：错误对象、发生错误的组件实例以及一个包含错误来源信息的字符串。
    console.log(err, vm, info)
  },
  methods: {}
}
</script>

<style lang="scss" scoped></style>
