<template>
  <el-card class="wrap">
    <div class="left">
      <StationTree @clickNode="clickNode" />
    </div>
    <div class="right">

      <div class="right-content">
        <div class="filter-container">
          <el-input
            v-if="searchResult.length>0"
            v-model="searchVal"
            style="width:200px;margin-right:30px"
            placeholder="输入设备名称搜索"
          >
            <i
              slot="prefix"
              class="el-input__icon el-icon-search"
            />
          </el-input>

          <el-button
            v-if="searchResult.length>0"
            style="vertical-align:top"
            type="primary"
            @click="searchTable"
          >
            <svg-icon
              class="svg"
              icon-class="search"
            />搜索
          </el-button>
          <el-button
            style="vertical-align:top"
            :disabled="!radio"
            type="primary"
            @click="openExportDlg"
          >
            <svg-icon
              class="svg"
              icon-class="export"
            />导出
          </el-button>
        </div>

        <el-table
          ref="multipleTable"
          v-loading="loading"
          :data="searchResult"
          tooltip-effect="dark"
          style="width: 100%"
          highlight-current-row
          :stripe="true"
          height="600px"
          @row-click="currentChange"
        >
          <el-table-column
            label="选择"
            width="50"
          >
            <template slot-scope="scope">

              <el-radio
                v-model="radio"
                :label="scope.row.tid"
              ><span /></el-radio>
            </template>
          </el-table-column>

          <el-table-column
            sortable
            :sort-method="(a, b) => sortName(a, b, 's_name')"
            prop="s_name"
            label="设备名称"
            show-overflow-tooltip
          />
          <el-table-column
            sortable
            prop="value"
            label="温度 ℃"
            class-name="n-wrap"
            show-overflow-tooltip
          >
            <template slot-scope="scope">

              <el-tag
                :type="typeFunc(scope.row)"
                plain
              >{{ scope.row.value }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="alarm_type"
            label="状态"
            class-name="n-wrap"
            show-overflow-tooltip
          >
            <template slot-scope="scope">

              <el-tag
                :type="typeFunc(scope.row)"
                plain
              >{{ scope.row.alarm_type && scope.row.alarm_type[0] | statusFilter }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            sortable
            prop="pick_time"
            label="时间"
            class-name="n-wrap"
            show-overflow-tooltip
          >
            <template slot-scope="scope">

              <span>{{ $dayjs(scope.row.pick_time * 1000).format('YYYY-MM-DD HH:mm') }}</span>
            </template>
          </el-table-column>
        </el-table>
        <!-- <div class="pagination-wrap">

          <el-pagination
            :hide-on-single-page="total < 10"
            background
            layout="total, prev, pager, next"
            :total="total"
            @current-change="changePage"
          />
        </div> -->
      </div>
    </div>
    <ExportFilter
      ref="ExportFilter"
      :item="currenRow"
      @export="exportPoint"
    />
  </el-card>
</template>

<script>
import { company, factory, area, cell } from '@/api/station'
import ExportFilter from '@/components/ExportFilter'
import { devicePoint, deviceHistory, exportPointInfo } from '@/api/station'

export default {
  name: 'DataDevice',
  components: { ExportFilter },
  filters: {
    statusFilter(type) {
      let res = ''
      if (type === 'temperature_high') {
        res = '温度告警'
      } else if (type === 'rate_high') {
        res = '趋势预警'
      } else if (type === 'offline') {
        res = '离线'
      } else if (type === 'abnormal') {
        res = '设备异常'
      } else {
        res = '正常'
      }
      return res
    }
  },
  props: {},
  data() {
    return {
      loading: false,
      total: 0,
      searchVal: '',
      currenRow: null,
      factoryStr: '',
      radio: '',
      currentNode: {},
      tableData: [],
      searchResult: [],
      queryParams: {
        page: 1,
        size: 10
      },
      chooseDate: {},
      companyList: [],
      factoryList: []
    }
  },

  computed: {},
  watch: {},

  created() {
    // 生命周期钩子：组件实例创建完成，属性已绑定，但 DOM 还未生成，el 属性还不存在
    // 初始化渲染页面
  },

  mounted() {},

  methods: {
    sortName(a, b) {
      const start = a.s_name.replace(/[^\d]/g, '')
      const end = b.s_name.replace(/[^\d]/g, '')
      return start - end
    },
    searchTable() {
      // this.data.filters(v)
      this.searchResult = this.tableData.filter(
        (data) =>
          !this.searchVal ||
          data.s_name.toLowerCase().includes(this.searchVal.toLowerCase())
      )
    },
    typeFunc(point) {
      let res = ''
      const type = point.alarm_type && point.alarm_type[0]
      if (type === 'temperature_high' || type === 'abnormal') {
        res = 'danger'
      } else if (type === 'rate_high') {
        res = 'warning'
      } else if (type === 'offline') {
        res = 'info'
      } else {
        res = 'success'
      }
      return res
    },
    changePage(page) {
      this.queryParams.page = page
    },
    clickNode(node) {
      if (node.level === 3) {
        this.currentNode = { ...node }
        this.query(node)
      } else {
        this.tableData = []
      }
    },
    currentChange(row) {
      this.currenRow = row
    },
    exportPoint(obj) {
      const { arr, is_compress } = obj
      const params = {
        id: this.currenRow.tid,
        is_compress,
        sTime: arr[0],
        eTime: arr[1]
      }

      exportPointInfo(params)
        .then((res) => {
          if (res.status === 200) {
            if (res.headers['content-disposition']) {
              this.$refs.ExportFilter.isExcel(res)
              this.$refs.ExportFilter.hide()
            } else {
              this.$message({ type: 'error', message: '无数据', time: 6000 })
            }
          }
        })
        .catch((err) => {
          this.$message(err)
        })
    },
    openExportDlg() {
      if (!this.radio) {
        this.$message({ type: 'error', message: '请选择选择设备', time: 6000 })
      }
      this.$refs.ExportFilter.show()
    },
    query() {
      this.loading = true
      devicePoint(this.currentNode.uid)
        .then((res) => {
          this.tableData = res.data.result || []
          this.searchResult = this.tableData
          this.total = this.tableData.length
          this.loading = false
        })
        .catch((err) => {
          this.$message(err)
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.svg {
  margin-right: 8px;
}
.wrap {
  width: 100%;
  height: calc(100vh - 84px);

  .left {
    float: left;
    width: 240px;
    margin-right: 30px;
    height: 100%;
    min-height: calc(100vh - 84px);
    border-right: 1px solid #000;
  }
  .right {
    float: left;
    width: calc(100% - 270px);
  }
}
</style>
