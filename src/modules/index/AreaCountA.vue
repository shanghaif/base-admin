<template>
  <div
    id="module"
    class="module-a"
  >
    <div class="title">分区概况</div>
    <div class="sub">
      <span v-if="isSingle">{{ currentObj.area_infos && currentObj.area_infos[0].name }}电解槽数</span>
      <span v-else>分区电解槽数</span>

    </div>
    <div class="chart">
      <div
        v-if="isEmpty"
        class="info"
      >
        <Status
          img="null"
          text="暂无分区电解槽信息哦~"
        />
      </div>
      <div
        v-else-if="isSingle"
        class="info"
      >
        <div class="info-item">
          <div class="info-item-num total">{{ currentObj.all_bath }}</div>
          总电解槽
        </div>
        <div class="info-item">
          <div class="info-item-num online">{{ currentObj.online_bath }}</div>
          在线电解槽
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
  name: 'AreaCountA',
  components: {
    Status
  },
  props: {
    id: {
      type: String,
      default: 'area-count-a'
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

      areaData: {},
      currentObj: {},
      axisData: [],
      onLineData: [],
      allData: []
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
  mounted() {
    // this.randomData()
  },
  methods: {
    getxAxisData(list) {
      const arr1 = []
      const arr2 = []
      const arr3 = []

      list &&
        list.map((v) => {
          arr1.push(v.name)
          arr2.push(v.all_bath)
          arr3.push(v.online_bath)
        })
      this.axisData = arr1
      this.allData = arr2

      this.onLineData = arr3
    },

    draw() {
      const that = this
      // this.chart.clear()
      this.getxAxisData(this.currentObj.area_infos)
      this.chart = this.$echarts.init(document.getElementById(that.id), {
        renderer: 'svg'
      })

      // 处理颜色
      const colorTotal = 'hsla(250, 90%, 70%, 1)'
      const colorTotal2 = colorTotal.slice(0, -2) + '0.3)'
      const colorOnline = 'hsla(190, 80%, 48%, 1)'
      const colorOnline2 = colorOnline.slice(0, -2) + '0.3)'
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
            name: '总电解槽',
            type: 'bar',
            barWidth: '25%',
            barMaxWidth: 16,
            barGap: '30%',
            animation: false,
            label: {
              show: true,
              position: 'top',
              fontFamily: 'DIN',
              fontWeight: 800,
              color: colorTotal
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
                    color: colorTotal
                  },
                  {
                    offset: 0,
                    color: colorTotal2
                  }
                ],
                false
              )
            },
            data: that.allData
          },
          {
            name: '在线电解槽',
            type: 'bar',
            barWidth: '25%',
            barMaxWidth: 16,
            barGap: '30%',
            animation: false,
            label: {
              show: true,
              position: 'top',
              fontFamily: 'DIN',
              fontWeight: 800,
              color: colorOnline
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
                    color: colorOnline
                  },
                  {
                    offset: 0,
                    color: colorOnline2
                  }
                ],
                false
              )
            },
            // data: this.areaData.online
            data: that.onLineData
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
  height: calc(22% + 22.66px);
}

.sub {
  margin-top: 10px;
}

.chart {
  position: relative;
  height: calc(100% - 50px);
  width: 100%;
  #area-count-a {
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
      width: 50%;
      align-items: center;
      justify-content: center;
      color: rgba(255, 255, 255, 0.7);
      &:nth-child(1) {
        box-shadow: 31px 0 0 -30px rgba(255, 255, 255, 0.1);
      }
      &-num {
        padding-bottom: 14px;
        font-size: 40px;
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
