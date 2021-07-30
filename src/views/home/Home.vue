<template>
  <div
    id="home"
    class="home"
  >
    <Map
      :id="'map'"
      ref="map"
      :data="factoryList"
      :current="currentFactory"
      @clickMap="clickMap"
    />
    <div class="left">
      <AreaCountA
        ref="area_count_a"
        :key="areaKey + 'AreaCountA'"
        class="module"
        :obj="areaDeviceData"
      />
      <AreaCountB
        ref="area_count_b"
        :key="areaKey + 'AreaCountB'"
        class="module"
        :obj="areaDeviceData"
      />
      <AreaCountC
        ref="area_count_c"
        :key="areaKey + 'AreaCountC'"
        class="module"
        :obj="areaDeviceData"
      />
      <AlarmCount
        ref="alarm_count"
        class="module"
        :obj="statusData"
      />
    </div>
    <div class="top">
      <div class="main-title">
        <img
          :src="title.logo"
          class="main-title-logo"
        >
        <p class="main-title-text">{{ title.text }}</p>
      </div>
      <div class="update">
        数据更新时间: <p class="update-time">{{ updateTime }}</p>
      </div>
    </div>
    <div class="bottom">
      <Info
        ref="info"
        :obj="areaDeviceData"
      />
    </div>
    <div class="right">
      <!-- <AlarmFactory
        class="module"
        :list="alarmList"
        @current-row="clickAlarm"
      /> -->
      <div class="right-top">

        <div class="title">分厂告警信息</div>
        <virtual-list
          style="height: 100%; overflow-y: auto;"
          make
          list
          scrollable
          :data-key="'uid'"
          :data-sources="alarmList"
          :data-component="itemComponent"
        />
        <Status
          v-if="alarmList.length === 0"
          img="null"
          text="暂无告警信息"
        />
      </div>
      <AlarmPoint
        ref="alarm_point"
        class="module"
      />
    </div>
    <div
      class="iconfont icon-close"
      @click="closeClick()"
    />
  </div>
</template>

<script>
import {
  company,
  factory,
  areaPage,
  cell,
  device,
  handelAlarm,
  deviceStatus
} from '@/api/station'
import { debounce } from '@/utils'
import { mapState, mapActions, mapMutations } from 'vuex'
import { getCell, setCell, removeCell, setCurrentFactory } from '@/utils/auth'

import AreaCountA from './components/AreaCountA'
import AreaCountB from './components/AreaCountB'
import AreaCountC from './components/AreaCountC'
import AlarmCount from './components/AlarmCount'

import Map from './components/Map'
import Info from './components/Info'

import AlarmFactory from './components/AlarmFactory'
import AlarmPoint from './components/AlarmPoint'
import { Socket } from '@/utils/socket'
import VirtualList from 'vue-virtual-scroll-list'

export default {
  name: 'Home',
  components: {
    AreaCountA,
    AreaCountB,
    AreaCountC,
    AlarmCount,
    Map,
    Info,
    // AlarmFactory,
    VirtualList,
    AlarmPoint
  },
  data() {
    return {
      itemComponent: AlarmFactory,
      areaKey: 0,

      resizeHandler: null,
      wsAlarm: null,
      wsAreaDevice: null,
      wbSockeStatus: null,
      areaDeviceData: {},
      alarmList: [],
      statusData: {},
      legend: [],
      companyList: [],
      factoryList: [],

      title: {
        text: '新视智科温度监测系统',
        logo: require('@/assets/logo.svg')
      },
      updateTime: '',
      areaCount: 4
    }
  },
  computed: {
    ...mapState({
      currentFactory: (state) => state.station.currentFactory
    })
    // wsUrlAlarm() {
    //   return `${baseUrl}alarm?tid=${this.currentFactory.uid}&api_token=${token}`
    // },
    // wsUrlAreaDevice() {
    //   return `${baseUrl}factory_info?factory_id=${this.currentFactory.uid}&api_token=${token}`
    // },
    // wsUrlStatus() {
    //   return `${baseUrl}alarm_statistics?factory_id=${this.currentFactory.uid}&api_token=${token}`
    // }
  },
  watch: {
    currentFactory: {
      handler: function (newVal, oldVal) {
        if (newVal) {
          this.init()
        }
      },
      deep: true
    }
  },
  created() {
    // this.sendWsAreaDevice()
    // this.sendWsAlarm()
    // this.sendWsStatus()
    this.queryCompany().then((res) => {
      this.queryFactory(res)
    })
  },
  mounted() {
    this.updateTime = this.util.formatTime(new Date())
    // window.onresize = this.resize
    // this.autoSize()
    // this.autoSize()
    this.resize()

    this.resizeHandler = debounce(() => {
      this.resize()
    }, 300)
    this.initResizeEvent()
  },
  beforeDestroy() {
    this.destroyResizeEvent()
    this.destroyWs()
    this.autoSize(1)
  },
  methods: {
    ...mapMutations({
      SET_ALARMITEM: 'station/SET_ALARMITEM',
      SET_ALARMLIST: 'station/SET_ALARMLIST',
      SET_FACTORY: 'station/SET_FACTORY',
      SET_CELL: 'station/SET_CELL'
    }),

    init() {
      this.destroyWs()
      this.sendWsAreaDevice()
      this.sendWsAlarm()
      this.sendWsStatus()
    },

    clickMap(obj) {
      setCurrentFactory(obj)
      this.SET_FACTORY(obj)
    },

    clickAlarm(obj) {
      this.SET_ALARMITEM(obj)
    },
    destroyWs() {
      this.wsAlarm && this.wsAlarm.destroy()
      this.wsAreaDevice && this.wsAreaDevice.destroy()
      this.wbSockeStatus && this.wbSockeStatus.destroy()
    },
    queryCompany() {
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
      if (arr.length > 0) {
        try {
          // 工厂
          const id_company = this.companyList.find(
            (v) => v.s_name === '云南分公司'
          ).uid
          const factoryResult = await factory(id_company, 1)

          this.factoryList = factoryResult.data.result.stations || []
          const len = this.factoryList.length

          // const hasData = len > 1 ? this.factoryList[1] : this.factoryList[0]
          const hasData = len > 1 ? this.factoryList[0] : this.factoryList[0]
          this.SET_FACTORY(hasData)
          setCurrentFactory(hasData)
          this.factoryId = hasData.uid
        } catch (err) {
          this.$message('工厂错误')
        }
      }
    },
    sendWsAlarm() {
      const url = '/alarm'
      const params = {
        url,

        data: {
          tid: this.currentFactory.uid
        }
      }

      this.wsAlarm = new Socket(params)
      this.wsAlarm.onmessage((data) => {
        console.log('data :>> ', data)
        this.alarmList = data
        this.SET_ALARMLIST(this.alarmList)
      })
    },
    sendWsAreaDevice() {
      const url = '/factory_info'
      const params = {
        url,
        data: {
          factory_id: this.currentFactory.uid
        }
      }

      this.wsAreaDevice = new Socket(params)
      this.wsAreaDevice.onmessage((data) => {
        // this.areaKey++

        this.areaDeviceData = data
      })
    },
    sendWsStatus() {
      const url = '/alarm_statistics'
      const params = {
        url,

        data: {
          factory_id: this.currentFactory.uid
        }
      }
      this.wbSockeStatus = new Socket(params)
      this.wbSockeStatus.onmessage((data) => {
        this.statusData = data
      })
    },
    autoSize(cancle) {
      if (cancle) {
        document.getElementById('app').style.height = 100 + 'vh'
        document.getElementById('app').style.width = 100 + 'vw'
        document.getElementById('app').style.transform = 'none'

        return
      }
      // 自适应窗口大小
      const h = window.innerHeight / 900
      const w = window.innerWidth / 1600
      const rate = Math.floor((w < h ? w : h) / 0.01) / 100
      // let rate = 1
      document.getElementById('app').style.height = 100 / rate + 'vh'
      document.getElementById('app').style.width = 100 / rate + 'vw'
      document.getElementById('app').style.transform = 'scale(' + rate + ')'
      // console.log(rate, h, w);
    },

    resize() {
      this.autoSize()
      this.$nextTick(() => {
        try {
          this.$refs.map && this.$refs.map.chart.resize()
          this.$refs.area_count_a && this.$refs.area_count_a.chart.resize()
          this.$refs.area_count_b && this.$refs.area_count_b.chart.resize()
          this.$refs.area_count_c && this.$refs.area_count_c.chart.resize()
          this.$refs.alarm_count && this.$refs.alarm_count.chart.resize()
          this.$refs.alarm_point && this.$refs.alarm_point.chart.resize()
        } catch (err) {
          console.log('resize :>> ', err)
        }
      })
    },
    initResizeEvent() {
      window.addEventListener('resize', this.resizeHandler)
    },
    destroyResizeEvent() {
      window.removeEventListener('resize', this.resizeHandler)
    },
    closeClick() {
      // 关闭大屏
      // this.$router.push({ name: 'Dashboard' })
      this.$router.push({ name: 'AddDevice' })
    }
  }
}
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-size: 16px;
  line-height: 1;
  font-family: 'PingFang SC', 'Microsoft Yahei', sans-serif;
  text-decoration: none;
  color: #ffffff;
}
#home {
  position: relative;
  display: flex;
  padding: 30px;
  height: 100%;
  width: 100%;
  justify-content: space-around;
  background: hsla(210, 6%, 16%, 1);
}
.left,
.right {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 28%;
  gap: 20px;
  z-index: 1;
  .module {
    width: 100%;
  }
  .right-top {
    height: calc(66% - 20px);
    display: flex;
    flex-direction: column;
    padding: 20px;
    border-radius: 2px;
    background: rgba(0, 0, 0, 0.1);
    position: relative;
    .title {
      font-size: 24px;
      font-weight: 800;
      color: var(--theme);
      font-family: 'PingFang SC', 'Microsoft Yahei', sans-serif;
      margin-bottom: 20px;
    }
  }
}
.top {
  position: absolute;
  width: 100%;
  z-index: 1;
  .main-title {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    letter-spacing: 2px;
    gap: 10px;
    &-logo {
      width: 40px;
    }
    &-text {
      font-size: 28px;
      font-weight: 600;
    }
  }
  .update {
    display: flex;
    padding: 10px 0 0 0;
    width: 100%;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.7);
    &-time {
      margin: auto 30px auto 6px;
      font-family: 'DIN', 'PingFang SC', 'Microsoft Yahei', sans-serif;
      font-weight: 600;
      color: var(--theme);
    }
  }
}
.bottom {
  margin: auto auto 0 auto;
  height: 40%;
  width: 44%;
  // background: rgba(255, 255, 255, 0.1);
  z-index: 1;
}

#map {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
}
.icon-close {
  position: absolute;
  padding: 13px;
  top: 0;
  right: 0;
  font-size: 24px;
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  opacity: 0.3;
  transition: all ease, 0.3s;
  z-index: 3;
  &:hover {
    opacity: 1;
  }
}
</style>
