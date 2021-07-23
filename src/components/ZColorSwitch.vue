<template>
  <div id="switch">
    <!-- <div class="info" @click="showSlider()"> -->
    {{ text }}
    <div
      ref="color"
      class="color"
    />
    <!-- </div> -->
    <div class="hsl-container">
      <div class="h-slider">
        <p class="h-slider-text">色相(H)</p>
        <input
          v-model="hslValue[0]"
          type="range"
          min="0"
          max="360"
          step="1"
          @change="slider()"
        >
        {{ hslValue[0] }}
      </div>
      <div class="s-slider">
        <p class="s-slider-text">饱和度(S)</p>
        <input
          v-model="hslValue[1]"
          type="range"
          min="0"
          max="100"
          step="1"
          @change="slider()"
        >
        {{ hslValue[1] }}%
      </div>
      <div class="l-slider">
        <p class="l-slider-text">明度(L)</p>
        <input
          v-model="hslValue[2]"
          type="range"
          min="0"
          max="100"
          step="1"
          @change="slider()"
        >
        {{ hslValue[2] }}%
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    text: String,
    varName: String
  },
  data() {
    return {
      show: false,
      hslValue: []
    }
  },
  mounted() {
    const color = getComputedStyle(document.body).getPropertyValue(this.varName)
    const value = color.split(',')
    this.$refs.color.style.background = color
    this.hslValue = [
      parseInt(value[0].slice(5)),
      parseInt(value[1].slice(1, -1)),
      parseInt(value[2].slice(1, -1))
    ]
  },
  methods: {
    showSlider() {
      this.show = !this.show
    },
    slider() {
      const color =
        'hsla(' +
        this.hslValue[0] +
        ', ' +
        this.hslValue[1] +
        '%, ' +
        this.hslValue[2] +
        '%, 1)'
      const color20 =
        'hsla(' +
        this.hslValue[0] +
        ', ' +
        this.hslValue[1] +
        '%, ' +
        this.hslValue[2] +
        '%, 0.2)'
      const color30 =
        'hsla(' +
        this.hslValue[0] +
        ', ' +
        this.hslValue[1] +
        '%, ' +
        this.hslValue[2] +
        '%, 0.3)'
      const color40 =
        'hsla(' +
        this.hslValue[0] +
        ', ' +
        this.hslValue[1] +
        '%, ' +
        this.hslValue[2] +
        '%, 0.4)'
      const color50 =
        'hsla(' +
        this.hslValue[0] +
        ', ' +
        this.hslValue[1] +
        '%, ' +
        this.hslValue[2] +
        '%, 0.5)'
      const bg =
        'hsla(' +
        this.hslValue[0] +
        ', ' +
        this.hslValue[1] +
        '%, ' +
        this.hslValue[2]
      this.$refs.color.style.background = color
      document.body.style.setProperty(this.varName, color)
      document.body.style.setProperty(this.varName + '-20', color20)
      document.body.style.setProperty(this.varName + '-30', color30)
      document.body.style.setProperty(this.varName + '-40', color40)
      document.body.style.setProperty(this.varName + '-50', color50)
      document.body.style.setProperty(
        this.varName + '-bg',
        'linear-gradient(90deg, ' + bg + '%, 0.1), ' + bg + '%, 0.3))'
      )
      console.log(
        this.varName + ': ',
        getComputedStyle(document.body).getPropertyValue(this.varName) +
          '\n' +
          this.varName +
          '-20: ',
        getComputedStyle(document.body).getPropertyValue(this.varName + '-20') +
          '\n' +
          this.varName +
          '-30: ',
        getComputedStyle(document.body).getPropertyValue(this.varName + '-30') +
          '\n' +
          this.varName +
          '-40: ',
        getComputedStyle(document.body).getPropertyValue(this.varName + '-40') +
          '\n' +
          this.varName +
          '-50: ',
        getComputedStyle(document.body).getPropertyValue(this.varName + '-50') +
          '\n' +
          this.varName +
          '-bg: ',
        getComputedStyle(document.body).getPropertyValue(this.varName + '-bg')
      )
      this.$parent.refreshCharts()
    }
  }
}
</script>

<style lang="scss" scoped>
#switch {
  position: relative;
  display: flex;
  font-size: 12px;
  align-items: center;
  justify-content: center;
  gap: 4px;
  &:hover .hsl-container,
  .hsl-container:hover {
    display: flex;
  }
  .color {
    height: 16px;
    width: 16px;
    border-radius: 2px;
    border: 1px solid rgba(255, 255, 255, 0.5);
  }
  .hsl-container {
    position: absolute;
    display: none;
    flex-direction: column;
    gap: 6px;
    padding: 10px;
    top: 16px;
    left: -100px;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    .h-slider,
    .s-slider,
    .l-slider {
      display: flex;
      font-size: 14px;
      gap: 10px;
      align-items: center;
      color: rgba(255, 255, 255, 0.7);
      &-text {
        width: 66px;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.7);
      }
      input {
        width: 140px;
      }
    }
  }
}
</style>
