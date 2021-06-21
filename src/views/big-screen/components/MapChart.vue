<template>
  <div class="map-wrap">

    <div
      :id="id"
      :class="className"
      :style="{height:height,width:width}"
    />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

import * as echarts from 'echarts/core'
import resize from './mixins/resize'
import '@/assets/china'
var XAData = [
  { name: '广州白云机场', province: '广东' },
  { name: '深圳宝安机场', province: '广东' },
  { name: '东莞机场', province: '广东' },
  { name: '北京西机场', province: '北京' },
  { name: '北京南机场', province: '北京' },
  { name: '北京密云机场', province: '北京' },
  { name: '上海浦东机场', province: '上海' },
  { name: '昆明', province: '云南' },
  { name: '西安', province: '陕西' }
]
export default {
  name: 'MapChart',
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
      default: '100%'
    },
    companyList: {
      type: Array,
      default() {
        return []
      }
    },
    factoryList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      chart: null,
      // factoryName: '电解铝一厂',

      geoCoordMap: {},
      getRegions: [],
      compList: [
        { name: '电解铝一厂' },
        { name: '电解铝二厂' },
        { name: '电解铝三厂' },
        { name: '电解铝四厂' }
      ]
    }
  },
  computed: {
    // ...mapState({
    //   companyList: (state) => state.station.companyList
    // })
    // companyList() {
    //   return this.companyList
    // }
    ...mapState({
      currentFactory: (state) => state.station.currentFactory
    }),
    factoryName() {
      return this.currentFactory.s_name
    }
  },
  watch: {
    companyList: {
      handler(newName, oldName) {
        this.initChart()
      },
      immediate: false,
      deep: true
    }
  },
  created() {
    window.selectFactory = this.selectFactory // 为了vue中使用此方法
  },
  mounted() {
    this.companyList.length > 0 && this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },

  methods: {
    createRegions(list) {
      const arr = [
        {
          name: '南海诸岛',
          itemStyle: {
            opacity: 0
          },
          label: {
            show: false
          }
        }
      ]
      list.forEach((v, i) => {
        // const name = v.s_name
        const name = '云南'
        const obj = {
          name,
          selected: true,
          select: {
            label: {
              show: false,
              color: '#fff'
            },
            itemStyle: {
              areaColor: 'rgba(24, 186, 215, .2)',
              borderColor: '#18BAD7'
            }
          },
          tooltip: {
            show: true
          }
        }
        arr.push(obj)
      })
      return arr
    },
    selectFactory(e, uid) {
      const other = document.querySelectorAll('.map-comp-name.active')
      if (other.length > 0) {
        other[0].classList.remove('active')
      }
      e.target.classList.add('active')
      // 由于传入对象时出现bug,入参改为传入id,通过id匹配选中的工厂
      const currentFactory = this.factoryList.find((v) => v.uid === uid)
      // this.factoryName = currentFactory.s_name
      this.$emit('seletName', currentFactory)
    },
    initChart() {
      // 初始化地图数据
      const that = this
      this.chart = echarts.init(document.getElementById(this.id))
      const regions = this.createRegions(this.companyList)
      const option = {
        // backgroundColor: '#363739',
        center: [110.712251, 23.040609],
        tooltip: {
          enterable: true,
          transitionDuration: 1,
          trigger: 'item',
          backgroundColor: 'rgba(29, 29, 29, 0.8)',
          padding: 0,
          borderWidth: 0,
          position: function (point, params, dom, rect, size) {
            // 位于鼠标正上方正中间
            const x = point[0] - dom.offsetWidth / 2
            const y = point[1] - dom.offsetHeight - 20
            return [x, y]
          },

          formatter: function (params) {
            // console.log(params)
            let html = ''
            if (params.name === '云南') {
              let str = ''
              that.factoryList.forEach((v, i) => {
                const isActive = v.s_name === that.factoryName ? 'active' : ''
                str += `<div class="map-comp-name ${isActive}" onclick="selectFactory(event,'${v.uid}')">${v.s_name}</div>`
              })
              html = `<div class="map-tips">
                 <div class="map-tips-title">云南分公司</div>
                 <div class="map-comp-names">
                   ${str}
                 </div>
                 <i class="el-icon-caret-bottom" />
               </div>`
            }

            return html
          }
        },
        visualMap: {
          min: 0,
          max: 100,
          left: 26,
          bottom: 40,
          showLabel: true,
          text: ['高', '低'],
          inRange: {
            color: ['rgba(19,198,249,0)', 'rgba(19,198,249,0)']
          },
          show: false
        },
        geo: {
          map: 'china',
          roam: true,
          scaleLimit: {
            min: 1,
            max: 2
          },
          zoom: 1.5,
          label: {
            show: false,
            color: '#fff',
            fontSize: 10
          },

          emphasis: {
            label: {
              show: false,
              color: '#fff',
              fontSize: 20
            }
          },

          itemStyle: {
            borderColor: '#666',
            borderWidth: 0.5,
            color: 'rgba(0,0,0,0)',
            areaColor: '#363739',
            /*   "areaColor": {
          "type": "radial",
          "x": 0.5,
          "y": 0.5,
          "r": 0.8,
          "colorStops": [
            {
              "offset": 0,
              "color": "rgba(0,0,0,0)"
            },
            {
              "offset": 1,
              "color": "rgba(19,198,249,0.15)"
            }
          ],
          "global": false
        }, */
            // "shadowColor": "rgba(19,198,249,1)",
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            // "shadowBlur": 10
            emphasis: {
              areaColor: 'rgba(24, 186, 215, .2)',
              borderColor: '#18BAD7'
              // "shadowOffsetX": 0,
              // "shadowOffsetY": 0,
              // "borderWidth": 0
            }
          },

          regions
        },
        series: [
          {
            id: '001',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            showEffectOn: 'render',
            zlevel: 1,
            // 'symbol': 'path://M409,271.9c0,40.2-69.6,73.8-155.5,73.8S98,313.1,98,272.9s69.6-72.8,155.5-72.8S409,231.7,409,271.9z M362,274.3c0,28.2-48.8,51.7-109,51.7s-109-22.8-109-51s48.8-51,109-51S362,246.1,362,274.3z M252.1,309.5c-37.9,0-67.6-14.7-67.6-33.5s29.7-33.5,67.6-33.5c17.7,0,34.3,3.2,46.8,8.9c13.4,6.2,20.8,14.8,20.8,24.2C319.7,294.6,290,309.5,252.1,309.5z M252.1,249.5c-32.9,0-60.6,12.1-60.6,26.5s27.8,26.5,60.6,26.5c16.6,0,32.1-3.1,43.8-8.7c10.7-5.1,16.8-11.7,16.8-18.3C312.7,261.4,285,249.5,252.1,249.5z M250.5,223h-2v-8h2V223z M258.5,215h-2v-8h2V215z M250.5,207h-2v-8h2V207z M258.5,199h-2v-8h2V199z M250.5,191h-2v-8h2V191z M258.5,183h-2v-8h2V183z M250.5,175h-2v-8h2V175z M258.5,167h-2v-8h2V167z M250.5,159h-2v-8h2V159z M258.5,151h-2v-8h2V151z M250.5,143h-2v-8h2V143z M258.5,135h-2v-8h2V135z M250.5,127h-2v-8h2V127z M258.5,119h-2v-8h2V119z M250.5,111h-2v-8h2V111z M258.5,103h-2v-8h2V103z M250.5,95h-2v-8h2V95z M258.5,87h-2v-8h2V87z M250.5,79h-2v-8h2V79z M258.5,71h-2v-8h2V71z M250.5,63h-2v-8h2V63z M258.5,55h-2v-8h2V55z M250.5,47h-2v-5h5v2h-3V47z',
            // symbol:'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z',
            rippleEffect: {
              period: 15,
              scale: 2,
              brushType: 'fill'
            },
            hoverAnimation: true,
            label: {
              formatter: '{b}',
              position: 'bottom',
              offset: [0, 10],
              color: '#fff',
              show: true
            },
            itemStyle: {
              color: '#18BAD7',
              shadowBlur: 10,
              shadowColor: '#333'
            },
            symbolSize: 8,

            data: [
              {
                name: '昆明',
                value: [102.712251, 23.040609],

                visualMap: false
              }
            ]
          }
        ]
      }
      this.chart.setOption(option, true)

      this.chart.dispatchAction({
        type: 'showTip', // 默认显示江苏的提示框
        seriesIndex: 0, // 这行不能省
        dataIndex: 0
      })
    }
  }
}
</script>
<style lang="scss" >
.map-wrap {
  height: 100%;
}
.map-tips {
  // position: absolute;
  z-index: 100;
  // background: rgba(29, 29, 29, 0.8);
  width: 310px;
  height: 156px;
  padding: 14px;
  // border: 1px solid #01adf9;
  border-radius: 10px;
  // max-height: 400px;
  // overflow: auto;
  z-index: 300;

  .map-tips-title {
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .map-comp-names {
    @include flex();
    flex-wrap: wrap;
    .map-comp-name {
      width: 110px;
      height: 34px;
      background: rgba(255, 255, 255, 0.04);

      @include flex();
      margin-bottom: 10px;
      font-size: 16px;
      color: #fff;
      &:nth-child(odd) {
        margin-right: 10px;
      }
      &.active {
        color: #18bad7;
        border: 2px solid #18bad7;
        box-shadow: 0px 0px 12px 0px rgba(24, 186, 215, 0.7);
        background: linear-gradient(
          90deg,
          rgba(24, 186, 215, 0.1),
          rgba(24, 186, 215, 0.3)
        ) !important;
      }
    }
  }
  .el-icon-caret-bottom {
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translate(-50%, 50%);
    color: rgba(29, 29, 29, 0.8);
    font-size: 32px;
  }
}

.map-tips::-webkit-scrollbar {
  width: 8px;
}
.map-tips::-webkit-scrollbar-track {
  background-color: #ccc;
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}
.map-tips::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.4);
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}
</style>
