<template>
  <div class="sheet-main">
    <div class="chart-box-title big">云南分公司 {{ currentFactory.s_name }}</div>
    <div class="tip">
      <span class="time">告警信息汇总 {{ newDtate }}</span>
      <span
        class="link"
        @click="goAlarm"
      >告警信息日志
        <i class="el-icon-arrow-right go-link" /></span>
    </div>
    <div class="cells">
      <!-- <div
        v-for="(item, i) in list1"
        :key="i + 'a'"
        class="cell"
      >
        <span
          class="num"
          :class="item.class"
        >{{ item.num }}</span>
        <span class="text">{{ item.text }}</span>
      </div> -->
      <div class="cell">
        <span class="num">{{ totalCells }}</span>
        <span class="text">总电解槽</span>
      </div>
      <div class="cell">
        <span class="num blue">{{ totalCells }}</span>
        <span class="text">已部署电解槽</span>
      </div>
      <div class="cell">
        <span class="num red">{{ totalWarningCell }}</span>
        <span class="text">告警电解槽</span>
      </div>
      <div class="cell">
        <span class="num yellow">{{ totalUnnormalCell }}</span>
        <span class="text">异常电解槽</span>
      </div>
      <div class="cell">
        <span class="num">{{ totalPoint }}</span>
        <span class="text">总测温点位</span>
      </div>
      <div class="cell">
        <span class="num">{{ totalPoint }}</span>
        <span class="text blue">已部署点位</span>
      </div>
      <div class="cell">
        <span class="num red">{{ totalWarningPoint }}</span>
        <span class="text">告警点位</span>
      </div>
      <div class="cell">
        <span class="num yellow">{{ totalUnnormalPoint }}</span>
        <span class="text">异常点位</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  name: 'SheetMain',
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      list1: [
        { text: '总电解槽', num: 163, class: '' },
        { text: '已部署电解槽', num: 163, class: 'blue' },
        { text: '告警电解槽', num: 105, class: 'red' },
        { text: '异常电解槽', num: 18, class: 'yellow' },
        { text: '总测温点位', num: 97776, class: '' },
        { text: '已部署点位', num: 86033, class: 'blue' },
        { text: '告警点位', num: 233, class: 'red' },
        { text: '异常点位', num: 107, class: 'yellow' }
      ],
      list3: [
        {
          factory: '电解铝二厂',
          area: '一分区',
          cells: 55,
          point: 168,
          child: [
            { name: '异常点位', num: 5 },
            { name: '趋势告警', num: 7 },
            { name: '温度告警', num: 32 },
            { name: '离线点位', num: 412 }
          ]
        },
        {
          factory: '电解铝二厂',
          area: '二分区',
          cells: 48,
          point: 168,
          child: [
            { name: '异常点位', num: 3 },
            { name: '趋势告警', num: 9 },
            { name: '温度告警', num: 28 },
            { name: '离线点位', num: 273 }
          ]
        },
        {
          factory: '电解铝二厂',
          area: '三分区',
          cells: 50,
          point: 168,
          child: [
            { name: '异常点位', num: 10 },
            { name: '趋势告警', num: 6 },
            { name: '温度告警', num: 45 },
            { name: '离线点位', num: 23 }
          ]
        }
      ]
    }
  },
  computed: {
    ...mapState({
      currentFactory: (state) => state.station.currentFactory
    }),
    newDtate() {
      return this.$dayjs().format('YYYY年MM月DD日')
    },
    totalCells() {
      // 总电解槽
      const sum = this.list.reduce((pre, cur) => {
        return cur.bath_all + pre
      }, 0)
      return sum
    },
    totalUnnormalCell() {
      // 异常电解槽
      const sum = this.list.reduce((pre, cur) => {
        return cur.bath_abnormal + pre
      }, 0)
      return sum
    },
    totalWarningCell() {
      // 告警电解槽
      const sum = this.list.reduce((pre, cur) => {
        return cur.bath_alarm + pre
      }, 0)
      return sum
    },
    totalPoint() {
      // 总点位
      const sum = this.list.reduce((pre, cur) => {
        return cur.point_all + pre
      }, 0)
      return sum
    },
    totalUnnormalPoint() {
      // 异常点位
      const sum = this.list.reduce((pre, cur) => {
        return cur.point_offline_alarm + pre
      }, 0)
      return sum
    },
    totalWarningPoint() {
      // 告警点位
      const sum = this.list.reduce((pre, cur) => {
        return cur.point_trend_alarm + cur.point_temperature_high_alarm + pre
      }, 0)
      return sum
    }
  },
  methods: {
    goAlarm() {
      debugger
      this.$router.push({ name: 'AlarmHistory' })
    }
  }
}
</script>

<style lang="scss" scoped>
.sheet-main {
  padding: 0 0 20px 0;
  width: 90%;
  margin: 0 auto;
  .tip {
    margin-top: 10px;
  }
  .time {
    color: #fff;
    font-size: 16px;
  }
  .link {
    font-weight: bold;
    color: #fff;
    font-size: 16px;
    margin-left: 20px;
    cursor: pointer;
    &:hover {
      color: $selfColor;
    }
  }
  .cells {
    display: flex;
    flex-wrap: wrap;
    margin-top: 40px;
    .cell {
      position: relative;
      width: 25%;
      @include flex(center, flex-start);
      flex-direction: column;

      margin-bottom: 20px;
      &:not(:nth-child(4n-3)) {
        &::before {
          position: absolute;
          left: -25px;
          top: 50%;
          transform: translateY(-45%);
          content: '';
          height: 75%;
          width: 1px;
          background: $selfColor;
          opacity: 0.3;
        }
      }

      .num {
        font-size: 44px;
        color: #fff;
        &.red {
          color: $err;
        }
        &.blue {
          color: $selfColor;
        }
        &.yellow {
          color: $yl;
        }
      }
      .text {
        color: #fff;
        font-size: 16px;
      }
    }
  }
}
</style>
