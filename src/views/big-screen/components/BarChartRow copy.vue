<template>
  <!-- <div class="chart-box-tool">
      <div class="chart-box-title">分区点位状态统计</div> -->
  <div class="row-bar">
    <div class="hart-box-describe">
      <div class="hart-box-describe-left">
        <div class="chart-dt chart-dt-big">
          {{ data.factory }} {{ data.area }}
        </div>
      </div>
      <div class="hart-box-describe-right">
        <div class="temperature cur-tem">
          <span>电解槽</span>
          <span class="tem-val num">{{ data.cells }}</span>
        </div>
      </div>
      <div class="hart-box-describe-right">
        <div class="temperature cur-tem">
          <span>点位</span>
          <span class="tem-val num">{{ data.cells }} x {{ data.point }}</span>
        </div>
      </div>
    </div>
    <div
      :id="id"
      :class="className"
      :style="{ height: height, width: width }"
    />
  </div>
  <!-- </div> -->
</template>
<script>
import echarts from 'echarts'
import resize from './mixins/resize'
import groupBy from 'lodash/groupBy'

export default {
  name: 'BarChartRow',
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
      option: null
    }
  },
  computed: {
    legendData() {
      const arr = []
      this.data.child.forEach((v) => {
        arr.push(v.name)
      })
      return arr
    },
    seriesData() {
      const color = ['#fbd661', 'red', 'red', '#b3b3b3']
      const arr = []
      this.data.child.forEach((v, i) => {
        const obj = { itemStyle: {} }
        obj.value = v.num
        obj.itemStyle.color = color[i]
        arr.push(obj)
      })
      return arr
    },
    sum() {
      const sum = this.data.child.reduce((pre, cur) => {
        return cur.num + pre
      }, 0)
      return sum
    }
  },
  watch: {
    data: {
      handler(newVal) {
        console.log(newVal)
      },
      immediate: true,
      deep: true // 表示开启深度监听
    }
  },
  mounted() {
    setTimeout(() => {
      this.initChart()
    }, 0)
    console.log('object :>> ', groupBy)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
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
          top: '5%',
          left: '0%',
          right: '10%',
          bottom: '0%',
          containLabel: true
        },

        xAxis: [
          {
            type: 'value',
            show: false,
            boundaryGap: true,
            axisLabel: {
              color: '#999',
              textStyle: {
                fontSize: 12
              }
            },

            axisTick: {
              show: false
            },
            axisLine: {
              show: false,
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
            type: 'category',
            color: '#59588D',
            boundaryGap: true,

            axisLabel: {
              color: '#fff',
              textStyle: {
                fontSize: 12
              }
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: 'rgba(107,107,107,0.37)'
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false,

              lineStyle: {
                color: 'rgba(131,101,101,0.2)',
                type: 'dashed'
              }
            },
            data: this.legendData
          }
        ],

        series: [
          {
            type: 'bar',
            name: '数量',

            data: this.seriesData,
            barWidth: '10px',

            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#f53012' }, // 柱图渐变色
                  // {offset: 0.5, color: '#44C0C1'},                 //柱图渐变色
                  { offset: 1, color: '#d6560b' } // 柱图渐变色
                ]),
                barBorderRadius: [30, 30, 30, 30]
              }
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#2378f7' },
                  { offset: 0.7, color: '#2378f7' },
                  { offset: 1, color: '#83bff6' }
                ])
              }
            },
            label: {
              normal: {
                show: true,
                fontSize: 12,
                fontWeight: 'bold',
                color: '#fff',
                position: 'right'
              }
            }
          }
        ]
      }

      this.chart.setOption(this.option, true)
    }
  }
}
</script>
<style lang="scss" scoped>
.row-bar {
  position: relative;
  height: 28%;
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 6px;
    height: 1px;
    width: 100%;
    background: rgba(255, 255, 255, 0.1);
  }
}
</style>
