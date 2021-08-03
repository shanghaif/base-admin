<template>
  <div
    id="module"
    class="module"
  >
    <div class="title">电解槽点位详情
      <div class="sub">{{ alarmItem.Company }} / {{ alarmItem.Factory }} / {{ alarmItem.Area }} /
        {{ alarmItem.Bath }}</div>
    </div>
    <div
      v-for="(bath,i) of list"
      :key="(i + 'a')"
      class="bath"
    >
      <div class="bath-name">{{ i | NumToLetter }}</div>
      <div
        v-for="(part, index) of ['top', 'bottom']"
        :key="index"
        :class="'bath-' + part"
      >
        <div
          v-for="(group, j) of bath.arr"
          :key="'group' + j"
          class="point-group"
        >

          <div
            v-for="(point, k) of group.pointList"
            :key="'point' + k"
            class="point"
            :class="pointClass(point,k)"
            @click="selectPoint(point)"
            @mouseenter="pointStatus(point,1)"
            @mouseleave="pointStatus(point)"
          >

            <div
              v-if="index === 1"
              v-show="hoverActive === point.tid"
              class="pop"
            >
              <div class="pop-name">{{ point.s_name }}</div>
              <div class="pop-status">告警状态:
                <p :class="pointTextClass(point)">
                  {{ point.alarm_type && point.alarm_type[0] | typeText }}</p>
              </div>
              <div class="pop-temp">当前温度:
                <p :class="pointTextClass(point)"> {{ point.value }}</p>
              </div>
              <div class="pop-arrow" />
            </div>
          </div>

          <div
            v-if="index === 1"
            class="group-num"
          >{{ j | formatNum }}</div>
        </div>
      </div>
      <!-- <div class="cell-indexs">
        <div
          v-for="(groupB, n) of bath.arr"
          :key="'group_index' + n"
          class="cell-index"
          :style="cellWidth"
        >

          {{ n | formatNum }}
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'
export default {
  name: 'Bath',
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
      } else {
        res = '正常'
      }
      return res
    },
    formatNum(i) {
      const n = i + 1
      let str = ''
      if (n < 10) {
        str = `0${n}`
      } else {
        str = n
      }
      return str
    },
    NumToLetter(n) {
      let str = ''
      if (n === 0) {
        str = 'A'
      } else if (n === 1) {
        str = 'B'
      } else if (n === 2) {
        str = 'C'
      }
      return str
    }
  },
  props: {
    list: {
      type: Array,
      default() {
        return [{ arr: [] }]
      }
    }
  },
  data() {
    return {
      bathList: ['A', 'B'],
      pointGroup: ['normal', 'small', 'normal'],
      pointData: [],
      pointTotal: 168,
      company: '云南分公司',
      factory: '电解铝二厂',
      area: '二分区',
      // bath: '电解槽2001'
      tipShow: false,
      classStr: '',
      clickActive: '',
      hoverActive: '',
      pointIndex: -1,
      cellIndex: -1
    }
  },
  // mounted() {},
  computed: {
    ...mapState({
      alarmItem: (state) => state.station.alarmItem,
      currentPoint: (state) => state.station.currentPoint
    }),
    cellWidth() {
      const num = 100 / this.list[0].arr.length
      const pct = num.toFixed(2) + '%'
      return {
        // '--width': `calc(100% / ${num})`
        '--width': pct
      }
    }
  },
  watch: {
    list: {
      handler(newName, oldName) {
        this.clickActive = this.alarmItem.t_id
      },
      deep: true
    },
    alarmItem: {
      handler(newName, oldName) {
        this.clickActive = newName.t_id
        // let point =
      },
      deep: true
    }
  },
  mounted() {},
  methods: {
    ...mapMutations({
      SET_ALARMITEM: 'station/SET_ALARMITEM',
      SET_POINT: 'station/SET_POINT'
    }),
    pointTextClass(point) {
      let res = ''
      const val = point.alarm_type && point.alarm_type[0]

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
    pointClass(point, k) {
      return {
        small: k === 1,
        none: point.empty,
        null: !point.alarm_type,
        red:
          (point.alarm_type && point.alarm_type[0] === 'temperature_high') ||
          (point.alarm_type && point.alarm_type[0] === 'abnormal'),
        wram: point.alarm_type && point.alarm_type[0] === 'rate_high',
        offline: point.alarm_type && point.alarm_type[0] === 'offline',
        active: this.clickActive === point.tid,
        hover: this.hoverActive === point.tid
      }
    },
    selectPoint(point) {
      if (point.empty) {
        return
      }
      const id = point.tid
      this.clickActive = id
      this.$emit('pointClick', point)
    },
    pointStatus(point, flag) {
      // flag ture鼠标进入
      if (point.empty) {
        return
      }
      const id = point.tid
      if (flag) {
        this.hoverActive = id
      } else {
        this.hoverActive = ''
      }
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
#module {
  height: 100%;
  width: 100%;
}
.module {
}
.title {
  display: flex;
  gap: 14px;
  align-items: flex-end;
  font-size: 24px;
  font-weight: 800;
  color: var(--theme);
  .sub {
    font-size: 16px;
    color: #fff;
  }
}

.bath {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 0 30px 30px 60px;
  margin: auto 0 0 0;
  transform-style: preserve-3d;
  perspective: 1000px;

  &-name {
    position: absolute;
    top: calc(50% - 10px);
    left: 10px;
    font-size: 20px;
    font-family: 'DIN';
  }

  &-top {
    display: flex;
    gap: 8px;
    padding: 4px 4px 0 4px;
    margin: 0 auto;
    height: 38px;
    width: 100%;
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.2);

    transform-style: preserve-3d;
    perspective: 1000px;
    transform-origin: bottom center 20px;
    transform: rotateX(20deg) translateZ(20px);
    .point {
      opacity: 0.6;
      border-style: solid solid none solid;
    }
    .small {
      margin: 7px 0 0 0;
      max-height: calc(100% - 7px);
    }
  }

  &-bottom {
    display: flex;
    gap: 8px;
    padding: 0 4px 4px 4px;
    margin: 0px auto;
    height: 22px;
    width: 100%;
    box-shadow: 0 1px 0 1px rgba(255, 255, 255, 0.3);
    transform: translateZ(20px);
    .point {
      border-style: none solid solid solid;
    }
    .small {
      margin: 0 0 5px 0;
      max-height: calc(100% - 5px);
    }
  }
  .point-group {
    position: relative;
    display: flex;
    gap: 6%;
    padding: 0 2px;
    height: 100%;
    width: calc(100% / 28);
    .point {
      position: relative;
      height: 100%;
      width: 30%;
      border-color: rgba(255, 255, 255, 0.08);
      border-width: 1px;
      background: rgba(255, 255, 255, 0.08);
      cursor: pointer;
      &.active {
        border-color: var(--theme) !important;
        border-width: 2px !important;
        background: var(--theme-50) !important;
      }
      &.hover {
        border-color: var(--theme) !important;
        border-width: 2px !important;
        background: var(--theme-50) !important;
      }
      &.null {
        border-color: rgba(255, 255, 255, 0.2);
        border-width: 1px;
        background: rgba(255, 255, 255, 0.2);
      }
      &.none {
        border-color: rgba(255, 255, 255, 0.08);
        border-width: 1px;
        background: rgba(255, 255, 255, 0.08);
        cursor: default;
      }
      &.offline {
        border-color: var(--alarmA);
        border-width: 1.8px;
        background: var(--alarmA-40);
      }
      &.wram {
        border-color: var(--alarmC);
        border-width: 2px;
        background: var(--alarmC-50);
      }
      &.red {
        border-color: var(--alarmB);
        border-width: 2px;
        background: var(--alarmB-50);
      }
    }
    .group-num {
      position: absolute;
      // left: calc(50% - 20px);
      bottom: -32px;
      width: 100%;
      font-size: 20px;
      font-family: 'DIN';
      text-align: center;
    }
  }
}

.pop {
  position: absolute;
  padding: 14px;
  top: -134px;
  left: calc(50% - 88px);
  width: 180px;
  border-radius: 4px;
  background: rgba(50, 50, 50, 0.85);
  box-shadow: 0 20px 10px -20px rgba(0, 0, 0, 0.6);
  z-index: 10;
  &-arrow {
    position: absolute;
    left: 82px;
    bottom: -7px;
    height: 14px;
    width: 14px;
    background: linear-gradient(
      45deg,
      rgba(50, 50, 50, 0.85) 50%,
      transparent 50%
    );
    transform: rotate(-45deg);
  }
  &-name {
    margin-bottom: 12px;
  }
  &-status,
  &-temp {
    display: flex;
    gap: 6px;
    margin-top: 8px;
    // font-size: 18px;
    color: rgba(255, 255, 255, 0.7);
    p {
      display: flex;
      // font-size: 18px;
      font-weight: 800;
      font-family: 'DIN', 'PingFang SC', 'Microsoft Yahei', sans-serif;
    }
  }
  &-temp > p:after {
    display: inline-block;
    content: '°C';
    font-size: 12px;
    margin: 0 auto auto 0;
  }
  .null-text {
    color: var(--theme);
  }
  .offline-text {
    color: var(--alarmA);
  }
  .wram-text {
    color: var(--alarmC);
  }
  .red-text {
    color: var(--alarmB);
  }
}
.cell-indexs {
  width: 100%;
  @include flex(flex-start, center);
  margin-bottom: 10px;
  .cell-index {
    @include flex(center, center);
    margin-top: 10px;
    font-size: 16px;
    width: var(--width);
  }
}
</style>
