<template>
  <div :id="id">
    <div id="chart-map" />
    <div class="mask" />
    <img
      class="bg"
      :src="img"
    >
    <div class="pop">
      <div class="pop-arrow" />
      <div
        ref="list"
        class="pop-list"
      >
        <div class="pop-list-title">{{ popTitle }}</div>
        <div
          v-for="(item, index) of factoryList"
          :key="index"
          class="pop-list-item"
          :class="{'pop-list-selected': item.uid === factoryId}"
          @click="itemClick(item)"
        >{{ item.s_name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
// import China from '@/assets/China'
import China from '@/assets/china/China'

export default {
  props: {
    id: {
      type: String,
      default: 'map-chart'
    },

    data: {
      type: Array,
      default() {
        return []
      }
    },
    current: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      img: require('@/assets/bg.jpg'),
      chart: null,
      factoryId: '',
      center: [103.3, 23],
      companyList: [],
      factoryList: [],
      popTitle: '云南分公司'
    }
  },
  computed: {},
  watch: {
    data: {
      handler: function (newVal, oldVal) {
        if (newVal) {
          this.factoryList = newVal
          this.factoryId = this.current.uid
          this.calcWidth()
        }
      },
      deep: true
    }
  },
  created() {},
  mounted() {
    this.$echarts.registerMap('China', China)
    this.draw()
  },
  methods: {
    calcWidth() {
      const n = Math.floor(Math.sqrt(this.factoryList.length) + 0.5)
      this.$refs.list.style.width = n * 102 + 16 + 'px'
      this.$refs.list.style.left = -n * 51 + 'px'
    },

    draw() {
      this.chart = this.$echarts.init(document.getElementById('chart-map'), {
        renderer: 'svg'
      })

      // 处理颜色
      const colorBorder = 'hsla(190, 80%, 48%, 1)'
      const colorBorder2 = 'hsla(210, 80%, 44%, 1)'
      const colorArea = colorBorder.split(',')[0] + ', 30%, 24%, 1)'
      const colorArea2 = colorBorder2.split(',')[0] + ', 30%, 24%, 1)'
      // console.log(colorBorder, colorBorder2, colorArea, colorArea2);

      const data = China.features.map((item) => {
        return {
          name: item.properties.name,
          selected: item.properties.name === '云南省'
        }
      })
      this.chart.setOption({
        tooltip: {},
        geo: {
          map: 'China',
          show: true,
          roam: false,
          center: this.center,
          label: { emphasis: { show: false } },
          zoom: 1.9,
          itemStyle: {
            normal: {
              borderWidth: 1,
              borderJoin: 'round',
              shadowColor: 'rgba(0, 0, 0, 0.4)',
              shadowBlur: 40,
              shadowOffsetY: 20
            }
          }
        },
        series: [
          {
            tooltip: { trigger: 'item' },
            name: '中国',
            type: 'map',
            map: 'China',
            center: this.center,
            selectedMode: 'single',
            showLegendSymbol: false,
            label: { emphasis: { show: false } },
            zoom: 1.9,
            itemStyle: {
              normal: {
                areaColor: 'rgba(28, 34, 38, 1)',
                borderColor: 'rgba(255, 255, 255, 0.02)',
                borderWidth: 1
              }
            },
            emphasis: {
              itemStyle: {
                areaColor: new this.$echarts.graphic.LinearGradient(
                  0,
                  0,
                  1,
                  0,
                  [
                    {
                      offset: 1,
                      color: colorArea
                    },
                    {
                      offset: 0,
                      color: colorArea2
                    }
                  ],
                  false
                ),
                borderColor: new this.$echarts.graphic.LinearGradient(
                  0,
                  0,
                  1,
                  0,
                  [
                    {
                      offset: 1,
                      color: colorBorder
                    },
                    {
                      offset: 0,
                      color: colorBorder2
                    }
                  ],
                  false
                ),
                borderWidth: 2,
                // borderJoin: 'round',
                shadowColor: 'hsla(0, 0%, 0%, 0.3)',
                shadowOffsetX: 0,
                shadowOffsetY: 10,
                shadowBlur: 30
              }
            },
            data: data
          }
        ]
      })
    },
    itemClick(obj) {
      this.factoryId = obj.uid
      // const currentFactory = this.factoryList.find((v) => v.uid === uid)
      // this.SET_FACTORY(obj)
      // setCurrentFactory(obj)
      this.$emit('clickMap', obj)
    }
  }
}
</script>

<style lang="scss" scoped>
#chart-map {
  height: 1600px;
  width: 1600px;
  top: calc(45% - 800px);
  left: calc(50% - 800px);
}

.bg {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  object-fit: cover;
  opacity: 1;
  mask-image: linear-gradient(
    90deg,
    rgba(255, 255, 255, 1),
    rgba(255, 255, 255, 0.2),
    rgba(255, 255, 255, 1)
  );
}

.mask {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.5) 20%,
    transparent 40% 85%,
    rgba(0, 0, 0, 0.5) 95%
  );
}

.pop {
  position: absolute;
  height: 120px;
  width: 120px;
  top: calc(45% - 86px);
  left: calc(50% + 18px);
  &:before {
    position: absolute;
    content: '-';
    height: 24px;
    width: 24px;
    top: 48px;
    left: 48px;
    border-radius: 50%;
    color: transparent;
    background: var(--theme);
    opacity: 0.25;
  }
  &:after {
    position: absolute;
    content: '-';
    height: 16px;
    width: 16px;
    top: 52px;
    left: 52px;
    border-radius: 50%;
    color: transparent;
    background: var(--theme);
    box-shadow: 4px 6px 6px 4px rgba(0, 0, 0, 0.6);
  }
  &:hover > &-arrow,
  &:hover > &-list {
    opacity: 1;
  }
  &-arrow {
    position: absolute;
    height: 12px;
    width: 12px;
    left: 54px;
    bottom: 62px;
    background: linear-gradient(
      45deg,
      transparent 50%,
      rgba(20, 20, 20, 0.8) 50%
    );
    transform: rotate(135deg);
    transition: all ease, 0.3s;
    z-index: 1;
    opacity: 0;
  }
  &-list {
    position: absolute;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    padding: 14px;
    bottom: 68px;
    color: rgba(255, 255, 255, 1);
    border-radius: 4px;
    background: rgba(20, 20, 20, 0.8);
    transition: all ease, 0.3s;
    opacity: 0;
    &-title {
      width: 100%;
      opacity: 0.7;
    }
    &-item {
      width: 90px;
      line-height: 32px;
      font-size: 14px;
      text-align: center;
      border-radius: 2px;
      background: rgba(255, 255, 255, 0.04);
      cursor: pointer;
    }
    &-selected {
      font-weight: 800;
      color: var(--theme);
      background: var(--theme-bg);
      box-shadow: 0 0 0 1px var(--theme);
    }
    &-disabled {
      opacity: 0.3;
      cursor: default;
    }
  }
}
</style>
