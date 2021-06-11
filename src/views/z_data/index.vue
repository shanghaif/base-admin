<template>
  <div class="tab-container">
    <el-tabs v-model="activeName" style="margin-top: 15px">
      <el-tab-pane lazy label="当前温度数据" name="current">
        <current type="current" />
      </el-tab-pane>
      <el-tab-pane lazy label="历史温度数据" name="history">
        <history type="history" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Current from './components/current'
import History from './components/history'

export default {
  name: 'Tab',
  components: { Current, History },
  data() {
    return {
      tabMapOptions: [
        { label: '当前温度数据', key: 'current' },
        { label: '历史温度数据', key: 'history' }
      ],
      activeName: 'current',
      createdTimes: 0
    }
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
    }
  },
  created() {
    // init the default selected tab
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
  },
  methods: {
    showCreatedTimes() {
      this.createdTimes = this.createdTimes + 1
    }
  }
}
</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }
</style>
