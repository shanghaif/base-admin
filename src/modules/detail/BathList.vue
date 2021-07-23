<template>
  <div id="module">
    <div class="title">{{ title }}</div>
    <div class="sub">{{ company }} / {{ factory }} / {{ area }}</div>

    <div class="filter">
      <ZSelect
        v-model="bathStatus.selected"
        class="filter-status"
        :list="bathStatus.status"
        text="电解槽状态"
      />
      <div class="filter-keyword">
        <input
          v-model="keyword"
          class="filter-keyword-input"
          type="text"
          placeholder="搜索电解槽..."
          @input="findKeyword()"
        >
        <p class="iconfont icon-search" />
      </div>
    </div>

    <div class="area">
      <Status
        v-if="bathData.length === 0"
        img="null"
        text="暂无电解槽信息"
      />

      <div
        v-for="(item, index) of bathData"
        v-else
        ref="bath"
        :key="index"
        class="bath"
        :class="item.isRunning ? '' : 'stopped'"
        @click="bathClick(index)"
      >
        <BathIcon
          class="bath-icon"
          :fill-color="item.bathColor"
        />
        <div class="bath-info">
          <div class="bath-name">{{ item.name }} {{ item.isRunning ? '' : '(停机)' }}</div>
          <div class="bath-point">
            <div
              v-for="(point, index2) of item.point"
              :key="index2"
              class="point"
            >
              <div
                class="point-value"
                :style="{color: point.value > 0 ? point.color : 'var(--theme)'}"
              >{{ point.value }}</div>
              {{ point.text }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Status from '@/components/Status'
import ZSelect from '@/components/ZSelect'
import BathIcon from '@/components/BathIcon'
export default {
  components: {
    Status,
    ZSelect,
    BathIcon
  },
  data() {
    return {
      title: '分区电解槽总览',
      company: '云南分公司',
      factory: '电解铝二厂',
      area: '二分区',
      bathStatus: { selected: 0, status: ['全部', '正常', '停机'] },
      bathData: [],
      keyword: ''
    }
  },
  mounted() {
    this.updateValue()
  },
  methods: {
    updateValue() {
      // 生成随机电解槽数据
      const randomCount = Math.floor(Math.random() * 20 + 1)
      const randomName = Math.floor(Math.random() * 100 + 1990)
      for (let i = 0; i < randomCount; i++) {
        const bath = {
          name: '电解槽' + (randomName + i),
          isRunning: i === 0 ? true : i === 3 ? false : Math.random() > 0.2,
          bathColor: 'rgba(255, 255, 255, 0.7)',
          point: [
            {
              text: '在线点位',
              value: Math.floor(Math.random() * 38 + 130),
              color: 'var(--theme)'
            },
            {
              text: '温度告警',
              value: i === 0 ? 0 : Math.floor(Math.random() * 20),
              color: 'var(--alarmB)'
            },
            {
              text: '设备异常',
              value: i === 1 ? 0 : Math.floor(Math.random() * 20),
              color: 'var(--alarmC)'
            },
            {
              text: '趋势预警',
              value: i === 2 ? 0 : Math.floor(Math.random() * 20),
              color: 'var(--alarmB)'
            }
          ]
        }
        this.$set(this.bathData, i, bath)
        setTimeout(() => {
          this.bathClick(0)
        }, 20)
      }
      // console.log(this.bathData);
    },
    bathClick(index) {
      if (this.bathData[index].isRunning) {
        for (let i = 0; i < this.bathData.length; i++) {
          this.$refs.bath[i].removeAttribute('style')
          this.$set(this.bathData[i], 'bathColor', 'rgba(255, 255, 255, 0.7)')
        }
        this.$refs.bath[index].style.boxShadow = 'inset 0 0 0 2px var(--theme)'
        this.$refs.bath[index].style.background = 'var(--theme-bg)'
        this.$set(this.bathData[index], 'bathColor', 'var(--theme)')
      }
    },
    findKeyword() {
      // console.log(this.keyword);
    }
  }
}
</script>

<style lang="scss" scoped>
#module {
  height: 100%;
}
.sub {
  margin: 10px 0;
}

.filter {
  display: flex;
  gap: 20px;
  margin: 6px auto 10px auto;
  width: 100%;
  &-status {
    width: 45%;
  }
  &-keyword {
    position: relative;
    height: 30px;
    width: 55%;
    &-input {
      height: 100%;
      width: 100%;
      padding: 8px 8px 8px 30px;
      font-size: 14px;
      outline: none;
      border: none;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.1);
    }
    .icon-search {
      position: absolute;
      top: 7px;
      left: 7px;
      opacity: 0.7;
    }
  }
}

.area {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 2px 8px;
  margin: 4px -8px 0 -8px;
  height: calc(100% - 58px);
  width: calc(100% + 16px);
  overflow-y: scroll;
  .bath {
    display: flex;
    gap: 14px;
    padding: 14px;
    width: 100%;
    align-items: center;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.1);
    cursor: pointer;
    transition: all ease, 0.3s;
    &:hover {
      transform: scale(1.03);
    }
    &-icon {
      width: 25%;
    }
    &-info {
      width: 75%;
      .bath-point {
        display: flex;
        .point {
          display: flex;
          flex-direction: column;
          padding: 8px 0 0 0;
          width: 25%;
          font-size: 12px;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.7);
          &-value {
            font-size: 22px;
            line-height: 36px;
            font-weight: 600;
            font-family: 'DIN';
          }
        }
      }
    }
  }
  .stopped {
    opacity: 0.5;
    cursor: default;
  }
}
</style>
