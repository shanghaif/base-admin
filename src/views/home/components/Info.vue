<template>
  <div id="info">
    <div class="title">{{ company }} {{ currentFactory.s_name }}</div>
    <div class="area-container">
      <div
        v-for="(item, index) of currentObj.area_infos"
        :key="index"
        class="area"
        @click="areaClick(item)"
      >
        {{ item.name }}<span>详情</span>
      </div>
    </div>
    <div class="sub">告警信息统计时间: {{ $dayjs().format('YYYY年MM月DD日') }}
      <b
        style="color:#fff"
        @click="logClick()"
      >告警信息日志<span class="iconfont icon-arrow" /></b>
    </div>
    <div class="rate-container">
      <div class="rate">
        <div class="rate-ring">
          <div
            ref="ring_online"
            class="rate-ring-color"
          />
          <div class="rate-ring-num">{{ rate.online }}</div>
        </div>
        电解槽在线率
      </div>
      <div class="rate">
        <div class="rate-ring">
          <div
            ref="ring_running"
            class="rate-ring-color"
          />
          <div class="rate-ring-num">{{ rate.running }}</div>
        </div>
        电解槽运行率
      </div>
      <div class="rate">
        <div class="rate-ring">
          <div
            ref="ring_alarm"
            class="rate-ring-color"
          />
          <div class="rate-ring-num">{{ rate.alarm }}</div>
        </div>
        电解槽告警率
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  name: 'Info',
  props: {
    obj: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      company: '云南分公司',
      date: '',
      bath: { total: 0, online: 0, running: 0, alarm: 0 },
      rate: { online: 0, running: 0, alarm: 0 },
      currentObj: {}
    }
  },
  computed: {
    ...mapState({
      currentFactory: (state) => state.station.currentFactory
    })
  },
  watch: {
    obj: {
      handler: function (newVal, oldVal) {
        if (newVal) {
          this.currentObj = newVal
          this.getRate()
          this.updateColor()
        }
      },
      deep: true
    }
  },

  mounted() {
    // 随机数据
    const d = new Date()
    this.date =
      d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDay() + '日'
    // this.bath.total = Math.floor(Math.random() * 100 + 800)
    // this.bath.online = this.bath.total - Math.floor(Math.random() * 80)
    // this.bath.running = this.bath.online - Math.floor(Math.random() * 90)
    // this.bath.alarm = this.bath.running - Math.floor(Math.random() * 100 + 600)
    // this.rate.online =
    //   Math.floor((this.bath.online / this.bath.total) * 1000) / 10
    // this.rate.running =
    //   Math.floor((this.bath.running / this.bath.total) * 1000) / 10
    // this.rate.alarm =
    //   Math.floor((this.bath.alarm / this.bath.total) * 1000) / 10
    // this.updateColor()
  },
  methods: {
    ...mapMutations({
      SET_ALARMITEM: 'station/SET_ALARMITEM'
    }),
    areaClick(item) {
      const obj = {
        Area: item.name,
        AreaID: item.id,
        Company: '云南分公司',
        Factory: this.currentFactory.s_name,
        t_id: ''
      }
      this.SET_ALARMITEM(obj)
      this.$router.push({ path: '/detail', isInfoClick: true })
    },
    getRate() {
      if (this.currentObj.all_bath) {
        const total = this.currentObj.all_bath
        const alarm = this.currentObj.alarm_bath
        const running = this.currentObj.run_bath
        const online = this.currentObj.online_bath
        this.bath = { total, online, running, alarm }
        this.rate = {
          online: ((online * 100) / total).toFixed(0),
          running: ((running * 100) / total).toFixed(0),
          alarm: ((alarm * 100) / total).toFixed(0)
        }
      } else {
        this.rate = {
          online: 0,
          running: 0,
          alarm: 0
        }
      }
    },
    updateColor() {
      const colorOnline = 'hsla(250, 80%, 44%, 1)'
      this.$refs.ring_online.style.background =
        'conic-gradient(var(--total) 0, ' +
        colorOnline +
        ' ' +
        this.rate.online / 2.5 +
        '%, var(--total) ' +
        this.rate.online +
        '%, rgba(50, 50, 50, 1) 0 100%)'

      const colorRunning = 'hsla(190, 80%, 44%, 1)'
      this.$refs.ring_running.style.background =
        'conic-gradient(var(--theme) 0, ' +
        colorRunning +
        ' ' +
        this.rate.running / 2.5 +
        '%, var(--theme) ' +
        this.rate.running +
        '%, rgba(50, 50, 50, 1) 0 100%)'

      const colorAlarm = 'hsla(354, 80%, 44%, 1)'
      this.$refs.ring_alarm.style.background =
        'conic-gradient(var(--alarmB) 0, ' +
        colorAlarm +
        ' ' +
        this.rate.alarm / 2.5 +
        '%, var(--alarmB) ' +
        this.rate.alarm +
        '%, rgba(50, 50, 50, 1) 0 100%)'
    },
    logClick() {
      // 跳转告警日志
      this.$router.push({ name: 'AlarmHistory' })
    }
  }
}
</script>

<style lang="scss" scoped>
#info {
  padding: 20px 40px;
  height: 100%;
  width: 100%;
}

.title {
  font-size: 30px;
  text-shadow: 0 6px 6px rgba(0, 0, 0, 0.5);
}
.sub {
  margin-top: 8px;
  color: rgba(255, 255, 255, 0.7);
  text-shadow: 0 6px 6px rgba(0, 0, 0, 0.5);
  b {
    cursor: pointer;
    span {
      display: inline-block;
      transform: rotate(-90deg);
    }
  }
}

.area-container {
  display: flex;
  padding: 12px 0;
  gap: 10px;
  .area {
    display: flex;
    flex-wrap: nowrap;
    padding: 10px 16px;
    font-size: 14px;
    white-space: nowrap;
    border-radius: 2px;
    background: rgba(255, 255, 255, 0.05);
    transition: all ease, 0.2s;
    cursor: pointer;
    span {
      overflow: hidden;
      width: 0;
      font-size: 14px;
      font-weight: 800;
      white-space: nowrap;
      color: var(--theme);
      transition: all ease, 0.2s;
    }
    &:hover {
      background: var(--theme-bg);
      box-shadow: 0 0 0 1px var(--theme);
      span {
        margin-left: 10px;
        width: 28px;
      }
    }
  }
}

.rate-container {
  display: flex;
  gap: 0.5%;
  margin-top: 18px;
  height: calc(100% - 130px);
  width: 100%;
}
.rate {
  display: flex;
  gap: 8%;
  flex-direction: column;
  min-height: 100%;
  width: 33%;
  align-items: center;
  justify-content: center;
  &-ring {
    position: relative;
    width: 65%;
    border-radius: 50%;
    box-shadow: 4px 6px 10px 0 rgba(0, 0, 0, 0.5),
      inset 10px 20px 10px 0 rgba(0, 0, 0, 0.5);
    &-color {
      padding-top: 100%;
      width: 100%;
      border-radius: 50%;
      mask-image: radial-gradient(
        rgba(255, 255, 255, 0) 0 53%,
        rgba(255, 255, 255, 1) 55% 100%
      );
    }
    &-num {
      position: absolute;
      top: calc(50% - 18px);
      width: 100%;
      font-family: 'DIN';
      font-size: 32px;
      text-align: center;
      &:after {
        content: '%';
        font-size: 20px;
      }
    }
  }
}
</style>
