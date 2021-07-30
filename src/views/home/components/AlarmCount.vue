<template>
  <div id="module">
    <div class="title">告警处理统计信息</div>
    <div class="chart">
      <div
        v-if="Object.keys(obj).length < 1"
        class="info"
      >
        <Status
          img="null"
          text="暂无告警处理统计信息哦~"
        />
      </div>
      <div
        v-else
        id="alarm-count"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'AlarmCount',

  components: {},
  props: {
    obj: {
      type: Object,
      default() {
        return {}
      }
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
  watch: {
    obj: {
      handler(newName, oldName) {
        if (Object.keys(newName).length > 0) {
          this.init()
        }
      },
      deep: true
    }
  },
  mounted() {},
  methods: {
    init() {
      this.getDate()
      this.getSeriesData()
      this.$nextTick(() => {
        this.draw()
        // console.log(this.alarmCount);
      })
    },
    getSeriesData() {
      // 告警数
      let i = 7
      const arrBar = []
      const arrLine = []
      const objBar = this.obj.added
      const objLine = this.obj.processed
      while (i--) {
        let n
        // debugger
        i > 0 ? (n = `-${i}`) : (n = '0')
        arrBar[i] = objBar[n]
        arrLine[i] = objLine[n]
      }

      this.dataBar = arrBar.reverse()
      this.dataLine = arrLine.reverse()
      // this.dataBar = [0, 0, 0, 0, 0, 99999]
      // this.dataLine = [0, 0, 0, 0, 0, 99999]
    },
    getDate() {
      const n = 7
      const arr = []

      for (let i = 0; i < n; i++) {
        const today = this.$dayjs().subtract(i, 'day').format('YYYY-MM-DD')
        arr.unshift(today)
      }
      this.dateList = arr
    },

    draw() {
      const that = this
      this.chart = this.$echarts.init(document.getElementById('alarm-count'), {
        renderer: 'svg'
      })

      // 处理颜色
      const colorAlarmB = 'hsla(354, 100%, 57%, 1)'
      const colorAlarmB2 = colorAlarmB.slice(0, -2) + '0.3)'
      const colorDone = 'hsla(190, 80%, 48%, 1)'
      const colorDone2 = colorDone.slice(0, -2) + '0.3)'

      this.chart.setOption({
        grid: { borderWidth: 0, top: 50, left: 10, right: 10, bottom: 30 },
        legend: {
          selectedMode: false,
          icon: 'roundRect',
          itemWidth: 12,
          itemGap: 20,
          top: 10,
          left: 'center',
          textStyle: { color: 'hsla(0, 100%, 100%, 0.7)', fontSize: 12 }
        },
        tooltip: {
          trigger: 'axis',
          padding: [6, 8, 6, 8],
          textStyle: {
            fontSize: 14,
            fontWeight: 600,
            color: 'rgba(255, 255, 255, 1)',
            textShadowColor: 'rgba(0, 0, 0, 0.7)',
            textShadowBlur: 4,
            textShadowOffsetX: 2,
            textShadowOffsetY: 2
          },
          shadowColor: 'rgba(0, 0, 0, 0.5)',
          shadowBlur: 8,
          shadowOffsetX: 4,
          shadowOffsetY: 4,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          axisPointer: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } }
        },
        xAxis: {
          type: 'category',
          data: that.dateList,
          axisLine: { lineStyle: { color: 'hsla(0, 100%, 100%, 0.1)' } },
          axisTick: { show: false },
          // axisLabel: { textStyle: { color: 'hsla(0, 100%, 100%, 0.4)' } },
          axisLabel: {
            textStyle: { color: 'hsla(0, 100%, 100%, 0.4)' },
            // 坐标轴刻度标签的相关设置。
            formatter: function (params) {
              let res = ''
              const top = that.$dayjs(params).format('YYYY')
              const bottom = that.$dayjs(params).format('MM-DD')
              res = top + '\n' + bottom
              return res
            }
          }
        },
        yAxis: { show: false },
        series: [
          {
            name: '当日告警',
            type: 'bar',
            barWidth: '30%',
            barMaxWidth: 20,
            barGap: '30%',
            animation: false,
            label: {
              // offset: [0, 0],
              show: true,
              position: 'top',
              fontFamily: 'DIN',
              fontWeight: 800,
              color: colorAlarmB
            },
            itemStyle: {
              barBorderRadius: [100, 100, 0, 0],
              color: new this.$echarts.graphic.LinearGradient(
                0,
                1,
                0,
                0,
                [
                  {
                    offset: 1,
                    color: colorAlarmB
                  },
                  {
                    offset: 0,
                    color: colorAlarmB2
                  }
                ],
                false
              )
            },
            data: that.dataBar
          },
          {
            name: '当日处理',
            type: 'bar',
            barWidth: '30%',
            barMaxWidth: 20,
            barGap: '30%',
            animation: false,
            label: {
              // offset: [0, -20],
              show: true,
              position: 'top',
              fontFamily: 'DIN',
              fontWeight: 800,
              color: colorDone
            },
            itemStyle: {
              barBorderRadius: [100, 100, 0, 0],
              color: new this.$echarts.graphic.LinearGradient(
                0,
                1,
                0,
                0,
                [
                  {
                    offset: 1,
                    color: colorDone
                  },
                  {
                    offset: 0,
                    color: colorDone2
                  }
                ],
                false
              )
            },
            data: that.dataLine
          }
        ]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#module {
  position: relative;
  height: 34%;
}

.chart {
  position: relative;
  margin-top: 16px;
  height: calc(100% - 40px);
  width: 100%;
  #alarm-count {
    height: 100%;
    width: 100%;
  }
  .info {
    display: flex;
    padding-top: 40px;
    height: 100%;
    width: 100%;
    &-item {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 50%;
      align-items: center;
      justify-content: center;
      color: rgba(255, 255, 255, 0.7);
      &:nth-child(1) {
        box-shadow: 21px 0 0 -20px rgba(255, 255, 255, 0.1);
      }
      &-num {
        padding-bottom: 14px;
        font-size: 48px;
        font-family: 'DIN';
        font-weight: 800;
      }
      .total {
        color: var(--total);
      }
      .online {
        color: var(--theme);
      }
    }
  }
}
</style>
