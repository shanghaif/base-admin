<template>
  <div class="sheet-main">
    <div class="chart-box-title big">重庆分公司 电解铝二厂</div>
    <div class="tip">
      
      <span class="time">告警信息汇总 2021年5月19日</span>
      <span class="link">告警信息日志 <i class="el-icon-arrow-right go-link" /></span>
    </div>
    <div class="cells">
      <div v-for="(item,i) in list" :key="i + 'a'" class="cell">
        <span class="num" :class="item.class">{{ item.num }}</span>
        <span class="text">{{ item.text }}</span>
      </div>
       
    </div>
  </div>
</template>

<script>

export default {
  name: 'SheetMain',
  props: {},
  data() {
    return {
      list: [
        { text: '总电解槽', num: 582, class: '' },
        { text: '已部署电解槽', num: 577, class: 'blue' },
        { text: '告警电解槽', num: 12, class: 'red' },
        { text: '异常电解槽', num: 5, class: 'yellow' },
        { text: '总测温点位', num: 97776, class: '' },
        { text: '已部署点位', num: 86033, class: 'blue' },
        { text: '告警点位', num: 233, class: 'red' },
        { text: '异常点位', num: 107, class: 'yellow' }
      ]
    }
  },
 
  methods: {}
}
</script>

<style lang="scss" scoped>
  .sheet-main{
    padding: 0 0 20px 0;
    width: 90%;
    margin: 0 auto;
    .tip{
      margin-top: 10px;
    }
    .time{
      color: #fff;
      font-size: 16px;
    }
    .link{
      font-weight: bold;
      color: #fff;
      font-size: 16px;
      margin-left: 20px;
    }
    .cells{
      display: flex;
      flex-wrap: wrap;
      margin-top: 40px;
      .cell{
        width: 25%;
        @include flex(center,flex-start);
        flex-direction: column;
        
        margin-bottom: 20px;
        .num{
          font-size: 44px;
          color: #fff;
          &.red{
            color: $err;
          }
          &.blue{
            color: $defaultColor;
          }
          &.yellow{
            color: $yl;
          }
        }
        .text{
            color: #fff;
            font-size: 16px;
        }
      }
    }
  }
</style>
