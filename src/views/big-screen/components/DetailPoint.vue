<template>
  <div>
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
              :title="point.name"
              width="200"
              trigger="hover"
              :close-delay="50"
            >

              <div
                class="cell-tips-box"
                :class="statusClass(point.value,k)"
              >当前温度：<span class="cur-num">{{ point.value }}℃</span></div>
              <div
                slot="reference"
                :ref="`top${i}${j}${k}`"
                class="point"
                :class="{'point-small':k === 1,red: point.value > max,yellow:point.value > min&& point.value <max,}"
                @click="selectPoint(point.id,i,j,k)"
                @mouseenter="pointStatus(i,j,k,1)"
                @mouseleave="pointStatus(i,j,k)"
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
              :title="point.name"
              width="200"
              trigger="hover"
              :close-delay="50"
            >

              <div
                class="cell-tips-box"
                :class="statusClass(point.value,k)"
              >当前温度：<span class="cur-num">{{ point.value }}℃</span></div>
              <div
                slot="reference"
                :ref="`bottom${i}${j}${k}`"
                class="point"
                :class="{'point-small':k === 1,red: point.value > max,yellow:point.value > min&& point.value <max,}"
                @click="selectPoint(point.id,i,j,k)"
                @mouseenter="pointStatus(i,j,k,1)"
                @mouseleave="pointStatus(i,j,k)"
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
export default {
  name: 'DetailPoint',
  filters: {
    formatNum(n) {
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
      pointActive: false,
      pointIndex: -1,
      cellIndex: -1
    }
  },
  computed: {
    cellWidth() {
      const num = 100 / this.list[0].arr.length
      return {
        '--width': `calc(100% / ${num})`
        // '--width': `54px`
      }
    }
  },
  methods: {
    selectPoint(id, i, j, k) {
      const str1 = `top${i}${j}${k}`
      const str2 = `bottom${i}${j}${k}`
      const otherDom = document.querySelectorAll('.point.active') // 存在高亮时
      if (otherDom.length > 0) {
        otherDom[0].classList.remove('active')
        otherDom[1].classList.remove('active')
      }
      this.$refs[str1][0].classList.add('active')
      this.$refs[str2][0].classList.add('active')
    },
    // tips
    statusClass(val, n) {
      let result = ''

      if (val > this.min && val < this.max) {
        result = 'yellow'
      } else if (val > this.max) {
        result = 'red'
      }
      if (n === 1) {
        result += ' point-small'
      }
      return result
    },
    pointStatus(i, j, k, flag) {
      // flag ture鼠标进入
      const str1 = `top${i}${j}${k}`
      const str2 = `bottom${i}${j}${k}`
      if (flag) {
        this.$refs[str1][0].classList.add('hover')
        this.$refs[str2][0].classList.add('hover')
      } else {
        this.$refs[str1][0].classList.remove('hover')
        this.$refs[str2][0].classList.remove('hover')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
body {
  ::v-deep .el-popover {
    background: #000 !important;
  }
}

.cell-tips-box {
  font-weight: bold;
  font-size: 20px;
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

