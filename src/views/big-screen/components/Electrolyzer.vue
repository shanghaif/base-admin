<template>
  <div>
    <!-- <div v-for="(item,i) in list" :key="(i + 'a')" class="electrolyzer-wrap" :class="className(item) + (curCell === item.id ? ' active' : '')" @click="checkCell(item)"> -->
    <div
      class="electrolyzer-wrap"
      :class="className(source) + (curCell === source.id ? ' active' : '')"
      @click="checkCell(source)"
    >
      <div class="left">
        <img
          :src="imgObj[className(source)]"
          class="electrolyzer-img"
          alt="图片"
        >
      </div>
      <div class="right">
        <div class="cell-name">{{ source.name }}</div>
        <div class="cell-types">
          <div class="cell-type">
            <div class="num def">{{ source.dot }}</div>
            <div class="num-text">总点位数</div>
          </div>
          <div class="cell-type">
            <div
              class="num"
              :class="{ red: source.trendDot > 0 }"
            >
              {{ source.temperatureDot }}
            </div>
            <div class="num-text">温度告警</div>
          </div>
          <div class="cell-type">
            <div
              class="num"
              :class="{ red: source.trendDot > 0 }"
            >
              {{ source.trendDot }}
            </div>
            <div class="num-text">趋势告警</div>
          </div>
          <div class="cell-type">
            <div
              class="num"
              :class="{ yellow: source.unusualDot > 0 }"
            >
              {{ source.unusualDot }}
            </div>
            <div class="num-text">异常点位</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import grayImg from '@/assets/images/cell.png'
import activeImg from '@/assets/images/cell_selected.png'
import redImg from '@/assets/images/cell_warning.png'
import yellowImg from '@/assets/images/cell_yellow.png'

function createData(len) {
  const arr = []
  while (len--) {
    const obj = {
      id: len,
      name: `电解槽${len}`,
      type: 'warning',
      dot: 168,
      temperatureDot: 6,
      trendDot: 2,
      unusualDot: 1
    }
    arr.push(obj)
  }
  return arr
}

export default {
  name: 'Electrolyzer',

  props: {
    source: {
      type: Object,
      default() {
        return {}
      }
    },
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      imgObj: {
        yellow: yellowImg,
        warning: redImg,
        def: grayImg
      },
      imgUrl: null,
      grayImg,
      activeImg,
      redImg,
      yellowImg,
      curCell: '10000',
      textObj: {
        dot: '总点位数',
        temperatureDot: '温度告警',
        trendDot: '趋势告警',
        unusualDot: '异常点位'
      },
      // list1: [
      //   { id: '10000', name: '电解槽1', type: 'warning', dot: 168, temperatureDot: 6, trendDot: 2, unusualDot: 1 },
      //   { id: '10001', name: '电解槽2', type: 'defual', dot: 168, temperatureDot: 6, trendDot: 2, unusualDot: 1 },
      //   { id: '10002', name: '电解槽3', type: 'warning', dot: 168, temperatureDot: 6, trendDot: 2, unusualDot: 1 },
      //   { id: '10003', name: '电解槽4', type: 'off', dot: 168, temperatureDot: 0, trendDot: 0, unusualDot: 1 },
      //   { id: '10004', name: '电解槽5', type: 'off', dot: 168, temperatureDot: 0, trendDot: 0, unusualDot: 0 }
      // ]
      list1: createData(4)
    }
  },
  computed: {},
  watch: {},

  methods: {
    className(item) {
      let classname = ''

      const red = (item.temperatureDot || item.trendDot) > 0
      const yellow = item.unusualDot > 0
      if (red) {
        classname = 'warning'
      } else if (yellow) {
        classname = 'yellow'
      } else {
        classname = 'def'
      }
      return classname
    },
    checkCell(item) {
      this.curCell = item.id
    }
  }
}
</script>

<style lang="scss" scoped>
.electrolyzer-wrap {
  @include flex(flex-start, center);
  background: rgba(255, 255, 255, 0.1);
  height: 80px;
  padding: 8px 10px;
  margin-bottom: 10px;
  .left {
    width: 80px;
    height: 54px;
    margin-right: 15px;
    .electrolyzer-img {
      height: 100%;
      width: 100%;
    }
  }
  .right {
    flex: 1;
    @include flex(space-between, flex-start);
    flex-direction: column;
    height: 100%;
    .cell-name {
      font-size: 14px;
    }
    .cell-types {
      width: 100%;
      @include flex(flex-start, center);
      .cell-type {
        @include flex(space-between, flex-start);
        flex-direction: column;
        width: 25%;
        .num {
          font-size: 16px;
          line-height: 28px;
          color: #67c23a;
          &.red {
            color: $err;
          }
          &.def {
            color: $defaultColor;
          }
          &.yellow {
            color: $yl;
          }
        }
        .num-text {
          color: #fff;
          font-size: 10px;
        }
      }
    }
  }

  &.active {
    background: rgba(24, 186, 215, 0.3) !important;
    border: 1px solid $defaultColor !important;

    .left {
      .electrolyzer-img {
      }
    }
    .right {
      .cell-name {
        color: $defaultColor !important;
      }
      .cell-types {
        .cell-type {
          .num {
          }
          .num-text {
          }
        }
      }
    }
  }
  &.warning {
    background: linear-gradient(90deg, rgba(255, 47, 20, 0.3) 100%);
    border: 1px solid $err;
    .left {
      .electrolyzer-img {
      }
    }
    .right {
      .cell-name {
        color: $err;
      }
      .cell-types {
        .cell-type {
          .num {
          }
          .num-text {
          }
        }
      }
    }
  }
  &.yellow {
    background: linear-gradient(90deg, rgba(237, 168, 46, 0.3) 100%);
    border: 1px solid $yl;
    .left {
      .electrolyzer-img {
      }
    }
    .right {
      .cell-name {
        color: $yl;
      }
      .cell-types {
        .cell-type {
          .num {
          }
          .num-text {
          }
        }
      }
    }
  }
}
</style>
