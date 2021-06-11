<template>
  <div class="tab-container">
    <el-tabs v-model="activeName" style="margin-top: 15px">
      <el-tab-pane lazy label="实时告警信息" name="realtime">
        <realtime type="realtime" />
      </el-tab-pane>
      <el-tab-pane lazy label="汇总信息告警" name="total">
        <total type="total" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Realtime from './components/realtime'
import Total from './components/total'

export default {
  name: 'Tab',
  components: { Realtime, Total },
  data() {
    return {
      tabMapOptions: [
        { label: '实时告警信息', key: 'realtime' },
        { label: '汇总告警信息', key: 'total' }
      ],
      activeName: 'realtime',
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
