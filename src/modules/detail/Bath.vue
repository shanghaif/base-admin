<template>
  <div id="module">
    <div class="title">电解槽点位详情
      <div class="sub">{{ company }} / {{ factory }} / {{ area }} / {{ bath }}</div>
    </div>
    <div
      v-for="(bath, bIndex) of ['A', 'B']"
      :key="bIndex"
      class="bath"
    >
      <div class="bath-name">{{ bath }}</div>
      <div
        v-for="(part, index) of ['top', 'bottom']"
        :key="index"
        :class="'bath-' + part"
      >
        <div
          v-for="(group, gIndex) of pointData[bIndex]"
          :key="gIndex"
          class="point-group"
        >
          <div
            v-for="(point, pIndex) of pointGroup"
            :ref="part + bIndex + pIndex"
            :key="pIndex"
            class="point"
            :class="group[pIndex].hasDevice ? group[pIndex].alarm + ' ' + group[pIndex].size : 'none ' + group[pIndex].size"
            @mouseenter="pointEnter(group[pIndex].hasDevice, bIndex, pIndex, gIndex)"
            @mouseleave="pointLeave(bIndex, pIndex, gIndex)"
            @click="pointClick(group[pIndex].hasDevice, bIndex, pIndex, gIndex)"
          >

            <div
              v-if="index === 1"
              v-show="group[pIndex].showPop"
              class="pop"
            >
              <div class="pop-name">{{ group[pIndex].name }}</div>
              <div class="pop-status">告警状态:
                <p :class="group[pIndex].alarm + '-text'"> {{ group[pIndex].text }}</p>
              </div>
              <div class="pop-temp">当前温度:
                <p :class="group[pIndex].alarm + '-text'"> {{ group[pIndex].temp }}</p>
              </div>
              <div class="pop-arrow" />
            </div>
          </div>

          <div
            v-if="index === 1"
            class="group-num"
          >{{ gIndex }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Bath',
  data() {
    return {
      bathList: ['A', 'B'],
      pointGroup: ['normal', 'small', 'normal'],
      pointData: [],
      pointTotal: 168,
      company: '云南分公司',
      factory: '电解铝二厂',
      area: '二分区',
      bath: '电解槽2001'
    }
  },
  mounted() {
    const alarmStatus = [
      'null',
      'null',
      'null',
      'null',
      'null',
      'null',
      'offline',
      'tempHigh',
      'trend',
      'abnormal'
    ]
    const alarmText = [
      '正常',
      '正常',
      '正常',
      '正常',
      '正常',
      '正常',
      '离线',
      '温度告警',
      '趋势预警',
      '设备异常'
    ]
    const groupCount = this.pointTotal / this.pointGroup.length // 点位组合数
    let item = []
    for (let i = 0; i < groupCount; i++) {
      const g = []
      for (let j = 0; j < this.pointGroup.length; j++) {
        const alarmRandom = Math.floor(Math.random() * 10)
        const p = {
          name: 'run@' + Math.floor(Math.random() * 114514.191981) + '.exe',
          temp: Math.floor(Math.random() * 10000 + 25000) / 100,
          hasDevice: Math.random() > 0.2,
          alarm: alarmStatus[alarmRandom],
          text: alarmText[alarmRandom],
          size: this.pointGroup[j],
          selected: false,
          showPop: false
        }
        g.push(p)
      }
      item.push(g)
      if (i === groupCount / 2 - 1) {
        this.$set(this.pointData, 0, item)
        item = []
      }
      if (i === groupCount - 1) {
        this.$set(this.pointData, 1, item)
      }
    }
  },
  methods: {
    pointEnter(hasDevice, bIndex, pIndex, gIndex) {
      if (hasDevice) {
        this.$refs['top' + bIndex + pIndex][gIndex].style.borderColor =
          'var(--theme)'
        this.$refs['top' + bIndex + pIndex][gIndex].style.borderWidth = '2px'
        this.$refs['top' + bIndex + pIndex][gIndex].style.background =
          'var(--theme-50)'
        this.$refs['top' + bIndex + pIndex][gIndex].style.cursor = 'pointer'
        this.$refs['bottom' + bIndex + pIndex][gIndex].style.borderColor =
          'var(--theme)'
        this.$refs['bottom' + bIndex + pIndex][gIndex].style.borderWidth = '2px'
        this.$refs['bottom' + bIndex + pIndex][gIndex].style.background =
          'var(--theme-50)'
        this.$refs['bottom' + bIndex + pIndex][gIndex].style.cursor = 'pointer'
        this.$set(this.pointData[bIndex][gIndex][pIndex], 'showPop', true)
      }
    },
    pointLeave(bIndex, pIndex, gIndex) {
      this.$set(this.pointData[bIndex][gIndex][pIndex], 'showPop', false)
      if (!this.pointData[bIndex][gIndex][pIndex].selected) {
        this.$refs['top' + bIndex + pIndex][gIndex].removeAttribute('style')
        this.$refs['bottom' + bIndex + pIndex][gIndex].removeAttribute('style')
      }
    },
    pointClick(hasDevice, bIndex, pIndex, gIndex) {
      if (hasDevice) {
        const groupCount = this.pointTotal / this.pointGroup.length / 2
        for (let i = 0; i < 2; i++) {
          for (let j = 0; j < groupCount; j++) {
            for (let k = 0; k < this.pointGroup.length; k++) {
              this.$set(this.pointData[i][j][k], 'selected', false)
              this.pointLeave(i, k, j)
            }
          }
        }
        this.$set(this.pointData[bIndex][gIndex][pIndex], 'selected', true)
        this.pointEnter(true, bIndex, pIndex, gIndex)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#module {
  height: 100%;
  width: 100%;
}
.title {
  display: flex;
  gap: 14px;
  align-items: flex-end;
}

.bath {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 0 30px 30px 60px;
  margin: auto 0 0 0;
  transform-style: preserve-3d;
  perspective: 1000px;

  &-name {
    position: absolute;
    top: calc(50% - 10px);
    left: 10px;
    font-size: 20px;
    font-family: 'DIN';
  }

  &-top {
    display: flex;
    gap: 8px;
    padding: 4px 4px 0 4px;
    margin: 0 auto;
    height: 38px;
    width: 100%;
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.2);

    transform-style: preserve-3d;
    perspective: 1000px;
    transform-origin: bottom center 20px;
    transform: rotateX(20deg) translateZ(20px);
    .point {
      opacity: 0.6;
      border-style: solid solid none solid;
    }
    .small {
      margin: 7px 0 0 0;
      max-height: calc(100% - 7px);
    }
  }

  &-bottom {
    display: flex;
    gap: 8px;
    padding: 0 4px 4px 4px;
    margin: 0px auto;
    height: 22px;
    width: 100%;
    box-shadow: 0 1px 0 1px rgba(255, 255, 255, 0.3);
    transform: translateZ(20px);
    .point {
      border-style: none solid solid solid;
    }
    .small {
      margin: 0 0 5px 0;
      max-height: calc(100% - 5px);
    }
  }
  .point-group {
    position: relative;
    display: flex;
    gap: 6%;
    padding: 0 2px;
    height: 100%;
    width: calc(100% / 28);
    .point {
      position: relative;
      height: 100%;
      width: 30%;
    }
    .group-num {
      position: absolute;
      // left: calc(50% - 20px);
      bottom: -32px;
      width: 100%;
      font-size: 20px;
      font-family: 'DIN';
      text-align: center;
    }
  }
  .none {
    border-color: rgba(255, 255, 255, 0.08);
    border-width: 1px;
    background: rgba(255, 255, 255, 0.08);
  }
  .null {
    border-color: rgba(255, 255, 255, 0.2);
    border-width: 1px;
    background: rgba(255, 255, 255, 0.2);
  }
  .offline {
    border-color: var(--alarmA);
    border-width: 1.8px;
    background: var(--alarmA-40);
  }
  .abnormal {
    border-color: var(--alarmC);
    border-width: 2px;
    background: var(--alarmC-50);
  }
  .tempHigh,
  .trend {
    border-color: var(--alarmB);
    border-width: 2px;
    background: var(--alarmB-50);
  }
}

.pop {
  position: absolute;
  padding: 14px;
  top: -134px;
  left: calc(50% - 88px);
  width: 180px;
  border-radius: 4px;
  background: rgba(50, 50, 50, 0.85);
  box-shadow: 0 20px 10px -20px rgba(0, 0, 0, 0.6);
  z-index: 10;
  &-arrow {
    position: absolute;
    left: 82px;
    bottom: -7px;
    height: 14px;
    width: 14px;
    background: linear-gradient(
      45deg,
      rgba(50, 50, 50, 0.85) 50%,
      transparent 50%
    );
    transform: rotate(-45deg);
  }
  &-name {
    margin-bottom: 12px;
  }
  &-status,
  &-temp {
    display: flex;
    gap: 6px;
    margin-top: 8px;
    // font-size: 18px;
    color: rgba(255, 255, 255, 0.7);
    p {
      display: flex;
      // font-size: 18px;
      font-weight: 800;
      font-family: 'DIN', 'PingFang SC', 'Microsoft Yahei', sans-serif;
    }
  }
  &-temp > p:after {
    display: inline-block;
    content: '°C';
    font-size: 12px;
    margin: 0 auto auto 0;
  }
  .null-text {
    color: var(--theme);
  }
  .offline-text {
    color: var(--alarmA);
  }
  .abnormal-text {
    color: var(--alarmC);
  }
  .tempHigh-text,
  .trend-text {
    color: var(--alarmB);
  }
}
</style>
