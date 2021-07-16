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
          <!-- <el-button
            type="primary"
            @click="addNewDevice()"
          >增加设备</el-button>
          <el-button
            type="primary"
            @click="refreshDevice"
          >刷新</el-button> -->
          <!-- <el-button
            v-if="multipleSelection.length>0"
            type="danger"
          >删除已选</el-button> -->
          <el-select
            v-model="factoryStr"
            placeholder="选择厂区"
            style="width: 120px; margin-right: 10px"
            class="filter-item"
            @change="selectFactory"
          >
            <el-option
              v-for="(item,i) in factoryList"
              :key="'a' + i"
              :label="item.s_name"
              :value="item.uid"
            />

          </el-select>
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
          <!-- <el-table-column
            type="selection"
            width="55"
          /> -->

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
        res = '断线'
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
      tableData: [],
      queryParams: {
        page: 1,
        size: 10
      },
      dateRange: [],
      chooseDate: {},
      companyList: [],
      factoryList: [],
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
    // 生命周期钩子：组件实例创建完成，属性已绑定，但 DOM 还未生成，el 属性还不存在
    // 初始化渲染页面
  },

  mounted() {
    // 生命周期钩子：模板编译、挂载之后（此时不保证已在 document 中）
    this.pickerOptions = this.getPickerOptions()
    this.factoryStr = getCurrentFactory().uid
    this.queryCompany()
    this.getDate('day')
    this.queryWarning()

    this.dateRange = [this.chooseDate.begin_time, this.chooseDate.end_time]
  },

  methods: {
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
    selectFactory(val) {
      const obj = this.factoryList.find((v) => v.uid === val)
      setCurrentFactory(obj)
      this.queryWarning(val)
    },
    async queryCompany() {
      const res = await company(1)

      this.companyList = (res.data.result && res.data.result.stations) || []

      const id_company = this.companyList.find(
        (v) => v.s_name === '云南分公司'
      ).uid
      const factoryResult = await factory(id_company, 1)
      this.factoryList =
        (factoryResult.data.result && factoryResult.data.result.stations) || []
      // this.factoryList = list.map((v) => {
      //   return { value: v.uid, label: v.s_name }
      // })
    },
    typeFunc(type) {
      let res = ''
      if (type === 'temperature_high') {
        res = 'danger'
      } else if (type === 0) {
        res = 'info'
      } else if (type === 'offline') {
        res = 'warning'
      }
      return res
    },
    refreshDevice(item) {
      console.log('item :>> ', item)
    },
    addNewDevice(item) {
      console.log('item :>> ', item)
    },
    delDevice(item) {
      console.log('item :>> ', item)
    },
    changePage(page) {
      this.queryWarning()
    },
    async queryWarning(factoryId) {
      // {factory: true, tid, page, size: 8, begin_time, begin_time, alarm_id: 'all' }
      const obj = {
        begin_time: '',
        t_id: factoryId || getCurrentFactory().uid
      }
      const parmas = {
        ...obj,
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

<style lang="scss" scoped></style>
