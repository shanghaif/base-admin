<template>
  <div class="module-c">
    <div class="sub">{{ count === 1 ? '二' : '' }}分区告警测温点位数</div>
    <div class="chart">
      <div
        v-if="count === 0"
        class="info"
      >
        <Status
          img="null"
          text="暂无分区告警测温点位信息哦~"
        />
      </div>
      <div
        v-else-if="count === 1"
        class="info"
      >
        <div class="info-item">
          <div class="info-item-num alarm-a">{{ areaData.offline[0] }}</div>
          离线点位
        </div>
        <div class="info-item">
          <div class="info-item-num alarm-b">{{ areaData.tempHigh[0] }}</div>
          温度告警
        </div>
        <div class="info-item">
          <div class="info-item-num alarm-c">{{ areaData.abnormal[0] }}</div>
          设备异常
        </div>
        <div class="info-item">
          <div class="info-item-num alarm-b">{{ areaData.trend[0] }}</div>
          趋势预警
        </div>
      </div>
      <div
        v-else
        id="area-count-c"
      />
    </div>
  </div>
</template>

<script>
import Status from '@/components/Status'
export default {
  components: {
    Status
  },
  props: { count: Number },
  data() {
    return {
      areaData: {}
    }
  },
  mounted() {
    this.randomData()
  },
  methods: {
    randomData() {
      // 随机数据
      this.areaData = {}
      const name = []
      const offline = []
      const tempHigh = []
      const trend = []
      const abnormal = []
      const nameList = [
        '一',
        '二',
        '三',
        '四',
        '五',
        '六',
        '七',
        '八',
        '九',
        '十',
        '十一',
        '十二'
      ]
      for (let i = 0; i < this.count; i++) {
        name.push(nameList[i] + '分区')
        offline.push(Math.floor(Math.random() * 100 + 40))
        tempHigh.push(Math.floor(Math.random() * 100 + 40))
        trend.push(Math.floor(Math.random() * 100 + 40))
        abnormal.push(Math.floor(Math.random() * 100 + 40))
      }
      this.$set(this.areaData, 'name', name)
      this.$set(this.areaData, 'offline', offline)
      this.$set(this.areaData, 'tempHigh', tempHigh)
      this.$set(this.areaData, 'trend', trend)
      this.$set(this.areaData, 'abnormal', abnormal)
      this.$nextTick(() => {
        if (this.count > 1) {
          this.draw()
        }
      })
    },
    draw() {
      this.chart = this.$echarts.init(document.getElementById('area-count-c'), {
        renderer: 'svg'
      })

      // 处理颜色
      const colorAlarmA = 'hsla(0, 0%, 90%, 1)'
      const colorAlarmA2 = colorAlarmA.slice(0, -2) + '0.3)'
      const colorAlarmB = 'hsla(354, 100%, 57%, 1)'
      const colorAlarmB2 = colorAlarmB.slice(0, -2) + '0.3)'
      const colorAlarmC = 'hsla(40, 80%, 52%, 1)'
      const colorAlarmC2 = colorAlarmC.slice(0, -2) + '0.3)'

      this.chart.setOption({
        grid: { borderWidth: 0, top: 50, left: 10, right: 10, bottom: 20 },
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
          data: this.areaData.name,
          axisLine: { lineStyle: { color: 'hsla(0, 100%, 100%, 0.1)' } },
          axisTick: { show: false },
          axisLabel: { textStyle: { color: 'hsla(0, 100%, 100%, 0.4)' } }
        },
        yAxis: { show: false },
        series: [
          {
            name: '离线',
            type: 'bar',
            // barWidth: '30%',
            barMaxWidth: 14,
            barGap: '30%',
            animation: false,
            label: {
              show: true,
              position: 'top',
              fontFamily: 'DIN',
              fontWeight: 800,
              color: colorAlarmA
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
                    color: colorAlarmA
                  },
                  {
                    offset: 0,
                    color: colorAlarmA2
                  }
                ],
                false
              )
            },
            data: this.areaData.offline
          },
          {
            name: '温度告警',
            type: 'bar',
            // barWidth: '30%',
            barMaxWidth: 14,
            barGap: '30%',
            animation: false,
            label: {
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
            data: this.areaData.tempHigh
          },
          {
            name: '设备异常',
            type: 'bar',
            // barWidth: '30%',
            barMaxWidth: 14,
            barGap: '30%',
            animation: false,
            label: {
              show: true,
              position: 'top',
              fontFamily: 'DIN',
              fontWeight: 800,
              color: colorAlarmC
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
                    color: colorAlarmC
                  },
                  {
                    offset: 0,
                    color: colorAlarmC2
                  }
                ],
                false
              )
            },
            data: this.areaData.abnormal
          },
          {
            name: '趋势预警',
            type: 'bar',
            // barWidth: '30%',
            barMaxWidth: 14,
            barGap: '30%',
            animation: false,
            label: {
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
            data: this.areaData.trend
          }
        ]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.module-c {
  position: relative;
  margin-top: -20px;
  height: calc(22% - 11.33px);
}

.chart {
  position: relative;
  height: calc(100% - 16px);
  width: 100%;
  #area-count-c {
    height: 100%;
    width: 100%;
  }
  .info {
    display: flex;
    height: 100%;
    width: 100%;
    &-item {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 25%;
      align-items: center;
      justify-content: center;
      color: rgba(255, 255, 255, 0.7);
      box-shadow: 31px 0 0 -30px rgba(255, 255, 255, 0.1);
      &:nth-last-child(1) {
        box-shadow: none;
      }
      &-num {
        padding-bottom: 14px;
        font-size: 38px;
        font-family: 'DIN';
        font-weight: 800;
      }
      .alarm-a {
        color: var(--alarmA);
      }
      .alarm-b {
        color: var(--alarmB);
      }
      .alarm-c {
        color: var(--alarmC);
      }
    }
  }
}
</style>
