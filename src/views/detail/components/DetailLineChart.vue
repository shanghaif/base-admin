<template>
  <div class="detail-chart">
    <!-- <div class="chart-tool">
      <div class="left-text">

        <div class="title">测温点温度曲线</div>
        <div class="content-crumbs crumbs">
          <div class="content-crumb">{{ alarmItem.Bath }}</div>
          <div class="content-crumb">{{ alarmItem.t_id }}</div>

        </div>
      </div>

    </div> -->
    <div class="title">电解槽点位详情 <div class="sub">{{ alarmItem.Bath }} / {{ alarmItem.t_id }}</div>
    </div>
    <div class="info">
      <div class="info-item">当前温度:
        <span
          class="temp"
          :class="pointTextClass(alarmItem)"
        >{{ nowTemp }}</span>
      </div>
      <div class="info-item">告警状态:
        <span :class="pointTextClass(alarmItem)">
          {{ alarmItem.alarm_id && alarmItem.alarm_id | typeText }}
        </span>
      </div>
    </div>
    <div class="select-date">
      <span class="select-date-text">数据日期：</span>
      <!-- <el-date-picker
          v-model="date"
          type="date"
          placeholder="选择日期"
          class="screen-select"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptionsSingle"
          @change="changeDate"
        /> -->
      <Date-picker
        :clearable="false"
        :value="date"
        type="daterange"
        :options="pickerOptions"
        placeholder="选择日期"
        style="width: 200px"
        class="date-range-box"
        @on-change="changeDate"
      />

    </div>
    <div class="detail-chart-box">
      <!-- <div
        v-if="xData.length < 1"
        class="no-data"
      >
        <Status
          img="null"
          text="暂无数据"
        />
      </div>
      <div
        :id="id"
        :class="className"
        :style="{height:height,width:width}"
      /> -->
      <HistoryChart
        id="detailHistoryChart"
        ref="HistoryChart"
        :list="list"
        :options="{fontSize:14,splitNumber_x:12,splitNumber_y:5,lineWidth:3,isShowMax:true}"
      />
    </div>

  </div>

</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'
import HistoryChart from '@/components/HistoryChart'
export default {
  name: 'DetailLineChart',
  components: { HistoryChart },
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
    }
  },
  // mixins: [resize],
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
      exportDialogVisible: false,
      option: null,
      // warningVal: 250,
      // xData: [],
      newList: [],
      checkedTemp: [],
      Temps: ['原始温度数据', '最高温度', '最低温度', '平均温度'],
      now: 0,
      date: [],
      exportDate: [],
      value: Math.random() * 100,
      // step:  60 * 1000 // 1分钟
      step: (10 / 60) * 60 * 1000,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [
          {
            text: '最近三天',
            value() {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 2)
              return [start, end]
            }
          },
          {
            text: '最近一周',
            value() {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
              return [start, end]
            }
          },
          {
            text: '最近30天',
            value() {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 29)
              return [start, end]
            }
          }
        ]
      },
      pickerOptionsSingle: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      alarmItem: (state) => state.station.alarmItem,
      tempHeight: (state) => state.station.tempHeight,
      currentPoint: (state) => state.station.currentPoint
    }),

    nowTemp() {
      return (
        (this.list.length > 1 && this.list[this.list.length - 1]['fv']) || ''
      )
    }
  },

  mounted() {
    const sDate =
      this.$dayjs(this.alarmItem.AlarmTime).format('YYYY-MM-DD') + ' 00:00'
    const eDate =
      this.$dayjs(this.alarmItem.AlarmTime).format('YYYY-MM-DD') + ' 23:59'
    this.date = [sDate, eDate]
  },
  beforeDestroy() {},
  methods: {
    changeDate(date) {
      this.$emit('changeDate', date)
    },
    pointTextClass(point) {
      let res = ''
      const val = point.alarm_id

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
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .date-range-box {
  .ivu-input {
    font-size: 14px;
  }
}
::v-deep .ivu-select-dropdown {
}
.title {
  font-size: 24px;
  font-weight: 800;
  color: var(--theme);
  display: flex;
  gap: 14px;
  align-items: flex-end;
  .sub {
    color: #fff;
    font-size: 16px;
  }
}
.svg {
  margin-right: 8px;
}
.export-filter {
  .filter-items {
    .filter-item {
      @include flex(flex-start, flex-start);
      margin-bottom: 20px;
      width: 100%;
      .filter-item-label {
        font-size: 16px;
        line-height: 32px;
        color: #fff;
        width: 70px;
      }
      .filter-item-content {
        flex: 1;
        line-height: 32px;
        margin-left: 25px;
        .content-crumbs {
          color: #999;
        }
      }
    }
  }
}
.detail-chart {
  height: 100%;
  width: 100%;
  padding: 0 20px;
  .chart-tool {
    @include flex(space-between, center);
    .left-text {
      @include flex(flex-start, baseline);
      .content-crumbs {
        margin-left: 20px;
        font-weight: bold;
        font-size: 16px;
      }
    }
    .right-btns {
      @include flex();

      .btn {
        @include flex();
        width: 100px;
        height: 32px;
        background: rgba(255, 255, 255, 0.1);
        margin-right: 15px;
        border-radius: 4px;
        color: #fff;
        cursor: pointer;
      }
    }
  }
  .select-date {
    @include flex(flex-end, center);
    padding: 0 20px;
    width: 100%;
    ::v-deep .el-date-editor.el-input {
      width: 160px;
    }
    ::v-deep .el-input__inner {
      background: rgba(255, 255, 255, 0.1);
      height: 24px;
      line-height: 24px;
      border: 0;
      border-radius: 0;
      color: #fff;
    }
    ::v-deep .el-input__icon {
      line-height: 24px;
    }
    .select-date-text {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
    }
  }
  .detail-chart-box {
    @include flex(space-between, center);
    flex-direction: column;
    width: calc(100% + 60px);
    height: calc(100% - 146px);
    position: relative;
    margin: 0 -30px;
    .no-data {
      @include flex();

      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      margin: auto;
      height: 100%;
      width: 100%;
    }
  }
}

.info {
  display: flex;
  gap: 20px;
  margin: 16px 0;
  width: 100%;
  &-item {
    display: flex;
    gap: 10px;
    padding: 14px 0;
    width: 50%;
    font-size: 16px;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.05);
    box-shadow: 0 10px 20px -10px rgba(0, 0, 0, 0.6);
    .alarm-b {
      color: var(--alarmB);
    }
    span {
      font-size: 20px;
      font-weight: 600;
    }
    .temp {
      display: flex;
      font-family: 'DIN', 'PingFang SC', 'Microsoft Yahei', sans-serif;
      &:after {
        display: inline-block;
        margin: 0px 0 auto 0;
        content: '°C';
        font-size: 14px;
      }
    }
  }
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
.date-range-box {
  ::v-deep .ivu-input {
    // background: rgba(255, 255, 255, 0.1);
    // height: 24px;
    // line-height: 24px;
    // border: 0;
    // border-radius: 0;
    // color: #fff;
    display: inline-block;
    // padding: 10px 20px !important;
    height: 36px;
    line-height: 36px;
    border-radius: 4px !important;
    font-family: 'DIN' !important;
    align-items: center !important;
    background: rgba(255, 255, 255, 0.05) !important;
    box-shadow: 0 10px 20px -10px rgb(0 0 0 / 60%) !important;
  }
  ::v-deep .ivu-input-suffix {
    .ivu-icon {
      line-height: 36px;
      font-size: 20px;
    }
  }
}
</style>
