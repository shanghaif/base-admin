<template>
  <div class="wrap">
    <div class="title">电解槽点位详情
      <div class="sub">{{ alarmItem.Company }} / {{ alarmItem.Factory }} / {{ alarmItem.Area }} /
        {{ alarmItem.Bath }}</div>
    </div>
    <div
      v-for="(item,i) of list"
      :key="(i + 'a')"
      class="line-item"
    >
      <div class="line-index">{{ i | NumToLetter }}</div>
      <div class="cell-demo">
        <div class="cell-top">

          <div
            v-for="(group, j) of item.arr"
            :key="'group' + j"
            class="point-group"
            :style="cellWidth"
          >
            <el-popover
              v-for="(point, k) of group.pointList"
              :key="'point' + k"
              placement="top-start"
              :title="point.tid + ' '"
              trigger="hover"
              width="250"
              :close-delay="50"
            >

              <div
                class="cell-tips-box"
                :class="statusClass(point.alarm_type && point.alarm_type[0],k)"
              >当前温度：
                <span class="cur-num">{{ point.value }}</span>
                <span
                  v-if="point.value > 0"
                  class="cur-num"
                >℃</span>

              </div>
              <div
                slot="reference"
                class="point"
                :class="{'point-small':k === 1,red: point.value > max,yellow:point.value > min&& point.value <max,active:clickActive === point.tid,hover:hoverActive=== point.tid}"
                @click="selectPoint(point)"
                @mouseenter="pointStatus(point,1)"
                @mouseleave="pointStatus(point)"
              />
            </el-popover>

          </div>
        </div>
        <div class="cell-bottom">

          <div
            v-for="(group, j) of item.arr"
            :key="'group' + j"
            class="point-group"
            :style="cellWidth"
          >
            <el-popover
              v-for="(point, k) of group.pointList"
              :key="'point' + k"
              placement="top-start"
              :title="point.tid + ' '"
              width="200"
              trigger="hover"
              :close-delay="50"
            >

              <div
                class="cell-tips-box"
                :class="statusClass(point.alarm_type && point.alarm_type[0],k)"
              >当前温度：<span class="cur-num">{{ point.value }}</span>
                <span
                  v-if="point.value > 0"
                  class="cur-num"
                >℃</span>
              </div>
              <div
                slot="reference"
                class="point"
                :class="{'point-small':k === 1,red: point.value > max,yellow:point.value > min&& point.value <max,active:clickActive === point.tid,hover:hoverActive=== point.tid}"
                @click="selectPoint(point)"
                @mouseenter="pointStatus(point,1)"
                @mouseleave="pointStatus(point)"
              />

            </el-popover>

          </div>
        </div>

        <div class="cell-indexs">
          <div
            v-for="(group, index) of item.arr"
            :key="'group_index' + index"
            class="cell-index"
            :style="cellWidth"
          >

            {{ index | formatNum }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'

export default {
  name: 'DetailPoint',
  filters: {
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
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
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
      alarmItem: (state) => state.station.alarmItem
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
    }
  },
  methods: {
    selectPoint(point) {
      if (point.empty) {
        return
      }
      const id = point.tid
      this.clickActive = id
      this.$emit('pointClick', id)
    },
    // tips
    statusClass(val, n) {
      let res = ''

      if (val === 'temperature_high') {
        res = 'yellow'
      } else if (val === 'offline') {
        res = 'gray'
      } else if (val === 'rate_high') {
        res = 'red'
      } else if (val === 'abnormal') {
        res = 'abnormal'
      }
      if (n === 1) {
        res += ' point-small'
      }
      return res
    },
    pointStatus(point, flag) {
      // flag ture鼠标进入
      // if (point.empty) {
      //   return
      // }
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
.wrap {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 2px;
  background: rgba(0, 0, 0, 0.1);
}
.title {
  display: flex;
  gap: 14px;
  align-items: flex-end;
}
body {
  ::v-deep .el-popover {
    background: #000 !important;
  }
}

.cell-tips-box {
  font-weight: bold;
  font-size: 20px;
  color: #fff;
  &.red {
    .cur-num {
      color: $err;
    }
  }
  &.yellow {
    .cur-num {
      color: $yl;
    }
  }
  .cur-num {
    font-size: 22px;
    color: $selfColor;
  }
}
.line-item {
  @include flex(flex-start, center);

  .line-index {
    @include flex(flex-start, center);
    font-weight: bold;
    font-size: 26px;
    width: 40px;
    height: 88px;
  }
}
.cell-demo {
  display: flex;
  flex: 1;
  flex-direction: column;
  // height: 300px;
  transform-style: preserve-3d;
  perspective: 1000px;
  // background: rgba(40, 40, 40, 1);
  .point-group {
    display: flex;
    padding: 0 2px;
    height: 100%;
    width: var(--width);
    > span {
      width: 30%;
      height: 100%;
      &:nth-child(2) {
        width: 28%;
        height: calc(100% - 7px);
      }
      ::v-deep .el-popover__reference-wrapper {
        width: 100%;
        height: 100%;
        .point {
          height: 100%;
          width: 100%;
          border-left: 1px solid rgba(255, 255, 255, 0.4);
          border-right: 1px solid rgba(255, 255, 255, 0.4);
          &.red {
            border-width: 2px;
            border-color: rgba(255, 47, 20, 1);
            background: rgba(255, 47, 20, 0.4);
          }
          &.yellow {
            border-width: 2px;
            border-color: rgba(237, 168, 46, 1);
            background: rgba(237, 168, 46, 0.4);
          }
          &.active {
            border-width: 2px;

            border-color: rgba(24, 186, 215, 1);
            background: rgba(24, 186, 215, 0.4) !important;
          }
          &.hover {
            border-color: rgba(24, 186, 215, 1);
            background: rgba(24, 186, 215, 0.4) !important;
          }
          &.point-small {
            width: 100%;
          }
        }
      }
    }
  }
  .cell-top {
    display: flex;
    padding: 4px 0 0 0;
    margin: 0 auto;
    height: 38px;
    width: calc(100% - 20px);
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.2);
    transform-origin: bottom center 20px;
    transform: rotateX(20deg) translateZ(20px);
    .point {
      border-top: 1px solid rgba(255, 255, 255, 0.4);

      &.point-small {
      }
    }
    .point-group {
      > span {
        &:nth-child(2) {
          margin: 7px 2px 0 2px;
        }
        ::v-deep .el-popover__reference-wrapper {
          .point {
            &.point-small {
            }
          }
        }
      }
    }
  }

  .cell-bottom {
    display: flex;
    padding: 0 0 4px 0;
    margin: 0px auto;
    height: 22px;
    width: calc(100% - 20px);
    box-shadow: 0 1px 0 1px rgba(255, 255, 255, 0.3);
    transform: translateZ(20px);
    .point {
      border-bottom: 1px solid rgba(255, 255, 255, 0.4);

      &.point-small {
      }
    }

    .point-group {
      > span {
        &:nth-child(2) {
          margin: 0 2px 5px 2px;
        }
        ::v-deep .el-popover__reference-wrapper {
          .point {
            &.point-small {
            }
          }
        }
      }
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
}
</style>

