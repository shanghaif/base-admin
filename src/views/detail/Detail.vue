<template>
  <div
    id="detail"
    class="new-detail"
  >
    <Background />
    <div
      class="top"
      style="font-size:16px"
    >
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
    <div class="left">
      <BathList
        class="module"
        :lists="bathData"
        @onClick="clickBath"
      />

    </div>
    <div class="middle">
      <detail-line-chart
        ref="DetailLineChart"
        :list="piontHistoryList"
        @changeDate="changeDateQuery"
      />
    </div>
    <div class="right">
      <!-- <AlarmArea class="module" /> -->
      <!-- <AlarmFactory
        class="module"
        :list="alarmList"
        :is-area="true"
        @current-row="clickAlarm"
      /> -->
      <div class="right-top">

        <div class="title">分区告警信息</div>
        <div
          class="sub"
          style="margin:10px 0"
        >{{ alarmItem.Company }} / {{ alarmItem.Factory }} / {{ alarmItem.Area }}
        </div>

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
    </div>
    <div class="bottom">
      <Bath
        :list="pointList"
        @pointClick="pointClick"
      />
    </div>

    <div
      class="corner-btn return"
      style="color:#fff"
      @click="returnClick()"
    >
      <div class="iconfont icon-arrow" />返回首页
    </div>
    <div
      class="corner-btn close"
      @click="closeClick()"
    >
      后台管理
    </div>
  </div>
</template>

<script>
import VirtualList from 'vue-virtual-scroll-list'

import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'
import { getCell, setCell, removeCell, getCurrentFactory } from '@/utils/auth'

import sortBy from 'lodash/sortBy'
import { devicePoint, deviceHistory, exportPointInfo } from '@/api/station'
import { debounce } from '@/utils'

import Background from './components/Background'

import BathList from './components/BathList'
// import AlarmArea from './components/AlarmArea'
import Bath from './components/Bath'
import AlarmAreaList from './components/AlarmAreaList'
import DetailLineChart from './components/DetailLineChart'
// import DetailPoint from './components/DetailPoint'

// import Point from './components/Point'
import { Socket } from '@/utils/socket'
function createCellList(len) {
  const n = len
  const arr = []
  let obj = {}
  while (len--) {
    obj = {
      index: len,
      empty: true,
      tid: n - len,
      value: '无数据'
    }
    arr.push(obj)
  }
  return arr
}
export default {
  name: 'Detail',
  components: {
    Background,
    BathList,
    // Point,
    // AlarmArea,
    Bath,
    VirtualList,
    DetailLineChart
  },
  data() {
    return {
      itemComponent: AlarmAreaList,

      title: {
        text: '新视智科温度监测系统',
        logo: require('@/assets/logo.svg')
      },
      updateTime: '',
      step: 60 * 15,
      wsAlarm: null,
      wsBath: null,
      timer: null,
      alarmList: [],
      bathData: [],

      pointList: [],
      allPointList: [],
      allPointListFake: createCellList(168),
      piontHistoryList: [
        {
          fv: 0,
          pick_time: '',
          pid: '',
          tid: ''
        }
      ],
      queryParams: {
        sTime: '',
        eTime: '',
        id: ''
      }
    }
  },
  computed: {
    ...mapState({
      alarmItem: (state) => state.station.alarmItem,
      currentPoint: (state) => state.station.currentPoint,
      currentFactory: (state) => state.station.currentFactory
    })
  },
  watch: {
    'alarmItem.t_id': {
      handler: function (newVal, oldVal) {
        if (newVal) {
          // this.init()
          this.queryPiontHistory()
        }
      }
      // deep: true
    }
  },
  created() {
    this.init()
  },
  mounted() {
    this.updateTime = this.util.formatTime(new Date())
    this.resize()

    this.resizeHandler = debounce(() => {
      this.resize()
    }, 300)
    this.initResizeEvent()
  },
  beforeDestroy() {
    this.destroyResizeEvent()
    this.autoSize(1)
    this.destroyWs()
  },
  methods: {
    ...mapMutations({
      SET_ALARMITEM: 'station/SET_ALARMITEM',
      SET_TEMPHEIGHT: 'station/SET_TEMPHEIGHT',
      SET_POINT: 'station/SET_POINT'
    }),
    init() {
      this.destroyWs()
      if (!this.queryParams.sTime) {
        // 第一次进入页面默认查询时间
        this.queryParams.sTime =
          this.$dayjs(this.alarmItem.AlarmTime).format('YYYY-MM-DD') + ' 00:00'
        this.queryParams.eTime =
          this.$dayjs(this.alarmItem.AlarmTime).format('YYYY-MM-DD') + ' 23:59'
      }

      this.sendWsAlarm()
      this.sendWsBathList()
    },
    destroyWs() {
      this.wsAlarm && this.wsAlarm.destroy()
      this.wsBath && this.wsBath.destroy()
    },
    sendWsAlarm() {
      const url = '/alarm'
      const params = {
        url,

        data: {
          tid: getCurrentFactory().uid
        }
      }
      this.wsAlarm = new Socket(params)
      this.wsAlarm.onmessage((data) => {
        this.alarmList = data.filter((v) => v.Area === this.alarmItem.Area)
        // this.SET_ALARMLIST(this.alarmList)
        //  !this.alarmItem.BathID && this.alarmList
      })
    },
    sendWsBathList() {
      const url = '/area_info'
      const params = {
        url,

        data: {
          area_id: this.alarmItem.AreaID
        }
      }
      this.wsBath = new Socket(params)
      this.wsBath.onmessage((data) => {
        this.bathData = data || []
        this.queryPiont()
      })
    },
    clickAlarm(obj) {
      this.SET_ALARMITEM(obj)
      this.init()
    },
    isExcel(res) {
      let fileName = ''
      const data = res.data
      const disposition = res.headers['content-disposition']
      if (disposition) {
        fileName = window
          .decodeURI(disposition.split('=')[1], 'UTF-8')
          .replace(/"/g, '')
      }
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        const blob = new Blob([data])
        window.navigator.msSaveOrOpenBlob(blob, fileName)
      } else {
        /* 火狐谷歌的文件下载方式 */
        const blob = new Blob([data])
        const downloadElement = document.createElement('a')
        const href = window.URL.createObjectURL(blob)
        downloadElement.href = href
        downloadElement.download = fileName
        document.body.appendChild(downloadElement)
        downloadElement.click()
        document.body.removeChild(downloadElement)
        window.URL.revokeObjectURL(href)
      }
    },

    changeDateQuery(date) {
      this.queryParams.sTime = date[0] + ' 00:00'
      this.queryParams.eTime = date[1] + ' 23:59'
      this.queryPiontHistory()
    },

    clickBath(item) {
      const obj = { ...this.alarmItem }
      obj.BathID = item.bath_id
      this.SET_ALARMITEM(obj)
      devicePoint(this.alarmItem.BathID)
        .then((res) => {
          const arr = res.data.result || []
          this.allPointList = arr
          this.setFuncOfpoint()
          obj.t_id =
            this.allPointList.length > 0 ? this.allPointList[0].tid : ''
          this.SET_ALARMITEM(obj)
          this.queryPiontHistory()
        })
        .catch((err) => {
          this.$message(err)
        })
    },
    pointClick(point) {
      // this.SET_ALARMITEM(bath)
      const obj = { ...this.alarmItem }
      obj.t_id = point.tid
      obj.alarm_id = (point.alarm_type && point.alarm_type[0]) || null
      this.SET_POINT(point)
      this.SET_ALARMITEM(obj)
      // this.queryPiontHistory()
    },
    splitArr(data) {
      const result = []
      for (var i = 0; i < data.length; i += 3) {
        result.push(data.slice(i, i + 3))
      }
      return result
    },
    /* 点位数据结构 */
    setFuncOfpoint() {
      this.allPointListFake = createCellList(168)
      // let groupNum = 20,row = 1 // 电解槽一排多少组 每3个为一组
      const len = this.allPointListFake.length // 默认168个点位
      const arr = this.allPointList

      arr.length > 0 &&
        arr.forEach((v, i) => {
          // this.allPointListFake[i] = v
          this.allPointListFake.splice(v.index - 1, 1, v)
        })
      const arrFake1 = this.allPointListFake.slice(0, len / 2)
      const arrFake2 = this.allPointListFake.slice(len / 2, len)
      const newArr1 = this.splitArr(arrFake1)
      const newArr2 = this.splitArr(arrFake2)
      const pointListItem1 = newArr1.map((v, i) => {
        return { pointList: v }
      })
      const pointListItem2 = newArr2.map((v, i) => {
        return { pointList: v }
      })

      this.pointList = [{ arr: pointListItem1 }, { arr: pointListItem2 }]
      this.SET_POINT(this.allPointList[0])
    },
    queryPiont() {
      let id, name, alarm
      if (this.alarmItem.isInfoClick) {
        id = this.bathData.length && this.bathData[0].bath_id
        name = this.bathData.length && this.bathData[0].bath_name
        alarm = { ...this.alarmItem, ...{ Bath: name } }
        this.SET_ALARMITEM(alarm)
      } else {
        id = this.alarmItem.BathID
      }
      this.allPointList.length < 1 &&
        devicePoint(id)
          .then((res) => {
            const arr = res.data.result || []
            this.allPointList = arr

            this.setFuncOfpoint()
            this.queryPiontHistory()
          })
          .catch((err) => {
            this.$message(err)
          })
    },
    queryPiontHistory(now) {
      clearInterval(this.timer)
      if (this.alarmItem.isInfoClick && !this.alarmItem.t_id) {
        this.queryParams.id =
          this.allPointList.length && this.allPointList[0].tid
        this.SET_ALARMITEM({
          ...this.alarmItem,
          ...{ t_id: this.queryParams.id }
        })
      } else {
        this.queryParams.id = this.alarmItem.t_id
      }

      deviceHistory(this.queryParams)
        .then((res) => {
          const arr = (res.data.result && res.data.result.list) || []
          res.data.result && this.SET_TEMPHEIGHT(res.data.result.high)
          if (arr.length === 1) {
            // 每隔15分钟请求一次
            this.piontHistoryList.shift(arr[0])
            this.piontHistoryList.push(arr[0])
          } else {
            this.piontHistoryList = sortBy(arr, (v) => v.pick_time)
          }
        })
        .catch((err) => {
          this.$message(err)
        })
      this.timer = setInterval(() => {
        this.queryParams.eTime = this.$dayjs().format('YYYY-MM-DD HH:mm')
        this.queryParams.sTime = this.$dayjs(this.queryParams.eTime)
          .subtract(this.step, 'seconds')
          .format('YYYY-MM-DD HH:mm')
        deviceHistory(this.queryParams)
      }, this.step * 1000)
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
      // rate < 0.8 ? (rate = 0.8) : rate

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
          this.$refs.DetailLineChart &&
            this.$refs.DetailLineChart.$refs.HistoryChart.chart.resize()
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
    returnClick() {
      this.$router.push({ path: '/' })
    },
    closeClick() {
      // 关闭大屏
      // this.$router.push({ name: 'Dashboard' })
      this.$router.push({ name: 'AlarmHistory' })
    }
  }
}
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  // font-size: 16px;
  line-height: 1;
  font-family: 'PingFang SC', 'Microsoft Yahei', sans-serif;
  text-decoration: none;
  color: #ffffff;
}
#detail {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  padding: 30px;
  height: 100%;
  width: 100%;
  justify-content: space-around;
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
.left,
.right {
  position: relative;
  height: 66%;
  width: 28%;
  z-index: 0;
  .module {
    width: 100%;
  }
  .right-top {
    height: 100%;
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
      // margin-bottom: 20px;
    }
  }
}
.middle {
  padding-top: 86px;
  margin: auto 20px;
  height: 66%;
  width: calc(44% - 40px);
  // background: rgba(255, 255, 255, 0.1);
  z-index: 1;
}
.bottom {
  padding-top: 20px;
  height: 34%;
  width: 100%;
  // background: rgba(255, 255, 255, 0.7);
  z-index: 1;
}
</style>
