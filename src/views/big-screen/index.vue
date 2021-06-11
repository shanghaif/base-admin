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
              <div class="chart-box-title tj">{{ company }}分区点位状态统计</div>
              <bar-chart-row
                v-for="(item,i) in list"
                :id="'bar_row' + i"
                :key="i + 'bar_row'"
                :data="item"
              />
            </div>
          </div>
          <div class="line_l">

            <single-bar-chart id="line_l" />
          </div>

        </div>
        <div class="item-map">
          <map-chart @seletName="selectCompany" />

        </div>
        <div class="item center">
          <sheet-main />

        </div>
        <div class="item right">
          <unusual-list id="UnusualList" />
          <single-line-chart
            id="line_r"
            style="margin-top:50px"
          />

        </div>
      </div>
    </div>
  </div>
</template>

 
<script>
import MapChart from './components/MapChart'
import SingleBarChart from './components/SingleBarChart'
import SingleLineChart from './components/SingleLineChart'
import BarChartRow from './components/BarChartRow'
import SheetMain from './components/SheetMain'
import UnusualList from './components/UnusualList'
import Header from './components/Header'
import { screenSize } from '@/utils'

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
    legendData() {
      const arr = []
      this.list[0].child.forEach((v) => {
        arr.push(v.name)
      })
      return arr
    },
    data1() {
      const arr = []
      this.list[0].child.forEach((v) => {
        arr.push(v.num)
      })
      return arr
    },
    data2() {
      const arr = []
      this.list[1].child.forEach((v) => {
        arr.push(v.num)
      })
      return arr
    },
    data3() {
      const arr = []
      this.list[2].child.forEach((v) => {
        arr.push(v.num)
      })
      return arr
    }
  },
  created() {},
  mounted() {
    // screenSize(this.$refs.editor)
  },
  destroyed() {},
  methods: {
    selectCompany(name) {
      this.company = name
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
    margin: 0 auto;
    position: relative;
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
        top: 60px;
        width: 400px;
        // background: linear-gradient(
        //   0deg,
        //   rgba(0, 0, 0, 0.1),
        //   rgba(0, 0, 0, 0.5)
        // );
        height: calc(100% - 60px);
        .chart-box {
          height: calc(100% - 300px);
        }
        .line_l {
          height: 250px;
        }
      }
      &.right {
        right: 0;
        top: 60px;

        width: 400px;
        height: calc(100% - 60px);
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
