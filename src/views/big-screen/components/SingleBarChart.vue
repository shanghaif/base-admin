<template>
  <div class="chart-box">

    <div class="chart-box-tool">
      <div class="chart-box-title">告警处理统计</div>
      
    </div>
    <div :id="id" :class="className" :style="{height:height,width:width}" />
  </div>
</template>

<script>
import * as echarts from 'echarts/core'
import resize from './mixins/resize'

export default {
  name: 'SingleBarChart',
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
      default: '200px'
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
      step: 10 / 60 * 60 * 1000
      
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
        xAxis: [{
          type: 'category',
          color: '#59588D',
          data: ['2019Q1', '2019Q2', '2019Q3', '2019Q4'],
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
        }],
        yAxis: [{
          axisLabel: {
            color: '#999',
            textStyle: {
              fontSize: 18
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
        }],
        series: [{
          type: 'bar',
          name: '告警数',
          data: [40, 80, 20, 16],
          barWidth: '14px',
          // itemStyle: {
          //   normal: {
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
          //   }
          // },
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  { offset: 0, color: '#f53012' }, // 柱图渐变色
                  // {offset: 0.5, color: '#44C0C1'},                 //柱图渐变色
                  { offset: 1, color: '#d6560b' } // 柱图渐变色
                ]
              ),
              barBorderRadius: [30, 30, 0, 0]

            }
          },
          label: {
            normal: {
              show: true,
              fontSize: 18,
              fontWeight: 'bold',
              color: '#333',
              position: 'top'
            }
          }
       
        }, 
        {
          data: [48, 40, 10, 56],
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
  .chart-box{
    height: 100%;
    width: 100%;
  }
  .chart-box-tool{
    .chart-box-title{
      font-size: 24px;
      font-family: PingFang SC;
      font-weight: bold;
      color: #18BAD7;

      background: linear-gradient(0deg, #067DC2 0%, #18BAD7 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hart-box-describe{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
      line-height: 22px;
      .hart-box-describe-left{
         display: flex;
         flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        .chart-dt{
        color: #fff;
        font-size: 12px;

        }
        .err-text{
          color: red;
          font-size: 16px;
          font-weight: bold;
        }
      }
      .hart-box-describe-right{
         display: flex;
         flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        color: #fff;
        .temperature{
          color: #fff;
          font-size: 12px;
          .tem-val{
            font-size: 16px;
            color: #18BAD7;
            font-weight: bold;
            &.err{
              color: red;
            }
          }
        }

      }
    }
  }
</style>
