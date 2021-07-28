<template>
  <div class="big-screen">
    <div
      ref="editor"
      class="wrap"
    >
      <!-- <div class="top">
        <div class="comp-name">温度监测系统</div>
        <div class="update">
          数据更新时间:
          <span>2020-01-01</span>
        </div>
      </div> -->
      <Header
        :step="step"
        @change="changeStep"
      />
      <div class="setting">
        <i
          class="el-icon-right"
          @click="goManage"
        />
      </div>
      <div class="content">
        <div class="item left">
          <div class="chart-box">
            <div class="chart-box-tool">
              <div class="chart-box-title tj">分区点位状态统计</div>
              <div
                class="bar-chart-row-box"
                :class="{'no-data':leftList.length < 1}"
              >

                <bar-chart-row
                  v-for="(item,i) in leftList"
                  :id="'bar_row' + i"
                  :key="i + 'bar_row' + rowKey"
                  :data="item"
                />

              </div>
              <!-- <bar-chart-row :list="list" /> -->
            </div>
          </div>
          <div class="line_l">

            <single-bar-chart
              id="line_l"
              :key="'single-bar-chart' + rowKey"
              :data="alarmData"
            />
          </div>

        </div>
        <div class="item-map">
          <map-chart
            :company-list="companyList"
            :factory-list="factoryList"
            @seletName="selectFactory"
          />

        </div>
        <div class="item center">
          <sheet-main :list="leftList" />

        </div>
        <div class="item right">
          <unusual-list
            ref="UnusualList"
            :key="'unusual-list' + rowKey"
          />

          <AlarmChart id="line_r" />

        </div>
      </div>
    </div>
  </div>
</template>

 
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import MapChart from './components/MapChart'
import SingleBarChart from './components/SingleBarChart'
// import SingleLineChart from './components/SingleLineChart'
import AlarmChart from './components/AlarmChart'
import BarChartRow from './components/BarChartRow'
import SheetMain from './components/SheetMain'
import UnusualList from './components/UnusualList'
import Header from './components/Header'
import { screenSize } from '@/utils'
// import Socket from '@/utils/webSocket'
import { Socket } from '@/utils/socket'
import {
  company,
  factory,
  areaPage,
  cell,
  device,
  handelAlarm,
  deviceStatus
} from '@/api/station'
import { getCell, setCell, removeCell, setCurrentFactory } from '@/utils/auth'

function createData(len) {
  const arr = []
  while (len--) {
    const obj = {
      id: len,
      name: `电解槽${len}`,
      type: 'warning',
      dot: 168,
      area: '一分区',
      temperatureDot: 6,
      trendDot: 2,
      unusualDot: 1,
      time: '2021.05.19 13:49:50'
    }
    arr.push(obj)
  }
  return arr
}
export default {
  name: 'BigScreen',
  components: {
    MapChart,
    // SingleLineChart,
    BarChartRow,
    SheetMain,
    UnusualList,
    AlarmChart,
    Header,
    SingleBarChart
  },

  data() {
    return {
      wbSocketUnusualList: null,
      company: '',
      rowKey: 0,
      step: 60 * 15 * 1000,
      timer: null,
      companyList: [],
      factoryList: [],
      areaList: [],
      cellList: [],
      deviceList: [],
      warningList: [],
      statusList: [],
      alarmData: {},
      list: [
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
    factoryId() {
      return this.currentFactory.uid
    },
    leftList() {
      return this.areaList.map((v) => {
        return {
          ...v,
          ...{
            factory: this.currentFactory.s_name,
            area: v.area_name,
            cells: v.bath_all,
            point: v.point_all,
            child: [
              { name: '异常点位', num: v.point_offline_alarm },
              { name: '趋势告警', num: v.point_trend_alarm },
              { name: '温度告警', num: v.point_temperature_high_alarm },
              { name: '离线点位', num: v.point_offline_alarm }
            ]
          }
        }
      })
    }
  },
  created() {
    this.init()
    // this.newInit()
  },
  mounted() {
    // screenSize(this.$refs.editor)
    // this.sendSocketUnusualList()
  },

  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    // ...mapActions({
    //   getCompany: 'station/getCompany',
    //   getFactory: 'station/getFactory',
    //   getArea: 'station/getArea',
    //   getDevice: 'station/getDevice'
    // }),
    ...mapMutations({
      SET_FACTORY: 'station/SET_FACTORY',
      SET_CELL: 'station/SET_CELL'
    }),
    sendSocketUnusualList() {
      const url =
        process.env.VUE_APP_SOCKET_API +
        '/api/ws/alarm' +
        `?tid=${this.currentFactory.uid}`
      // this.wbSocketUnusualList = new Socket(url)
      // this.wbSocketUnusualList.onmessage((data) => {
      //   console.log('data :>> ', data)
      // })

      this.wbSocketUnusualList = new Socket({ url })
      this.wbSocketUnusualList.onmessage((data) => {
        console.log('data :>> ', JSON.parse(data))
      })
    },
    changeStep(step) {
      this.step = step
      this.init()
    },

    queryInit() {
      company(1)
        .then((res) => {
          this.companyList = (res.data.result && res.data.result.stations) || []

          this.query()
        })
        .catch((err) => {
          this.$message(err)
        })
    },

    init() {
      this.queryInit()
      this.timer = setTimeout(() => {
        this.queryInit()
      }, this.step)
    },
    newInit() {
      this.queryCompany()
      this.queryFactory()
      this.queryArea()
      this.queryHandelAlarm()
    },
    async refresh() {
      try {
        // 分区

        const areaResult = await areaPage(this.factoryId)
        this.areaList = areaResult.data.result || []
        // this.queryDeviceStatus(this.factoryId)
        this.queryHandelAlarm()
      } catch (err) {
        this.$message('分区错误')
      }

      // this.queryArea()
      // this.queryHandelAlarm()
    },
    async queryCompany() {
      try {
        const res = await company(1)
        this.companyList = (res.data.result && res.data.result.stations) || []
      } catch (err) {
        this.$message('工厂错误')
      }
    },
    async queryFactory() {
      if (this.companyList.length > 0) {
        try {
          // 工厂
          const id_company = this.companyList.find(
            (v) => v.s_name === '云南分公司'
          ).uid
          const factoryResult = await factory(id_company, 1)
          this.factoryList = factoryResult.data.result.stations || []
          const len = this.factoryList.length

          const hasData = len > 1 ? this.factoryList[1] : this.factoryList[0]
          this.SET_FACTORY(hasData)
          setCurrentFactory(hasData)
        } catch (err) {
          this.$message('工厂错误')
        }
      }
    },
    async queryArea() {
      if (this.factoryList.length > 0) {
        try {
          // 分区

          const areaResult = await areaPage(this.factoryId)
          this.areaList = areaResult.data.result || []
        } catch (err) {
          this.$message('分区错误')
        }
      }
    },
    async queryHandelAlarm() {
      if (this.factoryList.length > 0) {
        try {
          // 分区

          const res = await handelAlarm(this.factoryId)
          this.alarmData = res.data.result
        } catch (err) {
          this.$message('处理告警查询错误')
        }
      }
    },
    // async queryDeviceStatus() {
    //   try {
    //     const res = await deviceStatus(this.factoryId)
    //     this.statusList = (res.data.result && res.data.result.infoMap) || []
    //   } catch (err) {
    //     this.$message('状态错误')
    //   }
    // },
    // 公司查询
    async query() {
      try {
        // 分公司
        const companyResult = await company(1)
        this.companyList = companyResult.data.result.stations || []
      } catch (err) {
        this.$message('分公司错误')
      }
      if (this.companyList.length > 0) {
        try {
          // 工厂
          const id_company = this.companyList.find(
            (v) => v.s_name === '云南分公司'
          ).uid
          const factoryResult = await factory(id_company, 1)
          this.factoryList = factoryResult.data.result.stations || []
          const len = this.factoryList.length
          debugger

          const hasData = len > 1 ? this.factoryList[1] : this.factoryList[0]
          this.SET_FACTORY(hasData)
          setCurrentFactory(hasData)
        } catch (err) {
          this.$message('工厂错误')
        }
      }
      if (this.factoryList.length > 0) {
        try {
          // 分区

          const areaResult = await areaPage(this.factoryId)
          this.areaList = areaResult.data.result || []
          // this.queryDeviceStatus(this.factoryId)
        } catch (err) {
          this.$message('分区错误')
        }
      }
      // if (this.areaList.length > 0) {
      //   try {
      //     // 电解槽
      //     const id_area = this.areaList[0].uid
      //     const cellResult = await cell(id_area,1)
      //     this.cellList = cellResult.data.result.stations
      //   } catch (err) {
      //     this.$message('电解槽错误')
      //   }
      // }
      // if (this.cellList.length > 0) {
      //   try {
      //     // 设备
      //     const id_cell = this.cellList[1].uid
      //     const deviceResult = await device(id_cell)
      //     this.deviceList = deviceResult.data.result.stations
      //     this.SET_CELL(this.cellList[1])
      //     setCell(this.cellList[1])
      //   } catch (err) {
      //     this.$message('设备错误')
      //   }
      // }
      this.queryHandelAlarm()
    },

    selectFactory(item) {
      this.company = item.s_name
      this.SET_FACTORY(item)
      this.refresh()
      this.rowKey++
    },
    createBarList() {
      const arr = []
      this.factoryList.forEach((v, i) => {
        const obj = {}
        obj.factory = this.currentFactory.s_name

        this.areaList.forEach((v, i) => {})
      })
    },
    goManage() {
      this.$router.push({ name: 'Dashboard' })
    }
  }
}
</script>
<style lang="scss" scoped>
$top-Height: 10vh;

.big-screen {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-image: url('~@/assets/images/bg.jpg');
  background-size: contain;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 0;
    width: 400px;
    height: 100%;
    z-index: 100;
  }
  &::before {
    left: 0;
    background: linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
  }
  &::after {
    right: 0;
    background: linear-gradient(to left, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
  }
  .setting {
    position: fixed;
    top: 30px;
    right: 30px;
    cursor: pointer;
    z-index: 1000;
    > i {
      color: #999;
      font-size: 30px;
      font-weight: bold;
      &:hover {
        color: #fff;
      }
    }
  }
  .top {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    @include flex();
    flex-direction: column;
    z-index: 100;
    height: 160px;
    width: 100%;
    background: linear-gradient(
      rgba(0, 0, 0, 0.9) 0%,
      rgba(0, 0, 0, 0.3) 50%,
      rgba(0, 0, 0, 0) 100%
    );
    .comp-name {
      // margin: 30px 0 10px 0;
      font-size: 28px;

      color: #fff;
    }
    .update {
      font-size: 16px;
      color: #fff;
    }
  }
  .content {
    width: 92%;
    height: 100vh;
    padding-bottom: 2vh;
    margin: 0 auto;
    position: relative;
    // overflow: hidden;
    .item-map {
      height: 100%;
    }
    .item {
      // display: flex;
      // flex-direction: column;
      // justify-content: space-between;
      // align-items: flex-start;
      // background: rgba(0,0,0,0.1);
      position: absolute;
      height: 100%;
      z-index: 200;
      &.left {
        left: 0;
        top: 4%;
        width: 400px;
        // background: linear-gradient(
        //   0deg,
        //   rgba(0, 0, 0, 0.1),
        //   rgba(0, 0, 0, 0.5)
        // );
        height: 96%;
        .chart-box {
          height: 70%;
          // overflow: auto;
          .chart-box-tool {
            height: 100%;
          }
        }
        .line_l {
          height: 30%;
        }
      }
      &.right {
        right: 0;
        top: 4%;

        width: 400px;
        height: 96%;
      }
      &.center {
        height: 300px;
        left: 50%;
        bottom: 5%;
        transform: translateX(-50%);
        width: calc(100% - 900px);
        background: rgba(0, 0, 0, 0);
      }
      .tj {
        margin-bottom: 20px;
      }
    }
  }
  .bar-chart-row-box {
    height: 84%;
    overflow: auto;
    &.no-data {
      position: relative;
      &::before {
        content: '暂无数据';
        position: absolute;
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
</style>
