<template>
  <div class="detail-chart">
    <div class="chart-tool">
      <div class="left-text">

        <div class="title">测温点温度曲线</div>
        <div class="content-crumbs crumbs">
          <div class="content-crumb">{{ alarmItem.Bath }}</div>
          <div class="content-crumb">{{ alarmItem.t_id }}</div>

        </div>
      </div>

    </div>
    <div class="info">
      <div class="info-item">当前温度:
        <span
          class="temp"
          :class="pointTextClass(alarmItem)"
        >{{ nowTemp }}</span>
      </div>
      <div class="info-item">告警状态:
        <span :class="pointTextClass(alarmItem)">
          {{ alarmItem.alarm_id && alarmItem.alarm_id | typeText }}
        </span>
      </div>
    </div>
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
        :clearable="false"
        :value="date"
        type="daterange"
        :options="pickerOptions"
        placeholder="选择日期"
        style="width: 200px"
        class="date-range-box"
        @on-change="changeDate"
      />
    </div>

    <div class="detail-chart-box">
      <div
        v-if="xData.length < 1"
        class="no-data"
      >
        <Status
          img="null"
          text="暂无数据"
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
                :clearable="false"
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
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'

export default {
  name: 'DetailLineChart',
  components: {},
  filters: {
    typeText(val) {
      let res = ''
      if (val === 'temperature_high') {
        res = '温度告警'
      } else if (val === 'offline') {
        res = '离线'
      } else if (val === 'rate_high') {
        res = '趋势预警'
      } else if (val === 'abnormal') {
        res = '设备异常'
      } else {
        res = '正常'
      }
      return res
    }
  },
  // mixins: [resize],
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
      default: '100%'
    }
  },
  data() {
    return {
      chart: null,
      exportDialogVisible: false,
      tempMin: 999,
      option: null,
      timer: null,
      // warningVal: 250,
      // xData: [],
      newList: [],
      checkedTemp: [],
      Temps: ['原始温度数据', '最高温度', '最低温度', '平均温度'],
      now: 0,
      date: [],
      xData: [],
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
      alarmItem: (state) => state.station.alarmItem,
      tempHeight: (state) => state.station.tempHeight,
      currentPoint: (state) => state.station.currentPoint
    }),

    nowTemp() {
      return (
        (this.list.length > 1 && this.list[this.list.length - 1]['fv']) || ''
      )
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
        if (this.newList.length > 0) {
          this.xData = this.newList.map((v) => {
            const temp = v.fv
            const time = this.$dayjs(v.pick_time).format('YYYY-MM-DD HH:mm:ss')
            this.tempMin = this.tempMin < temp ? this.tempMin : temp
            return { value: [time, temp] }
          })
          this.initChart()
        }
      },
      deep: true
    }
  },
  mounted() {
    const sDate =
      this.$dayjs(this.alarmItem.AlarmTime).format('YYYY-MM-DD') + ' 00:00'
    const eDate =
      this.$dayjs(this.alarmItem.AlarmTime).format('YYYY-MM-DD') + ' 23:59'
    this.date = [sDate, eDate]
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
    pointTextClass(point) {
      let res = ''
      const val = point.alarm_id

      if (val === 'rate_high') {
        res = 'wram-text'
      } else if (val === 'offline') {
        res = ''
      } else if (val === 'temperature_high') {
        res = 'red-text'
      } else if (val === 'abnormal') {
        res = 'red-text'
      } else {
        res = 'null-text'
      }

      return res
    },
    initChart() {
      const that = this
      this.chart = this.$echarts.init(document.getElementById(this.id))
      this.now = this.$dayjs().valueOf()
      const colorAlarmB = 'hsla(354, 100%, 57%, 1)'
      const colorTheme = 'hsla(190, 80%, 48%, 1)'
      const colorTheme2 = colorTheme.slice(0, -2) + '0.1)'
      const colorTheme3 = colorTheme.slice(0, -2) + '0.2)'
      this.option = {
        color: ['#18BAD7'],

        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            // bubble-temp 的样式在 style.css
            return `
              <div style="padding: 10px; border-radius: 4px; background: rgba(0, 0, 0, 0.5);">
                <div style="font-family: 'DIN'; font-size: 14px; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5)">
                  ${that.util.formatTime(params[0].value[0])}
                </div>
                <div class="bubble-temp" style="color: ${params[0].color};">
                  ${parseFloat(params[0].value[1]).toFixed(2)}
                </div>
              </div>
            `
          },
          backgroundColor: 'transparent',
          axisPointer: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } }
        },

        grid: { borderWidth: 0, top: 20, left: 76, right: 40, bottom: 40 },

        visualMap: [
          {
            show: false,
            dimension: 1,
            pieces: [
              // { gte: that.warningVal, lte: 5000, color: colorAlarmB },
              // { gte: -100, lte: 200, color: colorTheme }
              {
                gt: 0,
                lte: that.tempHeight,
                color: colorTheme
              },
              {
                gt: that.tempHeight,
                lte: 5000,
                color: colorAlarmB
              }
            ]
          }
        ],
        calculable: true,
        lineStyle: {
          width: 1
        },

        xAxis: {
          type: 'time',
          boundaryGap: false,
          splitNumber: 12,
          axisLabel: {
            textStyle: {
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: 14
            },
            // 坐标轴刻度标签的相关设置。
            formatter: function (params) {
              let res = ''
              const top = that.$dayjs(params).format('MM-DD')
              const bottom = that.$dayjs(params).format('HH:mm')
              res = top + '\n' + bottom
              return res
            }
          },
          axisTick: {
            show: false
          },
          axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          scale: true,
          boundaryGap: false,
          axisLabel: {
            formatter: '{value}°C',
            textStyle: {
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: 14
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
          min: Math.floor(this.tempMin / 10 - 1) * 10
        },
        series: [
          {
            name: '温度',
            type: 'line',
            symbol: 'none',
            lineStyle: { width: 2, join: 'round' },

            xAxisIndex: 0,
            yAxisIndex: 0,
            itemStyle: {
              opacity: 0
              // normal: {
              //   // color: '#6cb041',
              //   lineStyle: {
              //     width: 3 // 设置线条粗细
              //   }
              // }
            },

            areaStyle: {
              color: new this.$echarts.graphic.LinearGradient(
                0,
                0,
                1,
                0,
                [
                  {
                    offset: 1,
                    color: colorTheme2
                  },
                  {
                    offset: 0,
                    color: colorTheme3
                  }
                ],
                false
              )
            },
            data: this.xData,
            smooth: false,
            // 标记的线
            markLine: {
              silent: true,
              symbol: 'none',
              lineStyle: {
                type: 'solid',
                width: 1,
                color: colorAlarmB
              },
              label: {
                type: 'value',
                position: 'start',
                distance: 5,
                formatter: '{c}°C',
                fontSize: 14,
                fontWeight: 600,
                color: colorAlarmB
              },
              data: [{ yAxis: that.tempHeight }]
            },
            markPoint: {
              silent: true,
              symbol: 'rect',
              symbolSize: [70, 26],
              label: {
                formatter: '{c}°C',
                padding: [16, 16, 12, 16],
                fontSize: 16,
                fontfamily: 'DIN',
                fontWeight: 600,
                borderRadius: 4,
                color: 'rgba(255, 255, 255, 1)',
                backgroundColor: 'rgba(30, 30, 30, 0.7 )'
              },
              itemStyle: { color: 'transparent' },
              data: [
                { type: 'max', name: '最高温度' },
                { type: 'min', name: '最低温度' }
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
  height: 100%;
  width: 100%;
  padding: 0 20px;
  .chart-tool {
    @include flex(space-between, center);
    margin-bottom: 15px;
    .left-text {
      @include flex(flex-start, baseline);
      .content-crumbs {
        margin-left: 20px;
        font-weight: bold;
        font-size: 16px;
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
      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
    }
  }
  .detail-chart-box {
    @include flex(space-between, center);
    flex-direction: column;
    width: calc(100% + 60px);
    height: calc(100% - 150px);
    position: relative;
    margin: 0 -30px;
    .no-data {
      @include flex();

      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      margin: auto;
      height: 100%;
      width: 100%;
    }
  }
}

.info {
  display: flex;
  gap: 20px;
  margin: 16px 0;
  width: 100%;
  &-item {
    display: flex;
    gap: 10px;
    padding: 14px 0;
    width: 50%;
    font-size: 16px;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.05);
    box-shadow: 0 10px 20px -10px rgba(0, 0, 0, 0.6);
    .alarm-b {
      color: var(--alarmB);
    }
    span {
      font-size: 20px;
      font-weight: 600;
    }
    .temp {
      display: flex;
      font-family: 'DIN', 'PingFang SC', 'Microsoft Yahei', sans-serif;
      &:after {
        display: inline-block;
        margin: 0px 0 auto 0;
        content: '°C';
        font-size: 14px;
      }
    }
  }
}
.null-text {
  color: var(--theme);
}
.offline-text {
  color: var(--alarmA);
}
.wram-text {
  color: var(--alarmC);
}
.red-text {
  color: var(--alarmB);
}
.date-range-box {
  ::v-deep .ivu-input {
    // background: rgba(255, 255, 255, 0.1);
    // height: 24px;
    // line-height: 24px;
    // border: 0;
    // border-radius: 0;
    // color: #fff;
    display: inline-block;
    // padding: 10px 20px !important;
    height: 36px;
    line-height: 36px;
    border-radius: 4px !important;
    font-family: 'DIN' !important;
    align-items: center !important;
    background: rgba(255, 255, 255, 0.05) !important;
    box-shadow: 0 10px 20px -10px rgb(0 0 0 / 60%) !important;
  }
  ::v-deep .ivu-input-suffix {
    .ivu-icon {
      line-height: 36px;
      font-size: 20px;
    }
  }
}
</style>
