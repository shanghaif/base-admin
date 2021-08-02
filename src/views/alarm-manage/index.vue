<template>
  <el-card class="wrap">
    <div class="left">
      <StationTree
        :current-id="currentNode.t_id"
        @clickNode="clickNode"
      />

    </div>
    <div class="right">

      <div class="right-content">
        <div class="filter-container">

          <el-date-picker
            v-model="dateRange"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            placeholder="选择日期"
            class="screen-select"
            unlink-panels
            value-format="yyyy-MM-dd HH:mm"
            :default-time="['00:00:00','23:59:59']"
            @change="changeDate"
          >
            />
          </el-date-picker>

        </div>

        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          :stripe="true"
        >

          <el-table-column
            sortable
            prop="Company"
            label="公司"
            show-overflow-tooltip
          />
          <el-table-column
            sortable
            prop="Factory"
            label="厂区"
            show-overflow-tooltip
          />
          <el-table-column
            sortable
            prop="Area"
            label="分区"
            show-overflow-tooltip
          />
          <el-table-column
            sortable
            prop="Bath"
            label="电解槽"
            show-overflow-tooltip
          />
          <el-table-column
            prop="thing_name"
            label="名称"
            width="120"
          >
            <template slot-scope="scope">

              <el-link
                type="primary"
                @click="addNewDevice(scope.row)"
              >{{ scope.row.thing_name }}</el-link>
            </template>
          </el-table-column>

          <el-table-column
            prop="alarm_id"
            label="状态"
            show-overflow-tooltip
            width="100"
          >
            <template slot-scope="scope">

              <el-tag
                :type="typeFunc(scope.row.alarm_id)"
                plain
              >{{ scope.row.alarm_id | statusFilter }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="alarm_obj"
            label="时间"
            class-name="n-wrap"
            show-overflow-tooltip
          >
            <template slot-scope="scope">

              <span>{{ $dayjs(scope.row.alarm_obj.time * 1000).format('YYYY-MM-DD HH:mm') }}</span>
            </template>
          </el-table-column>

          <!-- <el-table-column
            label="操作"
            width="160"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="addNewDevice(scope.row,scope.$index)"
              >
                编辑
              </el-button>
              <el-popconfirm
                title="确定删除该物模型吗？"
                @confirm="delDevice(scope.row,scope.$index)"
              >
                <el-button
                  slot="reference"
                  size="mini"
                  type="danger"
                >
                  删除

                </el-button>
              </el-popconfirm>
            </template>
          </el-table-column> -->
        </el-table>
        <div class="pagination-wrap">

          <el-pagination
            :hide-on-single-page="total < 10"
            background
            layout="total, prev, pager, next"
            :total="total"
            @current-change="changePage"
          />
        </div>
      </div>
    </div>

  </el-card>
</template>

<script>
import {
  company,
  factory,
  areaPage,
  cell,
  device,
  handelAlarm,
  deviceStatus
} from '@/api/station'
import { warningAll } from '@/api/station'
import { mapState, mapActions, mapMutations } from 'vuex'
import { setCurrentFactory, getCurrentFactory } from '@/utils/auth'

export default {
  name: 'AlarmHistory',
  components: {},
  filters: {
    statusFilter(type) {
      let res = ''
      if (type === 'offline') {
        res = '离线'
      } else if (type === 'temperature_high') {
        res = '温度高'
      }
      return res
    }
  },
  props: {},
  data() {
    return {
      total: 0,
      factoryStr: '',
      currentId: '',
      currentNode: {},
      tableData: [],
      queryParams: {
        page: 1,
        size: 10
      },
      dateRange: [],
      levelMap: ['company', 'factory', 'area', 'bath'],
      chooseDate: {},

      pickerOptions: {}
    }
  },

  computed: {
    ...mapState({
      currentFactory: (state) => state.station.currentFactory
    })
  },
  watch: {},

  created() {
    this.currentNode = {
      t_id: getCurrentFactory().uid,
      factory: true
    }
  },

  mounted() {
    // 生命周期钩子：模板编译、挂载之后（此时不保证已在 document 中）
    this.pickerOptions = this.getPickerOptions()

    this.getDate('day')
    this.queryWarning()

    this.dateRange = [this.chooseDate.begin_time, this.chooseDate.end_time]
  },

  methods: {
    clickNode(node) {
      this.currentNode = {
        alarm_id: 'all',
        t_id: node.uid,
        [this.levelMap[node.level]]: true
      }
      this.queryWarning()
    },
    getPickerOptions() {
      const that = this
      return {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [
          {
            text: '当日',
            onClick(picker) {
              const end = that.$dayjs().format('YYYY-MM-DD') + ' 23:59'
              const start = that.$dayjs().format('YYYY-MM-DD') + ' 00:00'
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '一周',
            onClick(picker) {
              const start =
                that.$dayjs().subtract(7, 'day').format('YYYY-MM-DD') + ' 00:00'
              const end = that.$dayjs().format('YYYY-MM-DD') + ' 23:59'
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '30天',
            onClick(picker) {
              const start =
                that.$dayjs().subtract(30, 'day').format('YYYY-MM-DD') +
                ' 00:00'
              const end = that.$dayjs().format('YYYY-MM-DD') + ' 23:59'
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    },
    changeDate(arr) {
      const obj = {}
      obj.begin_time = arr[0]
      obj.end_time = arr[1]
      this.chooseDate = obj
      this.queryWarning()
    },

    typeFunc(type) {
      let res = ''
      if (type === 'temperature_high' || type === 'abnormal') {
        res = 'danger'
      } else if (type === 'rate_high') {
        res = 'warning'
      } else if (type === 'offline') {
        res = 'info'
      }
      return res
    },

    changePage(page) {
      this.queryWarning()
    },
    async queryWarning(factoryId) {
      // {factory: true, tid, page, size: 8, begin_time, begin_time, alarm_id: 'all' }
      // const obj = {
      //   begin_time: '',
      //   t_id: factoryId || getCurrentFactory().uid
      // }
      const parmas = {
        ...this.currentNode,
        ...this.chooseDate,
        ...this.queryParams
      }
      const res = await warningAll(parmas)
      this.tableData = res.data.result.alarms || []
      this.total = res.data.result.count
    },
    getDate(type) {
      let begin_time, end_time
      const obj = {}
      if (type === 'now') {
        begin_time = this.$dayjs()
          .subtract(3600, 'second')
          .format('YYYY-MM-DD HH:mm')
        end_time = this.$dayjs().format('YYYY-MM-DD HH:mm')
      } else if (type === 'day') {
        begin_time = this.$dayjs().format('YYYY-MM-DD') + ' 00:00'
        end_time = this.$dayjs().format('YYYY-MM-DD') + ' 23:59'
      } else if (type === 'week') {
        begin_time =
          this.$dayjs().subtract(7, 'day').format('YYYY-MM-DD') + ' 00:00'
        end_time = this.$dayjs().format('YYYY-MM-DD') + ' 23:59'
      } else if (type === 'month') {
        begin_time =
          this.$dayjs().subtract(30, 'day').format('YYYY-MM-DD') + ' 00:00'
        end_time = this.$dayjs().format('YYYY-MM-DD') + ' 23:59'
      }
      obj.end_time = end_time
      obj.begin_time = begin_time
      // obj.begin_time = '2021-06-01 15:48'
      // obj.end_time = '2021-06-25 16:48'
      this.chooseDate = obj
    }
  }
}
</script>

<style lang="scss" scoped>
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
