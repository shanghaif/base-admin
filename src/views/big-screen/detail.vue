<template>
  <div class="detail-wrap">
    <div class="wrap">
      <!-- <div class="top">
        <div class="comp-name">温度监测系统</div>
        <div class="update">
          数据更新时间:
          <span>2020-01-01</span>
        </div>
      </div> -->
      <div class="content">
        <div class="content-top">
          <div class="detail-item detail-item-left">
            <!-- <electrolyzer :list="list" /> -->

            <virtual-list
              style="height: 360px; overflow-y: auto"
              :data-key="'id'"
              :data-sources="list"
              :data-component="itemComponent"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

 
<script>
import Electrolyzer from './components/Electrolyzer'
import VirtualList from 'vue-virtual-scroll-list'

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
  name: 'BigScreen',
  components: {
    VirtualList
  },

  data() {
    return {
      itemComponent: Electrolyzer,
      // list: [
      //   { id: '10000', name: '电解槽1', type: 'warning', dot: 168, temperatureDot: 6, trendDot: 2, unusualDot: 1 },
      //   { id: '10001', name: '电解槽2', type: 'defual', dot: 168, temperatureDot: 6, trendDot: 2, unusualDot: 1 },
      //   { id: '10002', name: '电解槽3', type: 'warning', dot: 168, temperatureDot: 6, trendDot: 2, unusualDot: 1 },

      // ]
      list: createData(10)
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
  mounted() {},
  destroyed() {},
  methods: {}
}
</script>
<style lang="scss" scoped>
$top-Height: 10vh;

.detail-wrap {
  height: 100%;
  background-image: url('~@/assets/images/bg.jpg');
  .top {
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    justify-content: flex-starts;
    align-items: center;
    .comp-name {
      margin: 30px 0 10px 0;
      font-size: 28px;

      color: #fff;
    }
    .update {
      font-size: 16px;
      color: #fff;
    }
  }
  .content {
    width: 96%;
    height: 100vh;
    display: flex;
    margin: 0 auto;
    .content-top {
      width: 100%;
      @include flex(space-between, center);

      .detail-item {
        width: 20%;

        .detail-item-left {
        }
      }
    }
  }
}
</style>
