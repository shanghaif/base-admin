<template>
  <div>
    <div
      v-for="(source,i) in list"
      :key="(i + 'a')"
      class="electrolyzer-wrap"
      :class="className(source) + (curCell === source.id ? ' active' : '')"
      @click="checkCell(source)"
    >
      <!-- <div
      class="electrolyzer-wrap"
      :class="className(source) + (curCell === source.id ? ' active' : '')"
      @click="checkCell(source)"
    > -->
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
    // source: {
    //   type: Object,
    //   default() {
    //     return {}
    //   }
    // },
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
      }
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
  color: #fff;

  @include flex(flex-start, center);
  background: rgba(255, 255, 255, 0.1);
  height: 80px;
  padding: 8px 10px;
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
  &:hover {
    background: linear-gradient(
      90deg,
      rgba(24, 186, 215, 0),
      rgba(24, 186, 215, 0.3)
    ) !important;
  }
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
      color: #fff;
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
          // color: #67c23a;
          color: #fff;
          &.red {
            color: $err;
          }
          &.def {
            color: $selfColor;
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
    // background: rgba(24, 186, 215, 0.3) !important;
    background: linear-gradient(
      90deg,
      rgba(24, 186, 215, 0),
      rgba(24, 186, 215, 0.3)
    ) !important;
    border: 1px solid $selfColor !important;

    .left {
      .electrolyzer-img {
      }
    }
    .right {
      .cell-name {
        color: $selfColor !important;
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
    background: linear-gradient(
      90deg,
      rgba(255, 47, 20, 0),
      rgba(255, 47, 20, 0.3)
    );
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
            color: $err;
          }
          .num-text {
          }
        }
      }
    }
  }
  &.yellow {
    background: linear-gradient(
      90deg,
      rgba(237, 168, 46, 0),
      rgba(237, 168, 46, 0.3)
    );
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
