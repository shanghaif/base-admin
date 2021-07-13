<template>
  <div class="alarm-chart">
    <div class="chart-box-title">异常点位温度曲线</div>
    <div
      class="alarm-chart-content"
      :class="{'no-data':!hasAlarm}"
    >

      <div
        v-if="list.length>0"
        class="chart-box-tool"
      >
        <div class="hart-box-describe">
          <div class="hart-box-describe-left">
            <div
              v-if="currentAlarmObj"
              class="chart-dt"
            >{{ currentAlarmObj.Area }}/{{ currentAlarmObj.Bath }}</div>
            <div
              v-if="currentAlarmObj"
              class="err-text"
            >{{ currentAlarmObj.t_id }}: {{ currentAlarmObj.alarm_name }}</div>
          </div>
          <div class="hart-box-describe-right">
            <div class="temperature cur-tem">
              <span>当前温度：</span>
              <span
                class="tem-val "
                :class="{err:nowTemp>warningVal}"
              >{{ nowTemp }}℃</span>

            </div>
            <div class="temperature average-tem">
              <span>平均温度：</span>
              <span class="tem-val">{{ averageTemp }}℃</span>

            </div>
          </div>
        </div>
      </div>
      <div class="detail-chart-box">

        <div
          :id="id"
          :class="className"
          :style="{height:height,width:width}"
        />
        <div
          v-show="alarmListIndex !== 0 && hasAlarm"
          class="arrow left"
          @click="clickArrow(0)"
        >
          <i class="icon el-icon-arrow-left" />
        </div>
        <div
          v-show="alarmListIndex !== alarmList.length - 1 && hasAlarm"
          class="arrow right"
          @click="clickArrow(1)"
        >
          <i class="icon el-icon-arrow-right" />
        </div>
      </div>

    </div>

  </div>

</template>

<script>
import * as echarts from 'echarts'
import resize from './mixins/resize'
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'
import { color } from 'echarts'
import { deviceHistory, devicePoint } from '@/api/station'
import sortBy from 'lodash/sortBy'

const alarmColor = '#ff2f14'
// 通过arrow点击索引来改变当前的报警对象,在init请求数据更新
export default {
  name: 'AlarmChart',
  components: {},
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'AlarmChart'
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
      alarmListIndex: 0,
      exportDialogVisible: false,

      value: Math.random() * 100,
      // step:  60 * 1000 // 1分钟
      step: (10 / 60) * 60 * 1000,
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
        return this.alarmList[this.alarmListIndex]
      },
      set(v) {}
    },

    hasAlarm() {
      return this.alarmList.length > 0
    },
    xData() {
      return this.list.map((v) => {
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
          }, 6000)
        } else {
          this.list = []
          this.initChart()
        }
      },
      deep: true
    }
  },
  mounted() {
    // this.date = this.$dayjs(this.alarmItem.AlarmTime).format('YYYY-MM-DD')
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
      this.chart = echarts.init(document.getElementById(this.id))
      this.now = this.$dayjs().valueOf()
      // for (let i = 0; i < 100; i++) {
      //   this.xData.push(this.randomData())
      // }
      // this.xData = this.list.map((v) => {
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
            name: '实时温度',
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
            smooth: true,
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
                    fontSize: 16,
                    // fontWeight: 'bold',
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
                    fontSize: 16,
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
.export-filter {
  .filter-items {
    .filter-item {
      @include flex(flex-start, flex-start);
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
          color: #525252;
        }
      }
    }
  }
}
.alarm-chart {
  height: 35%;
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
  .alarm-chart-content {
    height: calc(100% - 60px);
    margin-top: 15px;
    position: relative;

    &.no-data {
      &::before {
        content: '暂无数据';
        position: absolute;
        margin: 0;
        height: 100%;
        width: 100%;
        @include flex();
        background: rgba(255, 255, 255, 0.1);
        color: #ccc;
      }
    }
  }
  .detail-chart-box {
    @include flex(space-between, center);
    flex-direction: column;
    padding: 20px 0;
    width: 100%;
    height: calc(100% - 49px);
    background: rgba(255, 255, 255, 0);
    position: relative;
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
    .arrow {
      position: absolute;
      top: 0;
      height: 100%;
      @include flex();
      cursor: pointer;
      &:hover {
        .icon {
          color: #fff;
        }
      }
      &.left {
        left: -40px;
      }
      &.right {
        right: -40px;
      }
      .icon {
        font-size: 40px;
        font-weight: bold;
        color: #999;

        .el-icon-arrow-right {
        }
        .el-icon-arrow-left {
        }
      }
    }
  }
}
</style>
