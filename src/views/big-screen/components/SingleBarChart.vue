<template>
  <div class="chart-box bar">
    <div class="chart-box-tool bar-t">
      <div class="chart-box-title">告警处理统计</div>

    </div>
    <div
      :id="id"
      :class="className"
      :style="{height:height,width:width}"
    />
  </div>
</template>

<script>
import * as echarts from 'echarts/core'
import resize from './mixins/resize'

export default {
  name: 'SingleBarChart',
  mixins: [resize],
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    },
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
      default: '80%'
    }
  },
  data() {
    return {
      chart: null,
      option: null,
      dateList: [],
      dataBar: [],
      dataLine: []
    }
  },
  computed: {},
  watch: {
    data: {
      handler(newName, oldName) {
        this.init()
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
    init() {
      this.getDate()
      this.getSeriesLineData()
      this.getSeriesBarData()
      this.initChart()
    },
    getSeriesLineData() {
      let i = 7
      const arr = []
      const obj = this.data.processed
      while (i--) {
        let n
        i > 0 ? (n = `-${i}`) : (n = i)
        arr[i] = obj[n]
      }
      this.dataLine = arr
    },
    getSeriesBarData() {
      // 告警数
      let i = 7
      const arr = []
      const obj = this.data.added
      while (i--) {
        let n
        // debugger
        i > 0 ? (n = `-${i}`) : (n = '0')
        arr[i] = obj[n]
      }

      this.dataBar = arr
    },
    getDate() {
      const n = 7
      const arr = []
      const today = this.$dayjs().format('YYYY.MM.DD')
      const today_1 = this.$dayjs().subtract(1, 'day').format('YYYY.MM.DD')
      const today_2 = this.$dayjs().subtract(2, 'day').format('YYYY.MM.DD')
      const today_3 = this.$dayjs().subtract(3, 'day').format('YYYY.MM.DD')
      const today_4 = this.$dayjs().subtract(4, 'day').format('YYYY.MM.DD')
      const today_5 = this.$dayjs().subtract(5, 'day').format('YYYY.MM.DD')
      const today_6 = this.$dayjs().subtract(6, 'day').format('YYYY.MM.DD')
      arr.unshift(today)
      arr.unshift(today_1)
      arr.unshift(today_2)
      arr.unshift(today_3)
      arr.unshift(today_4)
      arr.unshift(today_5)
      arr.unshift(today_6)
      // return {
      //   0: today,
      //   '-1': today_1,
      //   '-2': today_2,
      //   '-3': today_3,
      //   '-4': today_4,
      //   '-5': today_5,
      //   '-6': today_6
      // }

      this.dateList = arr
    },
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      const that = this
      this.option = {
        // backgroundColor: '#fff',
        // color: ['#18BAD7'],
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
          top: '30%',
          left: '0%',
          right: '5%',
          bottom: '10%',
          containLabel: true
        },
        legend: {
          itemHeight: 8,
          textStyle: {
            color: '#fff'
          },
          // itemStyle:{
          //   color:'#000'
          // },

          data: ['告警数', '处理数']
        },
        xAxis: [
          {
            type: 'category',
            color: '#59588D',
            // data: ['1', '2', '3', '4', '5', '6', '7'],
            data: that.dateList,
            axisLabel: {
              color: '#999',
              textStyle: {
                fontSize: 12
              },
              formatter: function (val) {
                let arr
                let str = ''
                if (val) {
                  arr = val.split('.')
                  str = `${arr[0]}\n${arr[1]}.${arr[2]}`
                }
                return str
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
          }
        ],
        yAxis: [
          {
            axisLabel: {
              color: '#999',
              textStyle: {
                fontSize: 12
              }
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(107,107,107,0.37)'
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(131,101,101,0.2)',
                type: 'dashed'
              }
            }
          }
        ],

        series: [
          {
            type: 'bar',
            name: '告警数',

            data: that.dataBar,
            barWidth: '14px',
            // itemStyle: {
            //     color: function(params) {
            //       // const colorArr = params.value > 0 ? ['#FF9A22', '#FFD56E'] : ['#FFD56E', '#FF9A22']
            //       const colorArr = params.value > 0 ? ['#f53012', '#d6560b'] : ['#f53012', '#d6560b']
            //       return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            //         offset: 0,
            //         color: colorArr[0] // 0% 处的颜色
            //       }, {
            //         offset: 1,
            //         color: colorArr[1]// 100% 处的颜色
            //       }], true)
            //     },
            //     barBorderRadius: [30, 30, 0, 0]
            // },
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#f53012' }, // 柱图渐变色
                // {offset: 0.5, color: '#44C0C1'},                 //柱图渐变色
                { offset: 1, color: '#d6560b' } // 柱图渐变色
              ]),
              barBorderRadius: [30, 30, 0, 0]
            },
            label: {
              show: true,
              fontSize: 12,
              fontWeight: 'bold',
              color: '#f53012',
              position: 'top'
            }
          },
          {
            // data: [40, 80, 20, 16, 70, 90, 20, 100],
            data: that.dataLine,
            type: 'line',
            smooth: false,
            name: '处理数',
            // symbol: 'none',
            symbolSize: 10,
            lineStyle: {
              color: '#18BAD7',
              width: 4,
              shadowColor: 'rgba(0, 0, 0, 0.3)', // 设置折线阴影
              shadowBlur: 15,
              shadowOffsetY: 20
            }
            // markPoint: {
            //       data: [
            //           {type: 'max', name: '最大值'},
            //           {type: 'min', name: '最小值'}
            //       ]
            //   },
          }
        ]
      }

      this.chart.setOption(this.option, true)
    }
  }
}
</script>
<style lang="scss" scoped>
.bar {
  height: 100% !important;
  .bar-t {
    margin-bottom: 20px;
  }
}
</style>
