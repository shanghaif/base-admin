<template>
  <div class="wrap">

    <div class="chart-box-tool">
      <div class="chart-box-title">异常点位温度曲线</div>
      <div class="hart-box-describe">
        <div class="hart-box-describe-left">
          <div class="chart-dt">三分区/电解槽2027</div>
          <div class="err-text">A17_RIGHT: 温度过高</div>
        </div>
        <div class="hart-box-describe-right">
          <div class="temperature cur-tem">
            <span>当前温度：</span>
            <span class="tem-val err">500℃</span>

          </div>
          <div class="temperature average-tem">
            <span>平均温度：</span>
            <span class="tem-val">123.8℃</span>

          </div>
        </div>
      </div>
    </div>
    <div
      :id="id"
      :class="className"
      :style="{height:height,width:width}"
    />
  </div>
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'

export default {
  name: 'SingleLineChart',
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '70%'
    }
  },
  data() {
    return {
      chart: null,
      option: null,
      timer: null,
      xData: [],
      now: 0,
      value: Math.random() * 100,
      // step:  60 * 1000 // 1分钟
      step: (10 / 60) * 60 * 1000
    }
  },
  mounted() {
    this.initChart()
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
    // 生成从minNum到maxNum的随机数
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
      console.log('echarts :>> ', echarts)

      this.chart = echarts.init(document.getElementById(this.id))
      this.now = this.$dayjs().valueOf()

      for (let i = 0; i < 100; i++) {
        this.xData.push(this.randomData())
      }
      const that = this
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
          left: '0%',
          right: '5%',
          bottom: '15%',
          containLabel: true
        },
        visualMap: [
          {
            show: false,
            dimension: 1,
            pieces: [{ gte: 80, lte: 5000, color: 'red' }], // pieces的值由动态数据决定
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
          color: '#59588D',

          boundaryGap: false,
          splitNumber: 5,
          axisLabel: {
            formatter(value) {
              // let time = that.$dayjs(value).format('HH:mm:ss')
              const time = that.$dayjs(value).format('mm:ss')
              return time
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
            show: false
          }
        },
        yAxis: {
          type: 'value',
          scale: true,
          // name: '温度',
          min: 0,
          boundaryGap: false,
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
            xAxisIndex: 0,
            yAxisIndex: 0,
            itemStyle: {
              opacity: 0
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
                  yAxis: 80,
                  lineStyle: { width: 1.656, color: 'red' },
                  label: { show: false }
                }
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
                  yAxis: 80,
                  x: '0%',
                  symbolSize: 0.1,
                  label: {
                    textStyle: { color: 'red' },
                    // padding: [3.312, 8.28],
                    fontSize: 14,
                    // borderRadius: 13.248,
                    // backgroundColor: 'rgba(255, 72, 74, 0.5)',
                    position: 'right',
                    formatter: '80℃'
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
              ]
            }
          }
        ]
      }

      this.chart.setOption(this.option, true)

      this.timer = setInterval(() => {
        for (let i = 0; i < 5; i++) {
          this.xData.shift()
          this.xData.push(this.randomData())
        }

        this.chart.setOption(this.option, true)
      }, this.step)
    }
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  height: 30%;
}
</style>
