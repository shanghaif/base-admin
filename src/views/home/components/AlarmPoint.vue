<template>
  <div id="module">
    <div class="title">告警点位温度曲线</div>

    <div
      v-show="alarmList.length > 0"
      class="info"
    >
      <div class="left">
        <div class="position">{{ currentAlarmObj.Area }} / {{ currentAlarmObj.Bath }}</div>
        <div
          class="msg"
          :class="pointTextClass(currentAlarmObj)"
        >{{ currentAlarmObj.t_id }}: {{ currentAlarmObj.alarm_id |typeText }}</div>
      </div>
      <div class="right">
        <div class="temp-text">当前温度</div>
        <div
          class="temp"
          :class="pointTextClass(currentAlarmObj)"
        >{{ nowTemp }}</div>
      </div>
    </div>
    <div class="chart">
      <!-- <div id="alarm-point" /> -->
      <HistoryChart
        :id="'homeHistoryChart'"
        ref="HistoryChart"
        :list="list"
        :options="{fontSize:10,splitNumber_x:9,splitNumber_y:5,lineWidth:2,isShowMax:false}"
      />
      <div
        v-show="alarmListIndex !== 0 && hasAlarm"
        class="iconfont icon-arrow left"
        @click="clickArrow(0)"
      />
      <div
        v-show="alarmListIndex !== alarmList.length - 1 && hasAlarm"
        class="iconfont icon-arrow right"
        @click="clickArrow(1)"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'
import { deviceHistory, devicePoint } from '@/api/station'
import HistoryChart from '@/components/HistoryChart'

import sortBy from 'lodash/sortBy'

export default {
  name: 'AlarmPoint',
  components: { HistoryChart },

  filters: {
    typeText(val) {
      let res = ''
      if (val === 'temperature_high') {
        res = '温度告警'
      } else if (val === 'offline') {
        res = '离线'
      } else if (val === 'rate_high') {
        res = '趋势预警'
      } else if (val === 'abnormal') {
        res = '设备异常'
      }
      return res
    }
  },
  data() {
    return {
      tempMin: 300,

      chart: null,
      alarmListIndex: 0,
      exportDialogVisible: false,

      value: Math.random() * 100,
      step: 60 * 1000,
      option: null,
      timer: null,

      newList: [],
      checkedTemp: [],
      Temps: ['原始温度数据', '最高温度', '最低温度', '平均温度'],
      now: 0,
      date: '',
      exportDate: [],
      allPointList: [
        {
          tid: '',
          value: 0
        }
      ],
      list: [],

      queryParams: {
        sTime: '',
        eTime: '',
        id: ''
      }
    }
  },
  computed: {
    ...mapState({
      alarmList: (state) => state.station.alarmList,
      tempHeight: (state) => state.station.tempHeight
    }),

    currentAlarmObj: {
      get() {
        return (
          (this.alarmList.length > 0 &&
            this.alarmList[this.alarmListIndex]) || { Area: '' }
        )
      },
      set(v) {}
    },

    hasAlarm() {
      return this.alarmList.length > 0
      // return this.list.length > 0
    },
    xData() {
      return this.list.map((v) => {
        this.tempMin = this.tempMin < v.fv ? this.tempMin : v.fv

        const time = this.$dayjs(v.pick_time).format('YYYY-MM-DD HH:mm:ss')
        return { value: [time, v.fv] }
      })
    },
    nowTemp() {
      return (
        (this.list.length > 1 && this.list[this.list.length - 1]['fv']) || ''
      )
    }
  },
  watch: {
    alarmList: {
      handler(newName, oldName) {
        clearInterval(this.timer)

        // this.newList = [...newName]
        if (newName.length > 0) {
          this.alarmListIndex = 0

          this.init()
          this.timer = setInterval(() => {
            this.loop()
          }, this.step)
        } else {
          this.list = []
          // this.initChart()
        }
      },
      deep: true
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  mounted() {},
  methods: {
    ...mapMutations({
      SET_TEMPHEIGHT: 'station/SET_TEMPHEIGHT'
    }),
    init() {
      this.queryParams.sTime =
        this.$dayjs(this.currentAlarmObj.AlarmTime).format('YYYY-MM-DD') +
        ' 00:00'
      this.queryParams.eTime =
        this.$dayjs(this.currentAlarmObj.AlarmTime).format('YYYY-MM-DD') +
        ' 23:59'

      this.queryPiontHistory()
    },
    pointTextClass(point) {
      let res = ''
      const val = point.alarm_id

      if (val === 'rate_high') {
        res = 'wram-text'
      } else if (val === 'offline') {
        res = ''
      } else if (val === 'temperature_high') {
        res = 'red-text'
      } else if (val === 'abnormal') {
        res = 'red-text'
      } else {
        res = 'null-text'
      }

      return res
    },
    styleStatus(val) {
      const obj = {}
      obj['alarm-a'] = val === 'offline'
      obj['alarm-b'] = val === 'temperature_high' || val === 'abnormal'
      obj['alarm-c'] = val === 'rate_high'

      return obj
    },
    clickArrow(isAdd) {
      if (!this.hasAlarm) {
        return
      }
      if (isAdd) {
        this.alarmListIndex++
      } else {
        this.alarmListIndex--
      }
      this.init()
    },
    loop() {
      this.alarmListIndex++
      if (this.alarmListIndex === this.alarmList.length) {
        this.alarmListIndex = 0
      } else if (this.alarmListIndex === -1) {
        this.alarmListIndex = this.alarmList.length - 1
      }
      this.init()
    },

    queryPiontHistory() {
      this.queryParams.id = this.currentAlarmObj.t_id
      deviceHistory(this.queryParams)
        .then((res) => {
          const arr = (res.data.result && res.data.result.list) || []
          res.data.result && this.SET_TEMPHEIGHT(res.data.result.high)
          this.list = sortBy(arr, (v) => v.pick_time)
        })
        .catch((err) => {
          this.$message(err)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
#module {
  height: 34%;
}
.info {
  display: flex;
  margin-top: 16px;
  .left {
    margin-right: 10px;
    width: calc(65% - 10px);
  }
  .position,
  .temp-text {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
  }
  .msg {
    margin-top: 8px;
  }
  .alarm-b {
    font-weight: 800;
    color: var(--alarmB);
  }
  .right {
    display: flex;
    flex-direction: column;
    width: 35%;
    text-align: right;
    justify-content: right;
  }
  .temp {
    display: flex;
    margin: 6px 0 auto auto;
    font-size: 18px;
    font-family: 'DIN', 'PingFang SC', 'Microsoft Yahei', sans-serif;

    &:after {
      display: inline-block;
      margin: 0px 0 auto 0;
      content: '°C';
      font-size: 12px;
    }
  }
}

.chart {
  position: relative;
  height: calc(100% - 78px);
  width: 100%;
  #alarm-point {
    height: 100%;
    width: 100%;
  }
  .icon-arrow:before {
    position: absolute;
    display: inline-block;
    top: 45%;
  }
  .left:before {
    left: -16px;
    transform: scale(1.4, 2.8) rotate(90deg);
    opacity: 0.7;
  }
  .right:before {
    right: -16px;
    transform: scale(1.4, 2.8) rotate(-90deg);
    opacity: 0.7;
    cursor: pointer;
  }
}
</style>
