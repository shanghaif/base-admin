<template>
  <el-card>
    <div class="right">
      <!-- <div class="count-container">
        <div
          class="count-item blue"
          style="width: 32%"
        >
          <span>温度高</span>
          <p class="count-num">{{ total }}</p>
          <i class="el-icon-info" />
        </div>
        <div
          class="count-item gray"
          style="width: 32%"
        >
          <span>离线</span>
          <p class="count-num">936</p>
          <i class="el-icon-success" />
        </div>
        <div
          class="count-item red"
          style="width: 32%"
        >
          <span>趋势异常</span>
          <p class="count-num">68</p>
          <i class="el-icon-warning" />
        </div>
      </div> -->
      <div class="right-content">
        <div class="filter-container">

          <el-cascader
            :props="props"
            style="width:400px"
            @change="cascaderChange"
          />

          <el-button
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
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          highlight-current-row
          :stripe="true"
          max-height="600px"
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
            prop="s_name"
            label="设备名称"
            show-overflow-tooltip
          />
          <el-table-column
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
    // statusFilter(type) {
    //   let res = ''
    //   if (type === 'offline') {
    //     res = '离线'
    //   } else if (type === 'temperature_high') {
    //     res = '温度高'
    //   }
    //   return res
    // },
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
      total: 0,
      currenRow: null,
      factoryStr: '',
      radio: '',
      tableData: [],
      queryParams: {
        page: 1,
        size: 10
      },
      chooseDate: {},
      companyList: [],
      factoryList: [],
      props: {
        lazy: true,
        lazyLoad(node, resolve) {
          const { level } = node
          let keysArr = []
          // setTimeout(() => {
          //   const nodes = Array.from({ length: level + 1 }).map((item) => ({
          //     value: ++id,
          //     label: `选项${id}`,
          //     leaf: level >= 2
          //   }))
          //   // 通过调用resolve将子节点数据返回，通知组件数据加载完成
          //   resolve(nodes)
          // }, 1000)
          if (level === 0) {
            company(1).then((res) => {
              const arr = (res.data.result && res.data.result.stations) || []
              keysArr = arr.map((v) => ({
                value: v.uid,
                label: v.s_name
              }))

              resolve(keysArr)
            })
          } else if (node.level === 1) {
            const { value } = node.data
            factory(value, 1).then((res) => {
              const arr = (res.data.result && res.data.result.stations) || []

              keysArr = arr.map((v) => ({
                value: v.uid,
                label: v.s_name
              }))

              resolve(keysArr)
            })
          } else if (node.level === 2) {
            const { value } = node.data

            area(value, 1).then((res) => {
              const arr = (res.data.result && res.data.result.stations) || []
              keysArr = arr.map((v) => ({
                value: v.uid,
                label: v.s_name
              }))

              return resolve(keysArr)
            })
          } else if (node.level === 3) {
            const { value } = node.data

            cell(value, 1).then((res) => {
              const arr = (res.data.result && res.data.result.stations) || []
              keysArr = arr.map((v) => ({
                value: v.uid,
                label: v.s_name,
                leaf: true
              }))

              return resolve(keysArr)
            })
          }
        }
      }
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
    cascaderChange(arr) {
      const id = arr[3]
      devicePoint(id)
        .then((res) => {
          this.tableData = res.data.result || []
          this.total = this.tableData.length
        })
        .catch((err) => {
          this.$message(err)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.svg {
  margin-right: 8px;
}
</style>
