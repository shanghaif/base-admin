<template>
  <div class="ele-wrap">
    <div class="content-filter">
      <div class="content-select">
        <el-select
          v-model="selectType"
          placeholder="所有状态"
          class="screen-select"
          @change="getType"
        >
          <el-option
            v-for="item in cellTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="content-search">
        <el-select
          v-model="searchCell"
          filterable
          remote
          reserve-keyword
          clearable
          placeholder="请输入关键词"
          class="screen-select"
          :remote-method="remoteMethod"
          @change="getSearch"
        >
          <el-option
            v-for="item in searchOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </div>
    <div
      class="detail-cells"
      :class="{'no-data':list.length < 1}"
    >

      <!-- <el-scrollbar wrap-class="detail-cells"> -->

      <div
        v-for="(source,i) in list"
        :key="(i + 'a')"
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
      <!-- </el-scrollbar> -->
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'
import grayImg from '@/assets/images/cell.png'
import activeImg from '@/assets/images/cell_selected.png'
import redImg from '@/assets/images/cell_warning.png'
import yellowImg from '@/assets/images/cell_yellow.png'
import { cellInfo } from '@/api/station'
// import _map from 'lodash/map'

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
    // list: {
    //   type: Array,
    //   default() {
    //     return []
    //   }
    // }
  },
  data() {
    return {
      list: [],
      searchOptions: [],

      imgObj: {
        yellow: yellowImg,
        warning: redImg,
        def: grayImg
      },
      selectType: 'all',
      selectFreshTime: '',
      selectTime: '',
      searchCell: '',
      loading: false,
      cellTypeOptions: [
        { value: 'all', label: '所有状态' },
        { value: 't', label: '温度告警' },
        { value: 'r', label: '趋势告警' },
        { value: 'u', label: '异常点位' }
      ],
      cacheList: [],
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
  computed: {
    ...mapState({
      alarmItem: (state) => state.station.alarmItem
    })
  },
  watch: {},
  mounted() {
    this.queryCell()
  },

  methods: {
    async queryCell() {
      try {
        // 电解槽
        const cellResult = await cellInfo(this.alarmItem.AreaID, 1)
        const list = cellResult.data.result || []

        this.list = list.map((v) => {
          return {
            ...v,
            ...{
              id: v.bath_id,
              name: v.bath_name,
              type: 'yellow',
              dot: v.point_all,
              temperatureDot: v.point_temperature,
              trendDot: v.point_rate,
              unusualDot: v.point_offline
            }
          }
        })
        this.cacheList = this.list
        this.searchOptions = this.list.map((item) => {
          return { value: `${item.name}`, label: `${item.name}` }
        })
      } catch (err) {
        this.$message('电解槽错误')
      }
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.searchOptions = this.searchOptions.filter((item) => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.options = []
      }
    },
    // 根据状态过滤
    getType(type) {
      if (type === 't') {
        this.list = this.cacheList.filter((v) => v.temperatureDot > 0)
      } else if (type === 'r') {
        this.list = this.cacheList.filter((v) => v.trendDot > 0)
      } else if (type === 'u') {
        this.list = this.cacheList.filter((v) => v.unusualDot > 0)
      } else {
        this.list = this.cacheList
      }
    },
    getSearch(val) {
      debugger
      if (!val) {
        this.list = this.cacheList
      } else {
        this.list = this.cacheList.filter((v) => {
          return v.name === val
        })
      }
    },
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
      this.$emit('clickPoint', item)
    }
  }
}
</script>

<style lang="scss" scoped>
.ele-wrap {
  height: calc(100% - 120px);
}
.content-filter {
  @include flex(flex-start, center);
  width: 100%;
  margin-bottom: 15px;
  .content-select {
    width: 140px;
  }
  .content-search {
    margin-left: 20px;
  }
}
.detail-item-left {
  width: 390px;
  @include flex(space-between, flex-start);
  flex-direction: column;
  ::v-deep .el-scrollbar {
    height: 100%;
  }
  ::v-deep .el-scrollbar__wrap {
    overflow: auto;
  }
  .content-back {
    height: 44px;
    line-height: 44px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
      color: $selfColor;
    }
  }

  .detail-cells {
    width: 100%;
    height: calc(100% - 40px);
    // padding-top: 15px;
    // padding: 15px;
    background: rgba(255, 255, 255, 0.04);
    overflow: auto;
    &.no-data {
      position: relative;
      &::before {
        content: '暂无数据';
        position: absolute;
        // top: -15px;
        margin: 0;
        height: 100%;
        width: 100%;
        @include flex();
        background: rgba(255, 255, 255, 0.1);
        color: #ccc;
      }
    }
  }
}
.electrolyzer-wrap {
  color: #fff;

  @include flex(flex-start, center);
  background: rgba(255, 255, 255, 0.1);
  height: 80px;
  padding: 8px 10px;
  margin-bottom: 10px;
  width: calc(100% - 30px);
  margin-left: auto;
  margin-right: auto;
  &:first-child {
    margin-top: 15px;
  }
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
