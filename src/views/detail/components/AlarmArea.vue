<template>
  <div id="module">
    <div class="title">{{ title }}</div>
    <div class="sub">{{ company }} / {{ factory }} / {{ area }}</div>
    <div class="alarm">
      <Status
        v-if="alarm.length === 0"
        img="null"
        text="暂无告警信息"
      />

      <div
        v-for="(item, index) of alarm"
        v-else
        :key="index"
        class="alarm-item"
        :class="item.alarmId === 0 ? 'alarm-a' : item.alarmId === 3 ? 'alarm-c' : 'alarm-b'"
        @click="itemClick()"
      >
        <div class="left">
          <div class="position">{{ item.area }} / {{ item.bath }}</div>
          <div class="msg"><span>{{ item.name }}</span>: {{ item.alarmText }}</div>
        </div>
        <div class="right">
          {{ item.alarmTime }} <span class="iconfont icon-arrow" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      title: '分区告警信息',
      alarm: [],
      company: '云南分公司',
      factory: '电解铝二厂',
      area: '二分区'
    }
  },
  mounted() {
    this.updateValue()
  },
  methods: {
    updateValue() {
      // 生成随机告警数据
      const alarmText = ['离线', '温度告警', '趋势预警', '异常设备']
      const randomCount = Math.floor(Math.random() * 20 + 1)
      for (let i = 0; i < randomCount; i++) {
        const alarmId = Math.floor(Math.random() * 4)
        const alarmTime =
          i === 0
            ? new Date()
            : new Date(
              new Date(this.alarm[i - 1].alarmTime) - Math.random() * 43200000
            )
        const alarmMsg = {
          area: '二分区',
          bath: '电解槽' + Math.floor(Math.random() * 500 + 1000),
          alarmId: alarmId,
          alarmText: alarmText[alarmId],
          name: 'run@' + Math.floor(Math.random() * 114514.191981) + '.exe',
          alarmTime: this.util.formatTime(alarmTime)
        }
        this.$set(this.alarm, i, alarmMsg)
      }
      // console.log(this.alarm);
    },
    itemClick() {
      window.location.href = '/#/detail'
    }
  }
}
</script>

<style lang="scss" scoped>
#module {
  height: 100%;
}
.sub {
  margin: 10px 0;
}

.alarm {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 2px 8px;
  margin: 4px -8px 0 -8px;
  height: calc(100% - 58px);
  width: calc(100% + 16px);
  overflow-y: scroll;
  &-item {
    display: flex;
    padding: 14px;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.1);
    cursor: pointer;
    transition: all ease, 0.3s;
    &:hover {
      // margin: 4px auto;
      transform: scale(1.03);
    }
    .left {
      width: calc(100% - 138px);
      .position {
        margin-bottom: 8px;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.7);
      }
      .msg {
        display: flex;
        width: 100%;
        white-space: nowrap;
        span {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
    .right {
      display: flex;
      margin: auto 0 auto 0;
      gap: 4px;
      width: 124px;
      font-size: 14px;
      font-family: 'DIN', 'PingFang SC', 'Microsoft Yahei', sans-serif;
      white-space: nowrap;
      align-items: center;
      opacity: 0.7;
      span {
        font-size: 14px;
        display: inline-block;
        transform: rotate(-90deg);
      }
    }
  }
  .alarm-a {
    background: var(--alarmA-bg);
    box-shadow: inset 0 0 0 1px var(--alarmA-20);
    .left .msg,
    .left .msg span {
      color: var(--alarmA);
    }
  }
  .alarm-b {
    background: var(--alarmB-bg);
    box-shadow: inset 0 0 0 1px var(--alarmB-20);
    .left .msg,
    .left .msg span {
      color: var(--alarmB);
      font-weight: 800;
    }
  }
  .alarm-c {
    background: var(--alarmC-bg);
    box-shadow: inset 0 0 0 1px var(--alarmC-20);
    .left .msg,
    .left .msg span {
      color: var(--alarmC);
      font-weight: 600;
    }
  }
}
</style>
