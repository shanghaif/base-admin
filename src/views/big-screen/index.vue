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
          <single-bar-chart id="line_l" /> 

        </div>
        <div class="item center">
          <map-chart /> 

        </div>
        <div class="item">
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


export default {
  name: 'BigScreen',
  components: {
    MapChart,
    SingleLineChart,
    SingleBarChart
  },
     
  data() {
    return {
      
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
    width: 100vw;
    height: 100vh;
    padding: 0 10px;
    display: flex;
    .item{
      flex:3;
      background: rgba(0,0,0,.5);
      height: 100%;
      
      z-index: 1000;
      &.center{
        flex: 5;
      background: rgba(0,0,0,0);

      }
    }
    
  }
}
</style>
