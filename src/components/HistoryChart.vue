<template>
  <div class="history-chart">
    <Status
      v-if="list.length < 1"
      img="null"
      text="暂无数据"
    />
    <div
      v-else
      :id="id"
      :class="className"
      :style="{height:height,width:width}"
    />

  </div>

</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'

export default {
  name: 'HistoryChart',
  components: {},

  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    },
    size: {
      type: Number,
      default: 10
    },
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'HistoryChart'
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
      tempMin: 999,

      newList: [],
      xData: []
    }
  },
  computed: {
    ...mapState({
      alarmItem: (state) => state.station.alarmItem,
      tempHeight: (state) => state.station.tempHeight,
      currentPoint: (state) => state.station.currentPoint
    })
  },
  watch: {
    list: {
      handler(newName, oldName) {
        this.newList = [...newName]

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
  mounted() {},
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      const that = this
      this.chart = this.$echarts.init(document.getElementById(this.id))
      this.now = this.$dayjs().valueOf()
      const colorAlarmB = 'hsla(354, 100%, 57%, 1)'
      const colorTheme = 'hsla(190, 80%, 48%, 1)'
      const colorTheme2 = colorTheme.slice(0, -2) + '0.1)'
      const colorTheme3 = colorTheme.slice(0, -2) + '0.2)'
      const option = {
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
              fontSize: this.size
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
              fontSize: this.size
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
      this.chart.setOption(option, true)
    }
  }
}
</script>
<style lang="scss" scoped>
.history-chart {
  height: 100%;
  width: 100%;
  position: relative;
}
</style>
