<template>
  <div class="big-screen">
    <div class="wrap">
      <div class="top">
        <!-- <router-link to="/"></router-link> -->
        <div class="comp-name">温度监测系统</div>
        <div class="update">
          数据更新时间:
          <span>2020-01-01</span>
        </div>
      </div>
      <div class="content">
        <div class="item">
          <div class="chart-box">
            <div class="chart-box-tool">
              <div class="chart-box-title">分区点位状态统计</div>
              <bar-chart-row v-for="(item,i) in list" :id="'bar_row' + i" :key="i + 'a'" /> 
            </div>
          </div>
          <single-bar-chart id="line_l" /> 

        </div>
        <div class="item center">
          <map-chart /> 
          <sheet-main /> 

        </div>
        <div class="item">
          <unusual-list id="UnusualList" /> 
          <single-line-chart id="line_r" /> 

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


export default {
  name: 'BigScreen',
  components: {
    MapChart,
    SingleLineChart,
    BarChartRow,
    SheetMain,
    UnusualList,
    SingleBarChart
  },
     
  data() {
    return {
      list: [
        { factory: '电解铝二厂', area: '一分区', child: [{ name: '异常点位', num: 10 }, { name: '趋势告警', num: 20 }, { name: '温度告警', num: 30 }, { name: '离线点位', num: 40 }] },
        { factory: '电解铝二厂', area: '二分区', child: [{ name: '异常点位', num: 10 }, { name: '趋势告警', num: 20 }, { name: '温度告警', num: 30 }, { name: '离线点位', num: 40 }] },
        { factory: '电解铝二厂', area: '三分区', child: [{ name: '异常点位', num: 10 }, { name: '趋势告警', num: 20 }, { name: '温度告警', num: 30 }, { name: '离线点位', num: 40 }] }
      ]
    }
  },
  computed: {
    legendData() {
      const arr = []
      this.list[0].child.forEach(v => {
        arr.push(v.name)
      })
      return arr
    },
    data1() {
      const arr = []
      this.list[0].child.forEach(v => {
        arr.push(v.num)
      })
      return arr
    },
    data2() {
      const arr = []
      this.list[1].child.forEach(v => {
        arr.push(v.num)
      })
      return arr
    },
    data3() {
      const arr = []
      this.list[2].child.forEach(v => {
        arr.push(v.num)
      })
      return arr
    }
  },
  created() {
     
  },
  mounted() {
    
  },
  destroyed() {
  },
  methods: {
  
    
  }
}
</script>
<style lang="scss" scoped>
$top-Height: 10vh;

.big-screen{
  height: 100%;
  background-image: url('~@/assets/images/bg.jpg');
  .top{
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      justify-content: flex-starts;
      align-items: center;
    .comp-name{
      margin: 30px 0 10px 0;
      font-size: 28px;

      color: #fff;
    }
    .update{
      font-size: 16px;
      color: #fff;

    }
  }
  .content{
    width: 92%;
    height: 100vh;
    display: flex;
    margin: 0 auto;
    .item{
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;
      // background: rgba(0,0,0,0.1);
      width: 25%;
      height: 100%;
      padding: 40px 0 ;
      &.center{
        width: 50%;
      background: rgba(0,0,0,0);

      }
    }
    
  }
}
</style>
