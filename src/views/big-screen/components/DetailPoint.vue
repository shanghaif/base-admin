<template>
  <div class="cell-demo">

    <div
      ref="cellTop"
      class="cell-top"
    >

      <div
        v-for="(group, index) of point"
        :key="'group' + index"
        class="point-group"
      >
        <div
          ref="top0"
          class="point"
          :class="group[0] === 0 ? 'normal' : group[0] === 1 ? 'yellow' : 'red'"
          @mouseenter="pointEnter(0,index)"
          @mouseleave="pointLeave(0,index)"
        />
        <div
          ref="top1"
          class="point-small"
          :class="group[1] === 0 ? 'normal' : group[1] === 1 ? 'yellow' : 'red'"
          @mouseenter="pointEnter(1,index)"
          @mouseleave="pointLeave(1,index)"
        />
        <div
          ref="top2"
          class="point"
          :class="group[2] === 0 ? 'normal' : group[2] === 1 ? 'yellow' : 'red'"
          @mouseenter="pointEnter(2,index)"
          @mouseleave="pointLeave(2,index)"
        />
      </div>
    </div>
    <div
      ref="cellBottom"
      class="cell-bottom"
    >
      <div
        v-for="(group, index) of point"
        :key="'group' + index"
        class="point-group"
      >
        <div
          ref="bottom0"
          class="point"
          :class="group[0] === 0 ? 'normal' : group[0] === 1 ? 'yellow' : 'red'"
          @mouseenter="pointEnter(0,index)"
          @mouseleave="pointLeave(0,index)"
        />
        <div
          ref="bottom1"
          class="point-small"
          :class="group[1] === 0 ? 'normal' : group[1] === 1 ? 'yellow' : 'red'"
          @mouseenter="pointEnter(1,index)"
          @mouseleave="pointLeave(1,index)"
        />
        <div
          ref="bottom2"
          class="point"
          :class="group[2] === 0 ? 'normal' : group[2] === 1 ? 'yellow' : 'red'"
          @mouseenter="pointEnter(2,index)"
          @mouseleave="pointLeave(2,index)"
        />
      </div>
    </div>
    <div class="cell-indexs">
      <div
        v-for="(group, index) of point"
        :key="'group' + index"
        class="cell-index"
      >

        {{ index }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DetailPoint',
  props: {
    lsit: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      point: [
        [0, 0, 0],
        [1, 0, 0],
        [2, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 2, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 1],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 2, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ]
    }
  },
  methods: {
    pointEnter(num, index) {
      this.$refs['top' + num][index].style.borderWidth = '2px'
      this.$refs['top' + num][index].style.borderColor = 'rgba(24, 186, 215, 1)'
      this.$refs['top' + num][index].style.background =
        'rgba(24, 186, 215, 0.4)'
      this.$refs['bottom' + num][index].style.borderWidth = '2px'
      this.$refs['bottom' + num][index].style.borderColor =
        'rgba(24, 186, 215, 1)'
      this.$refs['bottom' + num][index].style.background =
        'rgba(24, 186, 215, 0.4)'
    },
    pointLeave(num, index) {
      switch (this.point[index][num]) {
        case 0:
          this.$refs['top' + num][index].style.borderWidth = '1px'
          this.$refs['top' + num][index].style.borderColor =
            'rgba(255, 255, 255, 0.4)'
          this.$refs['top' + num][index].style.background =
            'linear-gradient(0deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))'
          this.$refs['bottom' + num][index].style.borderWidth = '1px'
          this.$refs['bottom' + num][index].style.borderColor =
            'rgba(255, 255, 255, 0.3)'
          this.$refs['bottom' + num][index].style.background =
            'rgba(255, 255, 255, 0.2)'
          break
        case 1:
          this.$refs['top' + num][index].style.borderColor =
            'rgba(237, 168, 46, 1)'
          this.$refs['top' + num][index].style.background =
            'rgba(237, 168, 46, 0.4)'
          this.$refs['bottom' + num][index].style.borderColor =
            'rgba(237, 168, 46, 1)'
          this.$refs['bottom' + num][index].style.background =
            'rgba(237, 168, 46, 0.4)'
          break
        case 2:
          this.$refs['top' + num][index].style.borderColor =
            'rgba(255, 47, 20, 1)'
          this.$refs['top' + num][index].style.background =
            'rgba(255, 47, 20, 0.4)'
          this.$refs['bottom' + num][index].style.borderColor =
            'rgba(255, 47, 20, 1)'
          this.$refs['bottom' + num][index].style.background =
            'rgba(255, 47, 20, 0.4)'
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.cell-demo {
  display: flex;
  flex-direction: column;
  height: 300px;
  transform-style: preserve-3d;
  perspective: 1000px;
  // background: rgba(40, 40, 40, 1);
  .cell-top {
    display: flex;
    padding: 4px 0 0 0;
    margin: 0 auto;
    height: 38px;
    width: calc(100% - 20px);
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.2);
    transform-origin: bottom center 20px;
    transform: rotateX(20deg) translateZ(20px);
    .point-small {
      margin: 7px 6% 0 6%;
      height: calc(100% - 7px);
    }
    .point,
    .point-small {
      border-left: 1px solid rgba(255, 255, 255, 0.4);
      border-right: 1px solid rgba(255, 255, 255, 0.4);
      border-top: 1px solid rgba(255, 255, 255, 0.4);
      background: linear-gradient(
        0deg,
        rgba(255, 255, 255, 0.15),
        rgba(255, 255, 255, 0.05)
      );
    }
  }
  .cell-bottom {
    display: flex;
    padding: 0 0 4px 0;
    margin: 0px auto;
    height: 22px;
    width: calc(100% - 20px);
    box-shadow: 0 1px 0 1px rgba(255, 255, 255, 0.3);
    transform: translateZ(20px);
    .point-small {
      margin: 0 6% 5px 6%;
      height: calc(100% - 7px);
    }
    .point,
    .point-small {
      border-left: 1px solid rgba(255, 255, 255, 0.4);
      border-right: 1px solid rgba(255, 255, 255, 0.4);
      border-bottom: 1px solid rgba(255, 255, 255, 0.4);
      background: rgba(255, 255, 255, 0.2);
    }
  }
  .cell-indexs {
    width: calc(100% - 20px);
    @include flex(flex-start, center);
    .cell-index {
      @include flex(center, center);

      width: calc(100% / 28);
    }
  }
  .point-group {
    display: flex;
    padding: 0 2px;
    height: 100%;
    width: calc(100% / 28);
    .point {
      height: 100%;
      width: 30%;
    }
    .point-small {
      width: 28%;
    }
    // .point:hover, .point-small:hover {
    //   border-width: 2px;
    //   border-color: rgba(24, 186, 215, 1);
    //   background: rgba(24, 186, 215, 0.4);
    // }
  }
  .cell-top .yellow,
  .cell-bottom .yellow {
    border-width: 2px;
    border-color: rgba(237, 168, 46, 1);
    background: rgba(237, 168, 46, 0.4);
  }
  .cell-top .red,
  .cell-bottom .red {
    border-width: 2px;
    border-color: rgba(255, 47, 20, 1);
    background: rgba(255, 47, 20, 0.4);
  }
}
</style>

