<template>
  <div class="detail-wrap">
    <div class="wrap">
      <div class="content">
        <div class="content-top">
          <div class="detail-item detail-item-left">
            <div>

              <div
                class="content-back"
                @click="goBack"
              ><i class="el-icon-arrow-left" />返回首页</div>
              <div class="chart-box-title">电解槽总览</div>
              <div class="content-crumbs">
                <div class="content-crumb">{{ alarmItem.Company }}</div>
                <div class="content-crumb">{{ alarmItem.Factory }}</div>
                <div class="content-crumb">{{ alarmItem.Area }}</div>
              </div>
            </div>

            <electrolyzer
              :list="list"
              @clickPoint="clickPoint"
            />

          </div>
          <div class="detail-item detail-item-center">
            <Header @change="updateRate" />

            <detail-line-chart
              ref="DetailLineChart"
              :list="piontHistoryList"
              @refresh="refresh"
              @changeDate="changeDateQuery"
              @exportPoint="exportPoint"
            />

          </div>
          <div class="detail-item detail-item-right">
            <div>

              <div class="chart-box-title">测温点详情</div>
              <div class="content-crumbs">

                <div class="content-crumb">{{ alarmItem.Bath }}</div>
                <div class="content-crumb">{{ alarmItem.t_id }}</div>
              </div>

            </div>
            <div class="right-bar-box">
              <div class="right-bar-items">
                <div class="right-bar-item">
                  <div class="status-text">

                    <div>
                      <span>告警信息：
                        <span
                          v-if="nowTemp > warningVal"
                          class="err"
                        >温度过高</span>
                        <span v-else>无</span>
                      </span>
                    </div>
                    <div>
                      <span>运行状态:
                        <span class="success">{{ alarmItem.alarm_id | t_type }}</span>
                      </span>
                    </div>
                  </div>

                </div>
                <div
                  class="right-bar-item"
                  :class="{hight:nowTemp > warningVal } "
                >
                  <div>当前温度</div>
                  <div class="bar-item-content">
                    <el-progress
                      :percentage="nowPct"
                      :stroke-width="16"
                    />
                    <div class="num low">
                      <count-to
                        :start-val="0"
                        :end-val="nowTemp"
                        :duration="2000"
                        :decimals="1"
                        suffix="℃"
                        class="card-panel-num"
                      />
                    </div>
                  </div>

                </div>
                <div
                  class="right-bar-item"
                  :class="{hight:averageTemp > warningVal } "
                >
                  <div>平均温度</div>
                  <div class="bar-item-content">
                    <el-progress
                      :percentage="averagePct"
                      :stroke-width="16"
                    />
                    <div class="num low">
                      <count-to
                        :start-val="0"
                        :end-val="averageTemp || 0"
                        :duration="2000"
                        :decimals="1"
                        suffix="℃"
                        class="card-panel-num"
                      />
                    </div>
                  </div>

                </div>
                <div
                  class="right-bar-item"
                  :class="{hight:heigthTemp > warningVal } "
                >
                  <div>最高温度</div>
                  <div class="bar-item-content">
                    <el-progress
                      :percentage="hightPct"
                      :stroke-width="16"
                    />

                    <div class="num low">
                      <count-to
                        :start-val="0"
                        :end-val="heigthTemp || 0"
                        :duration="2000"
                        :decimals="1"
                        suffix="℃"
                        class="card-panel-num"
                      />
                    </div>
                  </div>

                </div>
                <div
                  class="right-bar-item"
                  :class="{hight:lowTemp > warningVal } "
                >
                  <div>最低温度</div>
                  <div class="bar-item-content">
                    <el-progress
                      :percentage="lowPct"
                      :stroke-width="16"
                    />
                    <div class="num low">
                      <count-to
                        :start-val="0"
                        :end-val="lowTemp || 0"
                        :duration="2000"
                        :decimals="1"
                        suffix="℃"
                        class="card-panel-num"
                      />
                    </div>

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
              <div class="content-crumb">{{ alarmItem.Company }}</div>
              <div class="content-crumb">{{ alarmItem.Factory }}</div>
              <div class="content-crumb">{{ alarmItem.Area }}</div>
              <div class="content-crumb">{{ alarmItem.Bath }}</div>
            </div>
          </div>
          <div class="point-wrap">

            <DetailPoint
              :list="pointList"
              :min="unusualVal"
              :max="warningVal"
              @pointClick="pointClick"
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
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'
import CountTo from 'vue-count-to'

import Electrolyzer from './components/Electrolyzer'
import DetailLineChart from './components/DetailLineChart'
import Header from './components/Header'
import DetailPoint from './components/DetailPoint'

import _map from 'lodash/map'
import sortBy from 'lodash/sortBy'

import {
  company,
  factory,
  areaPage,
  cell,
  devicePoint,
  deviceHistory,
  handelAlarm,
  deviceInfo,
  exportPointInfo,
  deviceStatus
} from '@/api/station'

function createCellList(len) {
  const n = len
  const arr = []
  let obj = {}
  while (len--) {
    obj = {
      index: len,
      empty: true,
      tid: n - len,
      value: '无数据'
    }
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
    CountTo,
    DetailLineChart
  },
  filters: {
    t_type(val) {
      let res = ''
      if (val === 'offline') {
        res = '离线'
      } else {
        res = '正常'
      }
      return res
    }
  },
  data() {
    return {
      step: (30 / 60) * 60 * 1000, //  60 * 1000 // 1分钟
      centerDialogVisible: false,

      updateTime: this.$dayjs().format('YYYY/MM/DD hh:mm:ss'),
      pointList: [],

      cellFreshTimeOptions: [
        { value: '10秒', label: '10秒' },
        { value: '30秒', label: '30秒' },
        { value: '1分钟', label: '1分钟' },
        { value: '5分钟', label: '5分钟' },
        { value: '10分钟', label: '10分钟' }
      ],

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
      timer: null,
      cacheList: [],
      allPointList: [
        {
          tid: '',
          value: 0
        }
      ],
      allPointListFake: createCellList(168),

      piontHistoryList: [
        {
          fv: 0,
          pick_time: '',
          pid: '',
          tid: ''
        }
      ],
      queryParams: {
        sTime: '',
        eTime: '',
        id: ''
      }
    }
  },
  computed: {
    ...mapGetters(['warningVal', 'unusualVal']),
    ...mapState({
      alarmItem: (state) => state.station.alarmItem
    }),
    averageTemperature() {
      let sum = 0
      for (const key in this.temperatureObj) {
        sum += this.temperatureObj[key]
      }
      return sum / 3
    },

    averagePct() {
      return this.averageTemp > 0
        ? (this.averageTemp * 100) / this.heigthTemp
        : 0
    },
    nowPct() {
      return this.nowTemp > 0 ? (this.nowTemp * 100) / this.heigthTemp : 0
    },
    hightPct() {
      return this.heigthTemp > 0 ? (this.heigthTemp * 100) / this.heigthTemp : 0
    },
    lowPct() {
      return this.lowTemp > 0 ? (this.lowTemp * 100) / this.heigthTemp : 0
    },
    temperatureObj() {
      const obj = {}
      obj.hight = 1000
      obj.low = 300
      obj.now = 800
      return obj
    },
    heigthTemp() {
      return Math.max(...this.piontHistoryList.map((v) => v.fv), 0)
    },
    nowTemp() {
      const obj = this.allPointList.find((v) => v.tid === this.alarmItem.t_id)
      return obj ? obj.value : 0
    },
    lowTemp() {
      return this.piontHistoryList.length > 0
        ? Math.min(...this.piontHistoryList.map((v) => v.fv), 9000)
        : 0
    },
    averageTemp() {
      const sum = this.piontHistoryList.reduce((pre, cur) => {
        return cur.fv + pre
      }, 0)
      const res = sum ? (sum / this.piontHistoryList.length).toFixed(1) : 0
      return Number(res)
    }
  },
  created() {},
  mounted() {
    this.init()
  },
  destroyed() {},
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    ...mapMutations({
      SET_ALARMITEM: 'station/SET_ALARMITEM'
    }),
    clickPoint(item) {
      const obj = { ...this.alarmItem }
      obj.BathID = item.bath_id
      this.SET_ALARMITEM(obj)
      devicePoint(this.alarmItem.BathID)
        .then((res) => {
          const arr = res.data.result || []
          this.allPointList = arr
          this.setFuncOfpoint()
          obj.t_id =
            this.allPointList.length > 0 ? this.allPointList[0].tid : ''
          this.SET_ALARMITEM(obj)
          this.queryPiontHistory()
        })
        .catch((err) => {
          this.$message(err)
        })
    },
    isExcel(res) {
      let fileName = ''
      const data = res.data
      const disposition = res.headers['content-disposition']
      if (disposition) {
        fileName = window
          .decodeURI(disposition.split('=')[1], 'UTF-8')
          .replace(/"/g, '')
      }
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        const blob = new Blob([data])
        window.navigator.msSaveOrOpenBlob(blob, fileName)
      } else {
        /* 火狐谷歌的文件下载方式 */
        var blob = new Blob([data])
        var downloadElement = document.createElement('a')
        var href = window.URL.createObjectURL(blob)
        downloadElement.href = href
        downloadElement.download = fileName
        document.body.appendChild(downloadElement)
        downloadElement.click()
        document.body.removeChild(downloadElement)
        window.URL.revokeObjectURL(href)
      }
    },
    exportPoint(arr) {
      const obj = {
        id: this.alarmItem.t_id,
        sTime: arr[0],
        eTime: arr[1]
      }
      // var l =
      //   'http://10.53.31.114:9527/api/data/export?tid=temperature@run-50.exe&begin_time=2021-06-01%2015:48&end_time=2021-06-21%2016:48'
      // console.log('111111111')
      // window.location.href = l
      exportPointInfo(obj)
        .then((res) => {
          this.isExcel(res)
          // type 为需要导出的文件类型，此处为xls表格类型

          this.$refs.DetailLineChart.hideExport()
        })
        .catch((err) => {
          this.$message(err)
        })
    },
    refresh() {
      this.queryPiontHistory()
    },
    changeDateQuery(date) {
      this.queryParams.sTime = date + ' 00:00'
      this.queryParams.eTime = date + ' 23:59'
      this.queryPiontHistory(date)
    },
    pointClick(val) {
      const obj = { ...this.alarmItem }
      obj.t_id = val
      this.SET_ALARMITEM(obj)
      this.queryPiontHistory()
      // deviceInfo(val).then((res) => {})
    },
    updateRate(val) {
      this.step = val * 1000
      this.init()
    },
    init() {
      // 第一次进入页面默认查询时间
      // this.queryParams.sTime =
      //   this.$dayjs().subtract(30, 'day').format('YYYY-MM-DD') + ' 00:00'
      // this.queryParams.eTime = this.$dayjs().format('YYYY-MM-DD') + ' 23:59'
      this.queryParams.sTime =
        this.$dayjs(this.alarmItem.AlarmTime).format('YYYY-MM-DD') + ' 00:00'
      this.queryParams.eTime =
        this.$dayjs(this.alarmItem.AlarmTime).format('YYYY-MM-DD') + ' 23:59'
      // this.queryCell()
      this.queryPiont()
      this.queryPiontHistory()

      // clearInterval(this.timer)

      // this.timer = setInterval(() => {
      //   this.queryPiontHistory()
      // }, this.step)
    },
    splitArr(data) {
      const result = []
      for (var i = 0; i < data.length; i += 3) {
        result.push(data.slice(i, i + 3))
      }
      return result
    },
    /* 点位数据结构 */
    setFuncOfpoint() {
      this.allPointListFake = createCellList(168)
      // let groupNum = 20,row = 1 // 电解槽一排多少组 每3个为一组
      const len = this.allPointListFake.length // 默认168个点位
      const arr = this.allPointList

      arr.forEach((v, i) => {
        this.allPointListFake[i] = v
      })
      const arrFake1 = this.allPointListFake.slice(0, len / 2)
      const arrFake2 = this.allPointListFake.slice(len / 2, len)
      const newArr1 = this.splitArr(arrFake1)
      const newArr2 = this.splitArr(arrFake2)

      const pointListItem1 = newArr1.map((v, i) => {
        return { pointList: v }
      })
      const pointListItem2 = newArr2.map((v, i) => {
        return { pointList: v }
      })
      // if(isSingle){

      // }
      // debugger
      this.pointList = [{ arr: pointListItem1 }, { arr: pointListItem2 }]
    },
    queryPiont() {
      devicePoint(this.alarmItem.BathID)
        .then((res) => {
          const arr = res.data.result || []
          this.allPointList = arr
          this.setFuncOfpoint()
        })
        .catch((err) => {
          this.$message(err)
        })
    },
    queryPiontHistory(date) {
      this.queryParams.id = this.alarmItem.t_id
      deviceHistory(this.queryParams)
        .then((res) => {
          const arr = res.data.result || []
          this.piontHistoryList = sortBy(arr, (v) => v.pick_time)
        })
        .catch((err) => {
          this.$message(err)
        })
    },
    // async queryCell() {
    //   try {
    //     // 电解槽
    //     const cellResult = await cellInfo(this.alarmItem.AreaID, 1)
    //     const list = cellResult.data.result.stations
    //     this.list = list.map((v) => {
    //       return {
    //         ...v,
    //         ...{
    //           id: v.uid,
    //           name: v.s_name,
    //           type: 'yellow',
    //           dot: 88888,
    //           temperatureDot: 0,
    //           trendDot: 0,
    //           unusualDot: 1
    //         }
    //       }
    //     })
    //   } catch (err) {
    //     this.$message('电解槽错误')
    //   }
    // },

    customColorMethod(percentage) {
      console.log(percentage)
      if (percentage > 50) {
        return '#eb540e'
      } else {
        return '#18BAD7'
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
