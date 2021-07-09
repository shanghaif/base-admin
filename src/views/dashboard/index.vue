<template>
  <el-card>

    <div class="dashboard-container">
      <!-- <component :is="currentRole" /> -->
      <!-- <div class="count-container">
        <div
          class="count-item blue"
          style="width: 32%"
        >
          <span>设备总数</span>
          <p class="count-num"> 1000 </p>
          <i class="el-icon-info" />
        </div>
        <div
          class="count-item gray"
          style="width: 32%"
        >
          <span>在线设备</span>
          <p class="count-num">936</p>
          <i class="el-icon-success" />
        </div>
        <div
          class="count-item red"
          style="width: 32%"
        >
          <span>离线设备</span>
          <p class="count-num">68</p>
          <i class="el-icon-warning" />
        </div>
      </div> -->
    </div>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'

export default {
  name: 'Dashboard',
  // components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters(['roles'])
  },
  created() {
    if (!this.roles.includes('admin')) {
      this.currentRole = 'editorDashboard'
    }
  }
}
</script>
