<template>
  <div id="module">
    <div class="title">告警点位温度曲线</div>
    <div class="info">
      <div class="left">
        <div class="position">{{ area }} / {{ bath }}</div>
        <div class="msg alarm-b">{{ point }}: 温度告警</div>
      </div>
      <div class="right">
        <div class="temp-text">当前温度</div>
        <div class="temp alarm-b">{{ temp }}</div>
      </div>
    </div>
    <div class="chart">
      <div id="alarm-point" />
      <div class="iconfont icon-arrow left" />
      <div class="iconfont icon-arrow right" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'AlarmPoint',
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      area: '三分区',
      bath: '电解槽1000',
      point: 'run@347682.exe',
      temp: 347.65,
      tempData: [],
      legendList: [],
      tempHigh: 340,
      tempMin: 999,
      currentData: {}
    }
  },
  watch: {
    data: {
      handler: function (newVal, oldVal) {
        if (newVal) {
          this.currentData = Object.assign({}, newVal)
        }
      },
      deep: true
    }
  },
  mounted() {
    this.legendList = this.getAreaNames()
    // 随机数据
    // let data = []
    for (let i = 0; i < 100; i++) {
      const time =
        i === 0 ? new Date() : new Date(this.tempData[i - 1].value[0] - 600000)
      const temp =
        i === 0
          ? this.temp
          : Math.floor(
            this.tempData[i - 1].value[1] * 100 + Math.random() * 1000 - 550
          ) / 100
      this.tempMin = this.tempMin < temp ? this.tempMin : temp
      this.$set(this.tempData, i, { value: [time, temp] })
    }
    this.$nextTick(() => {
      this.draw()
    })
  },
  methods: {
    getAreaNames() {
      const arr = []
      const list = this.currentData.area_infos
      list &&
        list.map((v) => {
          arr.push(v['name'])
        })
      return arr
    },
    draw() {
      const that = this
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
            formatter: function (value) {
              const time = new Date(value)
              return (
                that.util.fillStr(time.getHours().toString(), 2, 0) +
                ':' +
                that.util.fillStr(time.getMinutes().toString(), 2, 0)
              )
            }
          },
          splitLine: { show: false }
        },
        yAxis: {
          type: 'value',
          axisLine: { show: false },
          splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.2)' } },
          splitNumber: 5,
          interval: 20,
          axisLabel: {
            formatter: '{value}°C',
            textStyle: {
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: 10
            }
          },
          min: Math.floor(this.tempMin / 10 - 2) * 10
        },
        visualMap: {
          show: false,
          pieces: [
            {
              gt: 0,
              lte: this.tempHigh,
              color: colorTheme
            },
            {
              gt: this.tempHigh,
              lte: 500,
              color: colorAlarmB
            }
          ]
        },
        series: {
          name: '温度',
          type: 'line',
          data: this.tempData,
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
            data: [{ yAxis: this.tempHigh }]
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
    opacity: 0.2;
  }
  .right:before {
    right: -16px;
    transform: scale(1.4, 2.8) rotate(-90deg);
    opacity: 0.7;
    cursor: pointer;
  }
}
</style>
