<template>
  <div class="detail-wrap">
    <div class="wrap">
      <div class="content">
        <div class="content-top">
          <div class="detail-item detail-item-left">
            <div
              class="content-back"
              @click="goBack"
            ><i class="el-icon-arrow-left" />返回首页</div>
            <div class="chart-box-title">电解槽总览</div>
            <div class="content-crumbs">
              <div class="content-crumb">xx分公司</div>
              <div class="content-crumb">电解铝二厂</div>
              <div class="content-crumb">一分区</div>
            </div>
            <div class="content-filter">
              <div class="content-select">
                <el-select
                  v-model="selectType"
                  placeholder="请选择"
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
                  :remote-method="remoteMethod"
                  :loading="loading"
                  class="screen-select"
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
            <div class="detail-cells">
              <el-scrollbar wrap-class="detail-cells">
                <electrolyzer
                  :list="list"
                  @result="clickCell"
                />
              </el-scrollbar>
            </div>

          </div>
          <div class="detail-item detail-item-center">
            <Header />

            <detail-line-chart id="detail_line_r" />

          </div>
          <div class="detail-item detail-item-right">
            <div>

              <div class="chart-box-title">测温点详情</div>
              <div class="content-crumbs">
                <div class="content-crumb">{{ currentCell.tid }}</div>
                <div class="content-crumb">A12_LEFT</div>
              </div>
            </div>
            <div class="right-bar-box">
              <div class="right-bar-items">
                <div class="right-bar-item">
                  <div class="status-text">

                    <div>
                      <span>告警信息：
                        <span class="err">温度过高</span>
                      </span>
                    </div>
                    <div>
                      <span>运行状态:
                        <span class="success">正常</span>
                      </span>
                    </div>
                  </div>

                </div>
                <div
                  class="right-bar-item"
                  :class="{hight:nowPct > basePct } "
                >
                  <div>当前温度</div>
                  <div class="bar-item-content">
                    <el-progress
                      :percentage="nowPct"
                      :stroke-width="16"
                    />
                    <div class="num">{{ temperatureObj.now }}℃</div>
                  </div>

                </div>
                <div
                  class="right-bar-item"
                  :class="{hight:averagePct > basePct } "
                >
                  <div>平均温度</div>
                  <div class="bar-item-content">
                    <el-progress
                      :percentage="averagePct"
                      :stroke-width="16"
                    />
                    <div class="num low">{{ averageTemperature }}℃</div>
                  </div>

                </div>
                <div
                  class="right-bar-item"
                  :class="{hight:hightPct > basePct } "
                >
                  <div>最高温度</div>
                  <div class="bar-item-content">
                    <el-progress
                      :percentage="hightPct"
                      :stroke-width="16"
                    />
                    <div class="num">{{ temperatureObj.hight }}℃</div>
                  </div>

                </div>
                <div
                  class="right-bar-item"
                  :class="{hight:lowPct > basePct } "
                >
                  <div>最低温度</div>
                  <div class="bar-item-content">
                    <el-progress
                      :percentage="lowPct"
                      :stroke-width="16"
                    />
                    <div class="num low">{{ temperatureObj.low }}℃</div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="content-bottom">
          <div class="content-bottom-title">

            <div class="chart-box-title">电解槽详情</div>

            <div class="content-crumbs">
              <div class="content-crumb">云南分公司</div>
              <div class="content-crumb">电解铝二厂</div>
              <div class="content-crumb">一分区</div>
              <div class="content-crumb">电解槽2021</div>
            </div>
          </div>
          <div class="point-wrap">

            <detail-point
              :list="pointList"
              :min="unusualVal"
              :max="warningVal"
            />
          </div>

        </div>
      </div>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="centerDialogVisible"
      width="38%"
      center
    >
      <div class="wran-alert-body">
        <!-- <svg-icon icon-class="warning" /> -->
        <svg-icon icon-class="abnormal" />
        <div class="wran-alert-body-content">
          <div class="content-crumbs">
            <div class="content-crumb">云南分公司</div>
            <div class="content-crumb">电解铝二厂</div>
            <div class="content-crumb">一分区</div>
            <div class="content-crumb">电解槽2021</div>
          </div>
          <div class="wran-alert-reason-box">

            <span class="wran-alert-reason un">温度过高</span>
            <span class="now-text">当前温度,</span>
            <span class="err temp-num">200.5℃</span>
          </div>
        </div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="detail-ok-btn"
          @click="centerDialogVisible = false"
        >查看点位</el-button>
        <el-button
          class="detail-cancel-btn"
          @click="centerDialogVisible = false"
        >取消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

 
<script>
import Electrolyzer from './components/Electrolyzer'
import DetailLineChart from './components/DetailLineChart'
import Header from './components/Header'
import DetailPoint from './components/DetailPoint'

import _map from 'lodash/map'
import { devicePoint } from '@/api/station'
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'

function createData(len) {
  const arr = []
  while (len--) {
    let type = 'warning'
    if (len % 2 === 0) {
      type = 'error'
    }
    const obj = {
      id: len,
      name: `电解槽${len}`,
      type,
      dot: 168,
      temperatureDot: 1,
      trendDot: 0,
      unusualDot: 0
    }
    arr.push(obj)
  }
  return arr
}
function createCellList(len) {
  const arr = []
  const obj = {}
  const i = 3
  while (len--) {
    const innerArr = []
    const num = len
    for (let i = 0; i < 3; i++) {
      const innerObj = {}
      innerObj.id = `${len}_${i}LEFT`
      innerObj.name = `${len}_${i}LEFT`
      innerObj.value = i * 110
      innerArr.push(innerObj)
    }
    obj.pointList = innerArr
    arr.push(obj)
  }
  return arr
}
export default {
  name: 'Detail',
  components: {
    Electrolyzer,
    Header,
    DetailPoint,
    DetailLineChart
  },

  data() {
    return {
      centerDialogVisible: false,
      baseTemperature: 1500,
      basePct: 50,

      updateTime: this.$dayjs().format('YYYY/MM/DD hh:mm:ss'),
      pointList: [{ arr: createCellList(39) }, { arr: createCellList(30) }],

      cellTypeOptions: [
        { value: 'defual', label: '温度告警' },
        { value: 'warning', label: '趋势告警' },
        { value: 'yellow', label: '异常点位' }
      ],
      cellFreshTimeOptions: [
        { value: '10秒', label: '10秒' },
        { value: '30秒', label: '30秒' },
        { value: '1分钟', label: '1分钟' },
        { value: '5分钟', label: '5分钟' },
        { value: '10分钟', label: '10分钟' }
      ],

      searchOptions: [],
      list1: [
        {
          id: '10000',
          name: '电解槽1',
          type: 'warning',
          dot: 168,
          temperatureDot: 6,
          trendDot: 2,
          unusualDot: 1
        },
        {
          id: '10001',
          name: '电解槽2',
          type: 'defual',
          dot: 168,
          temperatureDot: 6,
          trendDot: 2,
          unusualDot: 1
        },
        {
          id: '10002',
          name: '电解槽3',
          type: 'warning',
          dot: 168,
          temperatureDot: 6,
          trendDot: 2,
          unusualDot: 1
        },
        {
          id: '10003',
          name: '电解槽4',
          type: 'off',
          dot: 168,
          temperatureDot: 0,
          trendDot: 0,
          unusualDot: 1
        },
        {
          id: '10004',
          name: '电解槽5',
          type: 'off',
          dot: 168,
          temperatureDot: 0,
          trendDot: 0,
          unusualDot: 0
        }
      ],
      list: [
        {
          id: '10000',
          name: '电解槽1',
          type: 'yellow',
          dot: 168,
          temperatureDot: 0,
          trendDot: 0,
          unusualDot: 1
        },
        {
          id: '10001',
          name: '电解槽2',
          type: 'defual',
          dot: 168,
          temperatureDot: 6,
          trendDot: 0,
          unusualDot: 1
        },
        {
          id: '10002',
          name: '电解槽3',
          type: 'warning',
          dot: 168,
          temperatureDot: 0,
          trendDot: 2,
          unusualDot: 0
        }
      ],
      selectType: '',
      selectFreshTime: '',
      selectTime: '',
      searchCell: '',
      loading: false,
      cacheList: []
      // list: createData(10)
    }
  },
  computed: {
    ...mapGetters(['warningVal', 'unusualVal']),
    ...mapState({
      currentCell: (state) => state.station.currentCell
    }),
    averageTemperature() {
      let sum = 0
      for (const key in this.temperatureObj) {
        sum += this.temperatureObj[key]
      }
      return sum / 3
    },
    averagePct() {
      return (this.averageTemperature * 100) / this.baseTemperature
    },
    nowPct() {
      return (this.temperatureObj.now * 100) / this.baseTemperature
    },
    hightPct() {
      return (this.temperatureObj.hight * 100) / this.baseTemperature
    },
    lowPct() {
      return (this.temperatureObj.low * 100) / this.baseTemperature
    },
    temperatureObj() {
      const obj = {}
      obj.hight = 1000
      obj.low = 300
      obj.now = 800
      return obj
    }
  },
  created() {
    this.query()
  },
  mounted() {
    this.cacheList = this.list
    this.searchOptions = _map(this.list, 'name').map((item) => {
      return { value: `${item}`, label: `${item}` }
    })
  },
  destroyed() {},
  methods: {
    ...mapMutations({
      SET_CELL: 'station/SET_CELL'
    }),
    clickCell(item) {
      console.log(item)
      this.currentCell = Object.assign({}, item)
    },
    async query() {
      try {
        const res = await devicePoint(this.currentCell.uid)
        const { data } = res.data.result
        debugger
      } catch (err) {
        alert('设备请求错误')
      }
    },
    customColorMethod(percentage) {
      console.log(percentage)
      if (percentage > 50) {
        return '#eb540e'
      } else {
        return '#18BAD7'
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
    getType(type) {
      console.log('type :>> ', type)
      this.list = this.cacheList.filter((v) => {
        return v.type === type
      })
    },
    getSearch(val) {
      if (!val) {
        this.list = this.cacheList
      } else {
        this.list = this.cacheList.filter((v) => {
          return v.name === val
        })
      }
    },
    goBack() {
      this.$router.push({ path: '/big-screen' })
    }
  }
}
</script>
<style lang="scss" scoped>
$top-Height: 10vh;
::v-deep .el-dialog__wrapper {
  .el-dialog {
    box-shadow: 0px 0px 27px 3px rgba(255, 47, 20, 0.5);
    background: rgba(29, 29, 29, 0.9);
    .el-dialog__header {
      .el-dialog__title {
        color: #fff;
        font-size: 18px;
        line-height: 1;
      }
      .el-dialog__headerbtn {
        display: none;
      }
    }
    .el-dialog__body {
      color: #fff;
      .wran-alert-body {
        @include flex(flex-start, center);
        .wran-alert-body-content {
          margin-left: 20px;
          .wran-alert-reason-box {
            margin-top: 20px;
            font-size: 18px;
            .wran-alert-reason {
              color: $err;
              font-weight: bold;
              &.un {
                color: $yl;
              }
            }
            .now-text {
              margin: 0 10px;
            }
            .temp-num {
              &.err {
                color: $err;
                font-weight: bold;
              }
            }
          }
        }
        .svg-icon {
          width: 120px;
          height: 120px;
        }
      }
    }
    .el-dialog__footer {
      .detail-ok-btn {
        background: $selfColor;
        color: #fff;
        border: 0;
      }
      .detail-cancel-btn {
        color: #fff;
        background: rgba(255, 255, 255, 0.2);
        border: 0;
        margin-left: 40px;
      }
    }
  }
}

.detail-wrap {
  height: 100%;
  color: #fff;
  background-image: url('~@/assets/images/bg.jpg');
  overflow: hidden;

  .content {
    width: 96%;
    height: 100vh;
    // display: flex;
    margin: 0 auto;
    position: relative;
    .content-top {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: calc(100% - 300px);
      @include flex(space-between, center);
      padding-top: 30px;
      .detail-item {
        height: 100%;
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
        &.detail-item-left {
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
            height: 70%;
            padding: 15px;
            background: rgba(255, 255, 255, 0.04);
          }
        }
        &.detail-item-center {
          @include flex(space-between, flex-start);
          flex-direction: column;
          flex: 1;
          margin: 0 20px;
        }
        &.detail-item-right {
          @include flex(space-between, flex-start);
          flex-direction: column;
          width: 360px;
          font-size: 14px;
          padding-top: 44px;

          .right-bar-box {
            width: 100%;
            // height: 484px;
            flex: 1;

            background: rgba(255, 255, 255, 0.04);
            padding: 20px;
            overflow: auto;
            .right-bar-items {
              .right-bar-item {
                @include flex(space-between, flex-start);
                flex-direction: column;
                padding: 15px;
                margin-bottom: 10px;
                background: rgba(255, 255, 255, 0.05);
                // height: 84px;
                height: 16%;
                &:first-child {
                  // height: 68px;
                  height: 14%;
                }
                &.hight {
                  .bar-item-content {
                    ::v-deep .el-progress {
                      .el-progress-bar {
                        .el-progress-bar__outer {
                          .el-progress-bar__inner {
                            background: linear-gradient(
                              90deg,
                              rgba(225, 90, 12, 1),
                              rgba(254, 48, 20, 1)
                            ) !important;
                          }
                        }
                      }
                      .el-progress__text {
                        display: none;
                      }
                    }
                    .num {
                      color: $err;
                      background: linear-gradient(90deg, $err 0%, $err 100%);
                      -webkit-background-clip: text;
                      -webkit-text-fill-color: transparent;
                    }
                  }
                }
                .status-text {
                  line-height: 20px;
                  .err {
                    color: $err;
                  }
                  .success {
                    color: $selfColor;
                  }
                }
                .bar-item-content {
                  width: 100%;
                  margin-top: 15px;
                  position: relative;
                  @include flex(flex-start, center);

                  ::v-deep .el-progress {
                    width: 190px;
                    .el-progress-bar {
                      padding-right: 0;
                      .el-progress-bar__outer {
                        background: rgba($color: #000000, $alpha: 0.4);
                        .el-progress-bar__inner {
                          height: calc(100% - 6px);
                          max-width: calc(100% - 6px) !important;
                          top: 50%;
                          transform: translateY(-50%);
                          left: 3px;
                          background: linear-gradient(
                            90deg,
                            rgba(24, 186, 215, 1),
                            rgba(24, 186, 215, 0.8)
                          ) !important;
                        }
                      }
                    }
                    .el-progress__text {
                      display: none;
                    }
                  }
                  .num {
                    font-size: 20px;
                    font-weight: bold;
                    margin-left: 25px;
                    // transform: translateY(-50%);

                    color: $selfColor;
                    background: linear-gradient(
                      90deg,
                      #067dc2 0%,
                      $selfColor 100%
                    );
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                  }
                }
              }
            }
          }
        }
      }
    }
    .content-bottom {
      height: 250px;
      width: 100%;
      position: absolute;
      left: 0;
      bottom: 20px;
      .content-bottom-title {
        @include flex(flex-start, center);
        margin-bottom: 15px;
        .chart-box-title {
          margin-right: 20px;
        }
      }
      .point-wrap {
        background: rgba(255, 255, 255, 0.04);
        height: 220px;
        padding: 20px 30px 20px 20px;
        .line-point-item {
          @include flex(flex-start, center);
          height: 56px;
          width: 100%;
          .code {
            width: 50px;
            font-size: 32px;
          }
          .point-lists {
            @include flex(flex-start, center);

            height: 100%;

            flex: 1;
            .left {
              height: 100%;
              width: 16px;
              background-image: url('~@/assets/images/cell_corner.png');
            }
            .center {
              flex: 1;
              height: 100%;

              background-image: url('~@/assets/images/cell_middle.png');
            }
            .right {
              height: 100%;
              width: 16px;
              background-image: url('~@/assets/images/cell_corner.png');
              transform: scaleX(-1);
            }
            .point-list {
              height: 100%;
              .square-box-point {
                width: 200px;
                height: 100px;
                box-sizing: border-box;
                position: relative;
                transform-style: preserve-3d;
                transform: rotateX(-30deg) rotateY(-10deg) rotateZ(0deg);
                // &.min {
                //   transform: scale(0.7);
                // }
                position: absolute;
                /*设置六面的视角*/
                &.front {
                  width: 12px;
                  height: 18px;
                  transform: translateZ(0px);
                  background: #414447;
                  border: 1px solid #909293;
                }
                &.top {
                  width: 12px;
                  height: 40px;
                  transform: rotateX(90deg) translateZ(20px) translateY(-20px); /* ,translateZ = height/2  translateY -height/2 */
                  background: #414447;
                  border: 1px solid #909293;
                  border-bottom: 0;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
