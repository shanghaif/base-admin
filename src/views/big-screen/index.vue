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
      <Header />
      <div class="content">
        <div class="item left">
          <div class="chart-box">
            <div class="chart-box-tool">
              <div class="chart-box-title tj">{{ currentFactory.s_name }}分区点位状态统计</div>
              <bar-chart-row
                v-for="(item,i) in list"
                :id="'bar_row' + i"
                :key="i + 'bar_row' + rowKey"
                :data="item"
              />
              <!-- <bar-chart-row :list="list" /> -->
            </div>
          </div>
          <div class="line_l">

            <single-bar-chart id="line_l" />
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
          <sheet-main />

        </div>
        <div class="item right">
          <unusual-list id="UnusualList" />

          <single-line-chart id="line_r" />

        </div>
      </div>
    </div>
  </div>
</template>

 
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import MapChart from './components/MapChart'
import SingleBarChart from './components/SingleBarChart'
import SingleLineChart from './components/SingleLineChart'
import BarChartRow from './components/BarChartRow'
import SheetMain from './components/SheetMain'
import UnusualList from './components/UnusualList'
import Header from './components/Header'
import { screenSize } from '@/utils'
import { company, factory, area, cell, device } from '@/api/station'

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
    SingleLineChart,
    BarChartRow,
    SheetMain,
    UnusualList,
    Header,
    SingleBarChart
  },

  data() {
    return {
      company: '',
      rowKey: 0,
      companyList: [],
      factoryList: [],
      areaList: [],
      cellList: [],
      deviceList: [],
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
    })
  },
  created() {
    this.init()
  },
  mounted() {
    // screenSize(this.$refs.editor)
  },
  destroyed() {},
  methods: {
    // ...mapActions({
    //   getCompany: 'station/getCompany',
    //   getFactory: 'station/getFactory',
    //   getArea: 'station/getArea',
    //   getDevice: 'station/getDevice'
    // }),
    ...mapMutations({
      SET_FACTORY: 'station/SET_FACTORY'
    }),
    init() {
      this.query()
    },
    // 公司查询
    async query() {
      // 分公司
      const companyResult = await company()
      this.companyList = companyResult.data.result.stations
      // 工厂
      const id_company = this.companyList[0].uid
      const factoryResult = await factory(id_company)
      this.factoryList = factoryResult.data.result.stations

      this.SET_FACTORY(this.factoryList[0])
      // 分区
      const id_factory = this.currentFactory.uid
      const areaResult = await area(id_factory)
      this.areaList = areaResult.data.result.stations
      // 电解槽
      const id_area = this.factoryList[0].uid
      const cellResult = await cell(id_area)
      this.cellList = cellResult.data.result.stations
      // 设备
      const id_cell = this.factoryList[0].uid
      const deviceResult = await device(id_cell)
      this.deviceList = deviceResult.data.result.stations
    },

    selectFactory(item) {
      this.company = item.s_name
      this.SET_FACTORY(item)

      if (item.s_name === '电解铝二厂') {
        this.list = [
          {
            factory: '电解铝二厂',
            area: '2分区',
            cells: 55,
            point: 168,
            child: [
              { name: '异常点位', num: 111 },
              { name: '趋势告警', num: 7 },
              { name: '温度告警', num: 32 },
              { name: '离线点位', num: 412 }
            ]
          },
          {
            factory: '电解铝二厂',
            area: '2分区',
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
            area: '2分区',
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
      } else if (item.s_name === '电解铝一厂') {
        this.list = [
          {
            factory: '电解铝二厂',
            area: '1分区',
            cells: 55,
            point: 168,
            child: [
              { name: '异常点位', num: 222 },
              { name: '趋势告警', num: 7 },
              { name: '温度告警', num: 32 },
              { name: '离线点位', num: 412 }
            ]
          },
          {
            factory: '电解铝二厂',
            area: '2分区',
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
            area: '3分区',
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
      this.rowKey++
    },
    createBarList() {
      const arr = []
      this.factoryList.forEach((v, i) => {
        const obj = {}
        obj.factory = this.currentFactory.s_name

        this.areaList.forEach((v, i) => {})
      })
    }
  }
}
</script>
<style lang="scss" scoped>
$top-Height: 10vh;

.big-screen {
  // position: absolute;
  // left: 0;
  // top: 0;
  position: relative;
  width: 100%;
  height: 100%;
  // .wrap {
  //   min-width: auto;
  //   width: 1920px;
  //   min-height: auto;
  //   height: 1080px;
  //   overflow: auto;
  //   transform-origin: 0px 0px 0px;
  background-image: url('~@/assets/images/bg.jpg');
  //   background-size: contain;
  //   background-position: 50% 0;
  //   background-color: rgb(0, 0, 0);
  //   overflow: auto;
  // }
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
    overflow: hidden;
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
}
</style>
