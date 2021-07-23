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
import { mapState, mapActions, mapMutations } from 'vuex'
import { getCell, setCell, removeCell, setCurrentFactory } from '@/utils/auth'
import { Socket } from '@/utils/socket'

import {
  company,
  factory,
  areaPage,
  cell,
  device,
  handelAlarm,
  deviceStatus
} from '@/api/station'
export default {
  props: { id: String },
  data() {
    return {
      img: require('@/assets/bg.jpg'),
      chart: null,
      factoryId: '',
      center: [103.3, 23.4],
      companyList: [],
      factoryList: [],
      popTitle: '云南分公司',
      popItem: [
        { name: '电解铝一厂', canUse: true },
        { name: '电解铝二厂', canUse: true },
        { name: '电解铝三厂', canUse: false },
        { name: '电解铝四厂', canUse: true },
        { name: '电解铝五厂', canUse: false },
        { name: '电解铝六厂', canUse: false },
        { name: '电解铝七厂', canUse: true }
      ]
    }
  },
  computed: {
    ...mapState({
      currentFactory: (state) => state.station.currentFactory
    })
  },
  created() {
    this.queryCompany().then((res) => {
      this.queryFactory(res)
    })
  },
  mounted() {
    const n = Math.floor(Math.sqrt(this.popItem.length) + 0.5)
    this.$refs.list.style.width = n * 102 + 16 + 'px'
    this.$refs.list.style.left = -n * 51 + 'px'
    this.$echarts.registerMap('China', China)
    this.draw()
  },
  methods: {
    ...mapMutations({
      SET_FACTORY: 'station/SET_FACTORY',
      SET_CELL: 'station/SET_CELL'
    }),
    queryCompany() {
      // try {
      //   const res = await company(1)
      //   this.companyList = (res.data.result && res.data.result.stations) || []
      // } catch (err) {
      //   this.$message('工厂错误')
      // }
      return new Promise((resolve, reject) => {
        company(1)
          .then((res) => {
            this.companyList =
              (res.data.result && res.data.result.stations) || []
            resolve(this.companyList)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    async queryFactory(arr) {
      console.log('this.companyList.length :>> ', this.companyList.length)
      if (arr.length > 0) {
        try {
          // 工厂
          const id_company = this.companyList.find(
            (v) => v.s_name === '云南分公司'
          ).uid
          const factoryResult = await factory(id_company, 1)
          this.factoryList = factoryResult.data.result.stations || []
          const len = this.factoryList.length

          const hasData = len > 1 ? this.factoryList[1] : this.factoryList[0]
          this.SET_FACTORY(hasData)
          setCurrentFactory(hasData)
          this.factoryId = hasData.uid
        } catch (err) {
          this.$message('工厂错误')
        }
      }
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
          zoom: 1.6,
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
            zoom: 1.6,
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
      this.SET_FACTORY(obj)
      setCurrentFactory(obj)
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
  height: 12px;
  width: 12px;
  top: calc(45% - 16px);
  left: calc(50% + 60px);
  border-radius: 50%;
  background: var(--theme);
  box-shadow: 4px 6px 6px 4px rgba(0, 0, 0, 0.6);
  &:after {
    position: absolute;
    content: '-';
    height: 20px;
    width: 20px;
    top: -4px;
    left: -4px;
    border-radius: 50%;
    color: transparent;
    background: var(--theme);
    opacity: 0.25;
  }
  &-arrow {
    position: absolute;
    height: 12px;
    width: 12px;
    left: 0;
    bottom: 8px;
    background: linear-gradient(
      45deg,
      transparent 50%,
      rgba(20, 20, 20, 0.8) 50%
    );
    transform: rotate(135deg);
  }
  &-list {
    position: absolute;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    padding: 14px;
    // width: 260px;
    // left: -124px;
    bottom: 14px;
    color: rgba(255, 255, 255, 1);
    border-radius: 4px;
    background: rgba(20, 20, 20, 0.8);
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
