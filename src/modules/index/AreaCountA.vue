<template>
  <div class="module-a">
    <div class="title">分区概况</div>
    <div class="sub">{{ count === 1 ? '二' : '' }}分区电解槽数</div>
    <div class="chart">
      <div
        v-if="count === 0"
        class="info"
      >
        <Status
          img="null"
          text="暂无分区电解槽信息哦~"
        />
      </div>
      <div
        v-else-if="count === 1"
        class="info"
      >
        <div class="info-item">
          <div class="info-item-num total">{{ areaData.total[0] }}</div>
          总电解槽
        </div>
        <div class="info-item">
          <div class="info-item-num online">{{ areaData.online[0] }}</div>
          在线电解槽
        </div>
      </div>
      <div
        v-else
        id="area-count-a"
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
      const total = []
      const online = []
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
        total.push(Math.floor(Math.random() * 30 + 90))
        online.push(total[i] - Math.floor(Math.random() * 40))
      }
      this.$set(this.areaData, 'name', name)
      this.$set(this.areaData, 'total', total)
      this.$set(this.areaData, 'online', online)
      this.$nextTick(() => {
        if (this.count > 1) {
          this.draw()
        }
      })
    },
    draw() {
      this.chart = this.$echarts.init(document.getElementById('area-count-a'), {
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
          data: this.areaData.name,
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
            data: this.areaData.total
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
            data: this.areaData.online
          }
        ]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.module-a {
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
