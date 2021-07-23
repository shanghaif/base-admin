<template>
  <div id="detail">
    <Background />
    <div class="top">
      <div class="main-title">
        <img
          :src="title.logo"
          class="main-title-logo"
        >
        <p class="main-title-text">{{ title.text }}</p>
      </div>
      <div class="update">
        数据更新时间: <p class="update-time">{{ updateTime }}</p>
      </div>
    </div>
    <div class="left">
      <BathList class="module" />
    </div>
    <div class="middle">
      <Point
        ref="point"
        class="module"
      />
    </div>
    <div class="right">
      <AlarmArea class="module" />
    </div>
    <div class="bottom">
      <Bath />
    </div>
    <div
      class="return"
      @click="returnClick()"
    >
      <div class="iconfont icon-arrow" />返回首页
    </div>
    <div
      class="iconfont icon-close"
      @click="closeClick()"
    />
  </div>
</template>

<script>
import Background from '@/modules/detail/Background'

import BathList from '@/modules/detail/BathList'
import AlarmArea from '@/modules/detail/AlarmArea'
import Bath from '@/modules/detail/Bath'

import Point from '@/modules/detail/Point'

export default {
  name: 'Detail',
  components: {
    Background,
    BathList,
    Point,
    AlarmArea,
    Bath
  },
  data() {
    return {
      title: {
        text: '新视智科温度监测系统',
        logo: require('@/assets/logo.svg')
      },
      updateTime: ''
    }
  },
  mounted() {
    this.updateTime = this.util.formatTime(new Date())
    window.onresize = this.resize
    this.autoSize()
  },
  methods: {
    autoSize() {
      // 自适应窗口大小
      const h = window.innerHeight / 900
      const w = window.innerWidth / 1600
      const rate = Math.floor((w < h ? w : h) / 0.01) / 100
      // let rate = 1
      document.getElementById('app').style.height = 100 / rate + 'vh'
      document.getElementById('app').style.width = 100 / rate + 'vw'
      document.getElementById('app').style.transform = 'scale(' + rate + ')'
      // console.log(rate, h, w);
    },
    resize() {
      this.autoSize()
      this.$nextTick(() => {
        this.$refs.point.chart.resize()
      })
    },
    refreshCharts() {
      // 更新图表颜色(测试用)
      this.$refs.point.draw()
    },
    returnClick() {
      window.history.go(-1)
    },
    closeClick() {
      // 关闭大屏
    }
  }
}
</script>

<style lang="scss" scoped>
#detail {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  padding: 30px;
  height: 100%;
  width: 100%;
  justify-content: space-around;
}
.top {
  position: absolute;
  width: 100%;
  z-index: 1;
  .main-title {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    letter-spacing: 2px;
    gap: 10px;
    &-logo {
      width: 40px;
    }
    &-text {
      font-size: 28px;
      font-weight: 600;
    }
  }
  .update {
    display: flex;
    padding: 10px 0 0 0;
    width: 100%;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.7);
    &-time {
      margin: auto 30px auto 6px;
      font-family: 'DIN', 'PingFang SC', 'Microsoft Yahei', sans-serif;
      font-weight: 600;
      color: var(--theme);
    }
  }
}
.left,
.right {
  position: relative;
  height: 66%;
  width: 28%;
  z-index: 1;
  .module {
    width: 100%;
  }
}
.middle {
  padding-top: 86px;
  margin: auto 20px;
  height: 66%;
  width: calc(44% - 40px);
  // background: rgba(255, 255, 255, 0.1);
  z-index: 1;
}
.bottom {
  padding-top: 20px;
  height: 34%;
  width: 100%;
  // background: rgba(255, 255, 255, 0.7);
  z-index: 1;
}

.return {
  position: absolute;
  display: flex;
  gap: 2px;
  padding: 13px;
  top: 0;
  left: 0;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  opacity: 0.3;
  transition: all ease, 0.3s;
  z-index: 3;
  &:hover {
    opacity: 1;
  }
  .icon-arrow {
    color: rgba(255, 255, 255, 0.7);
    transform: rotate(90deg);
  }
}
.icon-close {
  position: absolute;
  padding: 13px;
  top: 0;
  right: 0;
  font-size: 24px;
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  opacity: 0.3;
  transition: all ease, 0.3s;
  z-index: 3;
  &:hover {
    opacity: 1;
  }
}
</style>
