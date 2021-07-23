<template>
  <div id="module">
    <div class="title">告警点位温度曲线</div>
    <div class="info">
      <div class="left">
        <div class="position">{{ currentAlarmObj.Area }} / {{ currentAlarmObj.Bath }}</div>
        <div class="msg alarm-b">{{ currentAlarmObj.t_id }}: {{ currentAlarmObj.alarm_name }}</div>
      </div>
      <div class="right">
        <div class="temp-text">当前温度</div>
        <div
          class="temp alarm-b "
          :class="{'alarm-b':nowTemp>warningVal}"
        >{{ nowTemp }}</div>
      </div>
    </div>
    <div class="chart">
      <div id="alarm-point" />
      <div
        v-show="alarmListIndex !== 0 && hasAlarm"
        class="iconfont icon-arrow left"
        @click="clickArrow(0)"
      />
      <div
        v-show="alarmListIndex !== alarmList.length - 1 && hasAlarm"
        class="iconfont icon-arrow right"
        @click="clickArrow(1)"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'
import { deviceHistory, devicePoint } from '@/api/station'
import sortBy from 'lodash/sortBy'

export default {
  name: 'AlarmPoint',

  data() {
    return {
      tempMin: 300,

      chart: null,
      alarmListIndex: 0,
      exportDialogVisible: false,

      value: Math.random() * 100,
      step: 8 * 1000,
      option: null,
      timer: null,
      // warningVal: 250,
      // xData: [],
      newList: [],
      checkedTemp: [],
      Temps: ['原始温度数据', '最高温度', '最低温度', '平均温度'],
      now: 0,
      date: '',
      exportDate: [],
      allPointList: [
        {
          tid: '',
          value: 0
        }
      ],
      list: [
        // {
        //   fv: 0,
        //   pick_time: '',
        //   pid: '',
        //   tid: ''
        // }
      ],

      queryParams: {
        sTime: '',
        eTime: '',
        id: ''
      }
    }
  },
  computed: {
    ...mapState({
      alarmList: (state) => state.station.alarmList
    }),
    ...mapGetters(['warningVal', 'unusualVal']),

    currentAlarmObj: {
      get() {
        return (
          (this.alarmList.length > 0 &&
            this.alarmList[this.alarmListIndex]) || { Area: '' }
        )
      },
      set(v) {}
    },

    hasAlarm() {
      return this.alarmList.length > 0
      // return this.list.length > 0
    },
    xData() {
      return this.list.map((v) => {
        this.tempMin = this.tempMin < v.fv ? this.tempMin : v.fv

        const time = this.$dayjs(v.pick_time).format('YYYY-MM-DD HH:mm:ss')
        return { value: [time, v.fv] }
      })
    },
    nowTemp() {
      const obj = this.allPointList.find(
        (v) => v.tid === this.currentAlarmObj.t_id
      )
      return obj ? obj.value : 0
    },
    averageTemp() {
      const sum = this.list.reduce((pre, cur) => {
        return cur.fv + pre
      }, 0)
      const res = sum ? (sum / this.list.length).toFixed(1) : 0
      return Number(res)
    }
  },
  watch: {
    alarmList: {
      handler(newName, oldName) {
        clearInterval(this.timer)

        // this.newList = [...newName]
        if (newName.length > 0) {
          this.init()
          this.timer = setInterval(() => {
            this.loop()
          }, this.step)
        } else {
          this.list = []
          this.initChart()
        }
      },
      deep: true
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  mounted() {},
  methods: {
    init() {
      // this.currentAlarmObj = this.alarmList[0]
      this.queryParams.sTime =
        this.$dayjs(this.currentAlarmObj.AlarmTime).format('YYYY-MM-DD') +
        ' 00:00'
      this.queryParams.eTime =
        this.$dayjs(this.currentAlarmObj.AlarmTime).format('YYYY-MM-DD') +
        ' 23:59'

      this.queryPiont()
      this.queryPiontHistory()
    },
    clickArrow(isAdd) {
      if (!this.hasAlarm) {
        return
      }
      if (isAdd) {
        this.alarmListIndex++
      } else {
        this.alarmListIndex--
      }
      this.init()
    },
    loop() {
      this.alarmListIndex++
      if (this.alarmListIndex === this.alarmList.length) {
        this.alarmListIndex = 0
      } else if (this.alarmListIndex === -1) {
        this.alarmListIndex = this.alarmList.length - 1
      }
      this.init()
    },
    queryPiont() {
      devicePoint(this.currentAlarmObj.BathID)
        .then((res) => {
          const arr = res.data.result || []
          this.allPointList = arr
          // this.setFuncOfpoint()
        })
        .catch((err) => {
          this.$message(err)
        })
    },
    queryPiontHistory(date) {
      this.queryParams.id = this.currentAlarmObj.t_id
      deviceHistory(this.queryParams)
        .then((res) => {
          const arr = res.data.result || []
          this.list = sortBy(arr, (v) => v.pick_time)
          this.initChart()
        })
        .catch((err) => {
          this.$message(err)
        })
    },
    initChart() {
      const that = this
      this.now = this.$dayjs().valueOf()

      this.chart = this.$echarts.init(document.getElementById('alarm-point'), {
        renderer: 'svg'
      })

      // 处理颜色
      const colorAlarmB = 'hsla(354, 100%, 57%, 1)'
      const colorTheme = 'hsla(190, 80%, 48%, 1)'
      const colorTheme2 = colorTheme.slice(0, -2) + '0.1)'
      const colorTheme3 = colorTheme.slice(0, -2) + '0.2)'

      this.chart.setOption({
        grid: { borderWidth: 0, top: 20, left: 56, right: 20, bottom: 20 },
        legend: { show: false },
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
        xAxis: {
          type: 'time',
          axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
          axisTick: { show: false },
          splitNumber: 9,
          axisLabel: {
            textStyle: {
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: 10
            },
            formatter(value) {
              // const time = that.$dayjs(value).format('HH:mm:ss')
              const time = that.$dayjs(value).format('HH:mm')
              return time
            }
          },
          splitLine: { show: false }
        },
        // yAxis: {
        //   type: 'value',
        //   axisLine: { show: false },
        //   splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.2)' } },
        //   splitNumber: 5,
        //   interval: 20,
        //   axisLabel: {
        //     formatter: '{value}°C',
        //     textStyle: {
        //       color: 'rgba(255, 255, 255, 0.6)',
        //       fontSize: 10
        //     }
        //   },
        //   min: Math.floor(this.tempMin / 10 - 2) * 10
        // },
        yAxis: {
          type: 'value',
          scale: true,

          // name: '温度',
          // min: 0,
          boundaryGap: false,
          axisLabel: {
            formatter: '{value}°C',
            textStyle: {
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: 10
            }
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
        visualMap: [
          {
            show: false,
            dimension: 1,
            pieces: [
              // { gte: that.warningVal, lte: 5000, color: colorAlarmB },
              // { gte: -100, lte: 200, color: colorTheme }
              {
                gt: 0,
                lte: 250,
                color: colorTheme
              },
              {
                gt: 250,
                lte: 500,
                color: colorAlarmB
              }
            ]
          }
        ],
        // visualMap: {
        //   show: false,
        //   pieces: [
        //     {
        //       gt: 0,
        //       lte: this.tempHigh,
        //       color: colorTheme
        //     },
        //     {
        //       gt: this.tempHigh,
        //       lte: 500,
        //       color: colorAlarmB
        //     }
        //   ]
        // },
        series: {
          name: '温度',
          type: 'line',
          data: this.xData,
          symbolSize: 0,
          lineStyle: { width: 2, join: 'round' },
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
            data: [{ yAxis: that.warningVal }]
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#module {
  height: 34%;
}
.info {
  display: flex;
  margin-top: 16px;
  .left {
    margin-right: 10px;
    width: calc(65% - 10px);
  }
  .position,
  .temp-text {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
  }
  .msg {
    margin-top: 8px;
  }
  .alarm-b {
    font-weight: 800;
    color: var(--alarmB);
  }
  .right {
    display: flex;
    flex-direction: column;
    width: 35%;
    text-align: right;
    justify-content: right;
  }
  .temp {
    display: flex;
    margin: 6px 0 auto auto;
    font-size: 18px;
    font-family: 'DIN', 'PingFang SC', 'Microsoft Yahei', sans-serif;

    &:after {
      display: inline-block;
      margin: 0px 0 auto 0;
      content: '°C';
      font-size: 12px;
    }
  }
}

.chart {
  position: relative;
  height: calc(100% - 78px);
  width: 100%;
  #alarm-point {
    height: 100%;
    width: 100%;
  }
  .icon-arrow:before {
    position: absolute;
    display: inline-block;
    top: 45%;
  }
  .left:before {
    left: -16px;
    transform: scale(1.4, 2.8) rotate(90deg);
    opacity: 0.7;
  }
  .right:before {
    right: -16px;
    transform: scale(1.4, 2.8) rotate(-90deg);
    opacity: 0.7;
    cursor: pointer;
  }
}
</style>
