<template>
  <div
    id="module"
    class="module-c"
  >
    <div class="sub">分区告警测温点位数</div>
    <div class="chart">
      <div
        v-if="isEmpty"
        class="info"
      >
        <Status
          img="null"
          text="暂无分区告警测温点位信息哦~"
        />
      </div>
      <div
        v-else-if="isSingle"
        class="info"
      >
        <div class="info-item">
          <div class="info-item-num alarm-a">{{ currentObj.area_infos[0].offline_point }}</div>
          离线点位
        </div>
        <div class="info-item">
          <div class="info-item-num alarm-b">{{ currentObj.area_infos[0].temp_point }}</div>
          温度告警
        </div>
        <div class="info-item">
          <div class="info-item-num alarm-c">{{ currentObj.area_infos[0].abnormal_point }}</div>
          设备异常
        </div>
        <div class="info-item">
          <div class="info-item-num alarm-b">{{ currentObj.area_infos[0].rate_point }}</div>
          趋势预警
        </div>
      </div>
      <div
        v-else-if="isSeveral"
        :id="id"
      />
    </div>
  </div>
</template>

<script>
import Status from '@/components/Status'
export default {
  name: 'AreaCountC',

  components: {
    Status
  },
  props: {
    id: {
      type: String,
      default: 'area-count-c'
    },
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
      currentObj: {},
      axisData: [],
      offlineData: [],
      alarmData: [],
      abnormalData: [],
      rateData: []
    }
  },
  computed: {
    isSingle() {
      return (
        this.currentObj.area_infos && this.currentObj.area_infos.length === 1
      )
    },
    isSeveral() {
      return this.currentObj.area_infos && this.currentObj.area_infos.length > 1
    },
    isEmpty() {
      return (
        !this.currentObj.area_infos || this.currentObj.area_infos.length === 0
      )
    }
  },
  watch: {
    obj: {
      handler: function (newVal, oldVal) {
        if (newVal) {
          this.currentObj = newVal

          const flag =
            this.currentObj.area_infos && this.currentObj.area_infos.length > 1
          if (flag) {
            this.$nextTick(() => {
              this.draw()
            })
          } else {
            this.chart.dispose()
          }
        }
      },
      deep: true
    }
  },
  mounted() {},
  methods: {
    getxAxisData(list) {
      const arr1 = []
      const arr2 = []
      const arr3 = []
      const arr4 = []
      const arr5 = []

      list &&
        list.map((v) => {
          arr1.push(v.name)
          arr2.push(v.offline_point)
          arr3.push(v.alarm_point)
          arr4.push(v.abnormal_point)
          arr5.push(v.rate_point)
        })
      this.axisData = arr1
      this.offlineData = arr2
      this.alarmData = arr3
      this.abnormalData = arr4
      this.rateData = arr5
    },
    draw() {
      const that = this
      this.getxAxisData(this.currentObj.area_infos)
      this.chart = this.$echarts.init(document.getElementById(that.id), {
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
          data: that.axisData,
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
            barGap: '50%',
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
            data: that.offlineData
          },
          {
            name: '温度告警',
            type: 'bar',
            // barWidth: '30%',
            barMaxWidth: 14,
            barGap: '50%',
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
            data: that.alarmData
          },
          {
            name: '设备异常',
            type: 'bar',
            // barWidth: '30%',
            barMaxWidth: 14,
            barGap: '50%',
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
            data: that.abnormalData
          },
          {
            name: '趋势预警',
            type: 'bar',
            // barWidth: '30%',
            barMaxWidth: 14,
            barGap: '50%',
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
            data: that.rateData
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
