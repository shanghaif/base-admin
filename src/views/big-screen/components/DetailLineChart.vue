<template>
  <div class="detail-chart">
    <div class="chart-tool">
      <div class="left-text">

        <div class="chart-box-title">测温点温度曲线</div>
        <div class="content-crumbs">
          <div class="content-crumb">电解槽2021</div>
          <div class="content-crumb">A12_LEFT</div>

        </div>
      </div>
      <div class="right-btns">
        <div class="btn"><i class="el-icon-refresh-right" /> 刷新</div>
        <div
          class="btn"
          @click="exportChart"
        ><i class="el-icon-upload" /> 导出</div>
      </div>
    </div>
    <div class="detail-chart-box">
      <div class="select-date">
        <span class="select-date-text">数据日期：</span>
        <el-date-picker
          v-model="date"
          type="date"
          placeholder="选择日期"
          class="screen-select"
        />
      </div>
      <div
        :id="id"
        :class="className"
        :style="{height:height,width:width}"
      />
    </div>
    <el-dialog
      title="导出"
      :visible.sync="exportDialogVisible"
      width="38%"
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
                <div class="content-crumb">xx分公司</div>
                <div class="content-crumb">电解铝二厂</div>
                <div class="content-crumb">一分区</div>
                <div class="content-crumb">电解槽2008</div>
                <div class="content-crumb">A17_RIGHT</div>
              </div>
            </div>
          </div>
          <div class="filter-item">
            <div class="filter-item-label">
              时间范围
            </div>
            <div class="filter-item-content">
              a
            </div>
          </div>
          <div class="filter-item">
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
          </div>
        </div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="detail-ok-btn"
          @click="exportDialogVisible = false"
        >导出</el-button>
        <el-button
          class="detail-cancel-btn"
          @click="exportDialogVisible = false"
        >取消</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import * as echarts from 'echarts'
import resize from './mixins/resize'

export default {
  name: 'DetailLineChart',
  components: {},
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
      default: '90%'
    }
  },
  data() {
    return {
      chart: null,
      exportDialogVisible: false,

      option: null,
      timer: null,
      xData: [],
      checkedTemp: [],
      Temps: ['原始温度数据', '最高温度', '最低温度', '平均温度'],
      now: 0,
      date: '',
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
          bottom: '5%',
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
                // { type: 'max', name: '最大值' },
                // { type: 'min', name: '最小值' }
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
