<template>
  <div
    id="home"
    class="home"
  >
    <Map
      :id="'map'"
      ref="map"
    />
    <div class="left">
      <AreaCountA
        ref="area_count_a"
        class="module"
        :count="areaCount"
      />
      <AreaCountB
        ref="area_count_b"
        class="module"
        :count="areaCount"
      />
      <AreaCountC
        ref="area_count_c"
        class="module"
        :count="areaCount"
      />
      <AlarmCount
        ref="alarm_count"
        class="module"
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
      <Info ref="info" />
    </div>
    <div class="right">
      <AlarmFactory
        class="module"
        :list="alarmList"
      />
      <AlarmPoint
        ref="alarm_point"
        class="module"
        :list="areaDeviceData"
      />
    </div>
    <div
      class="iconfont icon-close"
      @click="closeClick()"
    />
  </div>
</template>

<script>
import { debounce } from '@/utils'
import { mapState, mapActions, mapMutations } from 'vuex'

import AreaCountA from '@/modules/index/AreaCountA'
import AreaCountB from '@/modules/index/AreaCountB'
import AreaCountC from '@/modules/index/AreaCountC'
import AlarmCount from '@/modules/index/AlarmCount'

import Map from '@/modules/index/Map'
import Info from '@/modules/index/Info'

import AlarmFactory from '@/modules/index/AlarmFactory'
import AlarmPoint from '@/modules/index/AlarmPoint'
import { Socket } from '@/utils/socket'
const baseUrl = `${process.env.VUE_APP_SOCKET_API}/api/ws/`

export default {
  name: 'Home',
  components: {
    AreaCountA,
    AreaCountB,
    AreaCountC,
    AlarmCount,
    Map,
    Info,
    AlarmFactory,
    AlarmPoint
  },
  data() {
    return {
      resizeHandler: null,
      wsAlarm: null,
      wsAreaDevice: null,
      wbSockeStatus: null,
      areaDeviceData: [],
      alarmList: [],
      statusList: [],

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
    }),
    wsUrlAlarm() {
      return `${baseUrl}alarm?tid=${this.currentFactory.uid}`
    },
    wsUrlAreaDevice() {
      return `${baseUrl}factory_info?factory_id=${this.currentFactory.uid}`
    },
    wsUrlStatus() {
      return `${baseUrl}alarm?tid=${this.currentFactory.uid}`
    }
  },
  created() {
    this.sendWsAreaDevice()
    this.sendWsAlarm()
  },
  mounted() {
    this.updateTime = this.util.formatTime(new Date())
    // window.onresize = this.resize
    // this.autoSize()
    // this.autoSize()

    this.resizeHandler = debounce(() => {
      this.resize()
    }, 300)
    this.initResizeEvent()
  },
  beforeDestroy() {
    this.destroyResizeEvent()
  },
  methods: {
    sendWsAlarm() {
      this.wsAlarm = new Socket({ url: this.wsUrlAlarm })
      this.wsAlarm.onmessage((data) => {
        this.alarmList = data
      })
    },
    sendWsAreaDevice() {
      this.wsAreaDevice = new Socket({ url: this.wsUrlAreaDevice })
      this.wsAreaDevice.onmessage((data) => {
        this.areaDeviceData = data
      })
    },
    autoSize() {
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
        this.$refs.map.chart.resize()
        this.$refs.area_count_a.chart.resize()
        this.$refs.area_count_b.chart.resize()
        this.$refs.area_count_c.chart.resize()
        this.$refs.alarm_count.chart.resize()
        this.$refs.alarm_point.chart.resize()
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
    }
  }
}
</script>

<style lang="scss" scoped>
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
