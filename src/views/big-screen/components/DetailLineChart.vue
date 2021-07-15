<template>
  <div class="detail-chart">
    <div class="chart-tool">
      <div class="left-text">

        <div class="chart-box-title">测温点温度曲线</div>
        <div class="content-crumbs">
          <div class="content-crumb">{{ alarmItem.Bath }}</div>
          <div class="content-crumb">{{ alarmItem.t_id }}</div>

        </div>
      </div>
      <div class="right-btns">
        <div
          class="btn"
          @click="refresh"
        >
          <svg-icon
            class="svg"
            icon-class="refresh"
          /> 刷新
        </div>
        <div
          class="btn"
          @click="exportChart"
        >
          <svg-icon
            class="svg"
            icon-class="export"
          /> 导出
        </div>
      </div>
    </div>
    <div class="detail-chart-box">
      <div class="select-date">
        <span class="select-date-text">数据日期：</span>
        <!-- <el-date-picker
          v-model="date"
          type="date"
          placeholder="选择日期"
          class="screen-select"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptionsSingle"
          @change="changeDate"
        /> -->
        <Date-picker
          :value="date"
          type="daterange"
          :options="pickerOptions"
          placeholder="选择日期"
          style="width: 200px"
          @on-change="changeDate"
        />
      </div>
      <div
        :id="id"
        :class="className"
        :style="{height:height,width:width}"
      />
    </div>
    <Modal
      v-model="exportDialogVisible"
      title="导出"
      width="40%"
      center
    >
      <div class="export-filter">
        <div class="filter-items">
          <div class="filter-item">
            <div class="filter-item-label">
              导出点位
            </div>
            <div class="filter-item-content">

              <div class="content-crumbs">
                <div class="content-crumb">{{ alarmItem.Company }}</div>
                <div class="content-crumb">{{ alarmItem.Factory }}</div>
                <div class="content-crumb">{{ alarmItem.Area }}</div>
                <div class="content-crumb">{{ alarmItem.Bath }}</div>
                <div class="content-crumb">{{ alarmItem.t_id }}</div>
              </div>
            </div>
          </div>
          <div class="filter-item">
            <div class="filter-item-label">
              时间范围
            </div>
            <div class="filter-item-content">
              <!-- <el-date-picker
                v-model="exportDate"
                type="daterange"
                :picker-options="pickerOptions"
                range-separator="至"
                placeholder="选择日期"
                class="screen-select"
                unlink-panels
                @change="changeExportDate"
              >
                />
              </el-date-picker> -->
              <Date-picker
                :value="exportDate"
                type="daterange"
                :options="pickerOptions"
                placeholder="选择日期"
                style="width: 200px"
                @on-change="changeExportDate"
              />
            </div>
          </div>
          <!-- <div class="filter-item">
            <div class="filter-item-label">
              温度数据
            </div>
            <div class="filter-item-content">
              <el-checkbox-group
                v-model="checkedTemp"
                @change="handleCheckedTempChange"
              >
                <el-checkbox
                  v-for="temp in Temps"
                  :key="temp"
                  :label="temp"
                >{{ temp }}</el-checkbox>
              </el-checkbox-group>

            </div>
          </div> -->
        </div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <!-- <el-button
          class="detail-ok-btn"
          @click="exportPoint"
        >导出</el-button> -->
        <Dropdown
          trigger="click"
          @on-click="exportPoint"
        >
          <!-- <span class="el-dropdown-link">
            导出<i class="el-icon-arrow-down el-icon--right" />
          </span> -->
          <Button class="detail-ok-btn">导出</Button>
          <DropdownMenu slot="list">
            <DropdownItem name="1">压缩</DropdownItem>
            <DropdownItem name="0">不压缩</DropdownItem>

          </DropdownMenu>
        </Dropdown>
        <Button
          class="detail-cancel-btn"
          @click="exportDialogVisible = false"
        >取消</Button>
      </span>
    </Modal>
  </div>

</template>

<script>
import * as echarts from 'echarts'
import resize from './mixins/resize'
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'
// import { color } from 'echarts'
import Button from 'iview/src/components/button'
import DatePicker from 'iview/src/components/date-picker'
import Modal from 'iview/src/components/modal'
import Dropdown from 'iview/src/components/dropdown'
import DropdownMenu from 'iview/src/components/dropdown-menu'
import DropdownItem from 'iview/src/components/dropdown-item'

const alarmColor = '#ff2f14'
export default {
  name: 'DetailLineChart',
  components: {
    Button,
    DatePicker,
    Modal,
    Dropdown,
    DropdownMenu,
    DropdownItem
  },
  mixins: [resize],
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    },
    // warningVal: {
    //   type: Number,
    //   default: 0
    // },
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'DetailLineChart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '90%'
    }
  },

  data() {
    return {
      chart: null,
      exportDialogVisible: true,

      option: null,
      timer: null,
      // warningVal: 250,
      // xData: [],
      newList: [],
      checkedTemp: [],
      Temps: ['原始温度数据', '最高温度', '最低温度', '平均温度'],
      now: 0,
      date: [],
      exportDate: [],
      value: Math.random() * 100,
      // step:  60 * 1000 // 1分钟
      step: (10 / 60) * 60 * 1000,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [
          {
            text: '最近三天',
            value() {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 2)
              return [start, end]
            }
          },
          {
            text: '最近一周',
            value() {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
              return [start, end]
            }
          },
          {
            text: '最近30天',
            value() {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 29)
              return [start, end]
            }
          }
        ]
      },
      pickerOptionsSingle: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      alarmItem: (state) => state.station.alarmItem
    }),
    ...mapGetters(['warningVal', 'unusualVal']),
    xData() {
      return this.newList.map((v) => {
        const time = this.$dayjs(v.pick_time).format('YYYY-MM-DD HH:mm:ss')
        return { value: [time, v.fv] }
      })
    }
  },
  watch: {
    list: {
      handler(newName, oldName) {
        this.newList = [...newName]
        // this.xData = newName.map((v) => {
        //   const time = this.$dayjs(v.pick_time).indexOf()
        //   return { value: [time, v.fv] }
        // })
        this.initChart()
      },
      deep: true
    }
  },
  mounted() {
    this.date = this.$dayjs(this.alarmItem.AlarmTime).format('YYYY-MM-DD')
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
    clearInterval(this.timer)
  },
  methods: {
    exportPoint(is_compress) {
      const flag = is_compress === '1'
      if (this.exportDate.length < 1) {
        this.$message.error('请先选择日期')
        return
      }
      const params = { arr: this.exportDate, is_compress: flag }
      this.$emit('exportPoint', params)
    },
    changeDate(date) {
      this.$emit('changeDate', date)
    },
    changeExportDate(arr) {
      this.exportDate = arr
    },
    refresh(val) {
      this.$emit('refresh', val)
    },
    hideExport(val) {
      this.exportDialogVisible = false
    },
    handleCheckedTempChange(val) {},
    // 生成从minNum到maxNum的随机数
    exportChart(Min, Max) {
      this.exportDialogVisible = true
    },

    randomNum(Min, Max) {
      var Range = Max - Min
      var Rand = Math.random()
      var num = Min + Math.round(Rand * Range) // 四舍五入
      return num
    },

    randomData() {
      this.now += this.step
      this.value = this.randomNum(50, 150)
      return {
        name: this.now.toString(),
        // name: '小明',
        value: [this.now, Math.round(this.value)]
      }
    },

    initChart() {
      const that = this
      this.chart = echarts.init(document.getElementById(this.id))
      this.now = this.$dayjs().valueOf()
      // for (let i = 0; i < 100; i++) {
      //   this.xData.push(this.randomData())
      // }
      // this.xData = this.newList.map((v) => {
      //   const time = that.$dayjs(v.pick_time).format('YYYY-MM-DD HH:mm')
      //   return { value: [time, v.fv] }
      // })
      this.option = {
        color: ['#18BAD7'],

        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#000'
              }
            }
          }
        },
        grid: {
          top: '10%',
          left: '2%',
          right: '5%',
          bottom: '5%',
          containLabel: true
        },
        visualMap: [
          {
            show: false,
            dimension: 1,
            pieces: [
              { gte: that.warningVal, lte: 5000, color: alarmColor },
              { gte: -100, lte: that.unusualVal, color: alarmColor }
            ], // pieces的值由动态数据决定
            outOfRange: {
              color: '#18BAD7'
            }
          }
        ],
        calculable: true,
        lineStyle: {
          width: 1
        },

        xAxis: {
          type: 'time',
          // name: '年-月-日',
          boundaryGap: false,
          splitNumber: 5,
          axisLabel: {
            formatter(value) {
              // const time = that.$dayjs(value).format('HH:mm:ss')
              const time = that.$dayjs(value).format('HH:mm')
              return time
            },
            color: '#999'
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#394056'
            }
          },
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          scale: true,

          // name: '温度',
          min: 0,
          boundaryGap: false,
          axisLabel: {
            color: '#999'
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#394056'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#394056'
            }
          }
        },
        series: [
          {
            name: '温度',
            type: 'line',
            symbol: 'none',
            xAxisIndex: 0,
            yAxisIndex: 0,
            itemStyle: {
              opacity: 0,
              normal: {
                // color: '#6cb041',
                lineStyle: {
                  width: 3 // 设置线条粗细
                }
              }
            },

            areaStyle: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: 'rgba(6, 125, 194, 0.2)'
                  },
                  {
                    offset: 0.8,
                    color: 'rgba(24, 186, 215, 0.2)'
                  }
                ],
                false
              ),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            },
            data: this.xData,
            smooth: false,
            // 标记的线
            markLine: {
              symbol: 'none',
              silent: true,
              lineStyle: { type: 'solid' },
              label: { position: 'start' },
              data: [
                {
                  yAxis: that.warningVal,
                  lineStyle: { width: 1, color: alarmColor },
                  label: { show: false }
                },
                {
                  yAxis: that.unusualVal,
                  lineStyle: { width: 1, color: alarmColor },
                  label: { show: false }
                }
                // { type: 'average', name: '平均值' }
              ]
            },
            /*
             * 标记的文字
             */
            markPoint: {
              silent: true,
              label: { fontSize: 33.12 },
              data: [
                {
                  yAxis: that.warningVal,
                  x: '0%',
                  symbolSize: 0.1,
                  label: {
                    textStyle: { color: alarmColor },
                    // padding: [3.312, 8.28],
                    fontSize: 22,
                    fontWeight: 'bold',
                    // borderRadius: 13.248,
                    // backgroundColor: 'rgba(255, 72, 74, 0.5)',
                    position: 'right',
                    formatter: `${that.warningVal}℃`
                  }
                },
                {
                  yAxis: that.unusualVal,
                  x: '0%',
                  symbolSize: 0.1,
                  label: {
                    textStyle: { color: alarmColor },
                    // padding: [3.312, 8.28],
                    fontSize: 20,
                    // fontWeight: 'bold',
                    // borderRadius: 13.248,
                    // backgroundColor: 'rgba(255, 72, 74, 0.5)',
                    position: 'right',
                    formatter: `${that.unusualVal}℃`
                  }
                }
                // {
                //   yAxis: 80,
                //   x: '100%',
                //   symbolSize: 0.1,
                //   label: {
                //     textStyle: { color: '#fff' },
                //     padding: [3.312, 8.28],
                //     fontSize: 36.432,
                //     borderRadius: 13.248,
                //     backgroundColor: 'rgba(255, 72, 74, 0.5)',
                //     position: 'left',
                //     formatter: ''
                //   }
                // },
                // { type: 'max', name: '最大值' },
                // { type: 'min', name: '最小值' }
              ]
            }
          }
        ]
      }

      this.chart.setOption(this.option, true)

      // this.timer = setInterval(() => {
      //   for (let i = 0; i < 5; i++) {
      //     this.xData.shift()
      //     this.xData.push(this.randomData())
      //   }

      //   this.chart.setOption(this.option, true)
      // }, this.step)
    }
  }
}
</script>
<style lang="scss" scoped>
.svg {
  margin-right: 8px;
}
.export-filter {
  .filter-items {
    .filter-item {
      @include flex(flex-start, flex-start);
      margin-bottom: 20px;
      width: 100%;
      .filter-item-label {
        font-size: 16px;
        line-height: 32px;
        color: #fff;
        width: 70px;
      }
      .filter-item-content {
        flex: 1;
        line-height: 32px;
        margin-left: 25px;
        .content-crumbs {
          color: #999;
        }
      }
    }
  }
}
.detail-chart {
  height: 80%;
  width: 100%;

  .chart-tool {
    @include flex(space-between, center);
    margin-bottom: 15px;
    .left-text {
      @include flex(flex-start, baseline);
      .content-crumbs {
        margin-left: 20px;
      }
    }
    .right-btns {
      @include flex();

      .btn {
        @include flex();
        width: 100px;
        height: 32px;
        background: rgba(255, 255, 255, 0.1);
        margin-right: 15px;
        border-radius: 4px;
        color: #fff;
        cursor: pointer;
      }
    }
  }
  .detail-chart-box {
    @include flex(space-between, center);
    flex-direction: column;
    padding: 20px 0;
    width: 100%;
    height: calc(100% - 49px);
    background: rgba(255, 255, 255, 0.04);
    .select-date {
      @include flex(flex-end, center);
      padding: 0 20px;
      width: 100%;
      ::v-deep .el-date-editor.el-input {
        width: 160px;
      }
      ::v-deep .el-input__inner {
        background: rgba(255, 255, 255, 0.1);
        height: 24px;
        line-height: 24px;
        border: 0;
        border-radius: 0;
        color: #fff;
      }
      ::v-deep .el-input__icon {
        line-height: 24px;
      }
      .select-date-text {
      }
    }
  }
}
</style>
