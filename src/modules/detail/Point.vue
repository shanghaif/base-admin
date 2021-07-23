<template>
  <div id="module">
    <div class="title">电解槽点位详情
      <div class="sub">{{ bath }} / {{ point }}</div>
    </div>
    <div class="info">
      <div class="info-item">当前温度:<span class="temp alarm-b">{{ temp }}</span></div>
      <div class="info-item">告警状态:<span class="alarm-b">温度告警</span></div>
    </div>
    <div class="date">
      <p class="date-text">数据日期范围</p>
      <div class="date-range">{{ dataRange[0] }}<span>至</span>{{ dataRange[1] }}</div>
    </div>
    <div id="point" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      bath: '电解槽2001',
      point: 'run@347682.exe',
      dataRange: [],
      temp: 347.65,
      tempData: [],
      tempHigh: 340,
      tempMin: 999
    }
  },
  mounted() {
    this.dataRange = [
      this.util.formatDate(new Date()),
      this.util.formatDate(new Date())
    ]
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
    draw() {
      const that = this
      this.chart = this.$echarts.init(document.getElementById('point'), {
        renderer: 'svg'
      })

      // 处理颜色
      const colorAlarmB = 'hsla(354, 100%, 57%, 1)'
      const colorTheme = 'hsla(190, 80%, 48%, 1)'
      const colorTheme2 = colorTheme.slice(0, -2) + '0.1)'
      const colorTheme3 = colorTheme.slice(0, -2) + '0.2)'

      this.chart.setOption({
        grid: { borderWidth: 0, top: 20, left: 76, right: 40, bottom: 20 },
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
              fontSize: 14
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
          splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
          // splitNumber: 5,
          // interval: 20,
          axisLabel: {
            formatter: '{value}°C',
            textStyle: {
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: 14
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
          lineStyle: { width: 3, join: 'round' },
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
          },
          markLine: {
            silent: true,
            symbol: 'none',
            lineStyle: {
              type: 'solid',
              width: 2,
              color: colorAlarmB
            },
            label: {
              type: 'value',
              position: 'start',
              distance: 5,
              formatter: '{c}°C',
              fontSize: 18,
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
  padding: 0 20px;
  height: 100%;
  background: transparent;
}
.title {
  display: flex;
  gap: 14px;
  align-items: flex-end;
}

.info {
  display: flex;
  gap: 20px;
  margin: 16px 0;
  width: 100%;
  &-item {
    display: flex;
    gap: 10px;
    padding: 14px 0;
    width: 50%;
    font-size: 16px;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.05);
    box-shadow: 0 10px 20px -10px rgba(0, 0, 0, 0.6);
    .alarm-b {
      color: var(--alarmB);
    }
    span {
      font-size: 20px;
      font-weight: 600;
    }
    .temp {
      display: flex;
      font-family: 'DIN', 'PingFang SC', 'Microsoft Yahei', sans-serif;
      &:after {
        display: inline-block;
        margin: 0px 0 auto 0;
        content: '°C';
        font-size: 14px;
      }
    }
  }
}

.date {
  display: flex;
  gap: 10px;
  padding: 0 0 10px 0;
  width: 100%;
  &-text {
    margin: auto 0 auto auto;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
  }
  &-range {
    display: flex;
    gap: 20px;
    padding: 10px 20px;
    border-radius: 4px;
    font-family: 'DIN';
    align-items: center;
    background: rgba(255, 255, 255, 0.05);
    box-shadow: 0 10px 20px -10px rgba(0, 0, 0, 0.6);
    span {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
    }
  }
}

#point {
  margin: 0 -30px;
  height: calc(100% - 146px);
  width: calc(100% + 60px);
}
</style>
