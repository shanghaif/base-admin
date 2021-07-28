<template>
  <div id="module">
    <div class="title">{{ title }}</div>
    <div class="sub">{{ alarmItem.Company }} / {{ alarmItem.Factory }} / {{ alarmItem.Area }}</div>
    <!-- <div class="content-crumbs">
      <div class="content-crumb">{{ alarmItem.Company }}</div>
      <div class="content-crumb">{{ alarmItem.Factory }}</div>
      <div class="content-crumb">{{ alarmItem.Area }}</div>
    </div> -->
    <div class="content-filter">

      <div class="content-select">

        <!-- <Select
          v-model="selectType"
          placeholder="所有状态"
          filterable
          @on-change="getType"
        >
          <Option
            v-for="item in cellTypeOptions"
            :key="item.value + '所有状态'"
            :value="item.value"
          >{{ item.label }}</Option>
        </Select> -->
        <ZSelect
          v-model="selectType"
          :list="cellTypeOptions"
          text="电解槽状态"
          @update="getType"
        />
      </div>
      <!-- <div class="content-search">
        <Select
          v-model="searchCell"
          placeholder="搜索电解槽"
          @on-change="getSearch"
        >
          <Option
            v-for="item in searchOptions"
            :key="item.value + '搜索电解槽'"
            :value="item.value"
          >{{ item.label }}</Option>
        </Select>
      </div> -->
      <div class="filter-keyword">
        <input
          v-model="searchCell"
          class="filter-keyword-input"
          type="text"
          placeholder="搜索电解槽..."
          @input="getSearch(searchCell)"
        >
        <p class="iconfont icon-search" />
      </div>
    </div>

    <div class="area">
      <Status
        v-if="list.length === 0"
        img="null"
        text="暂无电解槽信息"
      />

      <div
        v-for="(item, index) of list"
        v-else
        :key="index"
        class="bath"
        :class="{stopped:!item.isRunning,active:item.bath_id === currentbathID}"
        @click="bathClick(index,item)"
      >
        <BathIcon
          class="bath-icon"
          :fill-color="item.bath_id === currentbathID ? 'var(--theme)' : 'rgba(255, 255, 255, 0.7)'"
        />
        <div class="bath-info">
          <div class="bath-name">{{ item.name }} {{ item.isRunning ? '' : '(离线)' }}</div>
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
import { mapState, mapActions, mapMutations } from 'vuex'
import { cellInfo } from '@/api/station'

import Status from '@/components/Status'
// import ZSelect from '@/components/ZSelect'
import BathIcon from '@/components/BathIcon'
import { Socket } from '@/utils/socket'

export default {
  components: {
    Status,
    // ZSelect,
    BathIcon
  },
  data() {
    return {
      title: '分区电解槽总览',
      company: '云南分公司',
      factory: '电解铝二厂',
      area: '二分区',
      bathStatus: { selected: 0, status: ['全部', '正常', '离线'] },
      // list: [],
      // list: [],
      bathWs: null,
      currentBath: null,
      keyword: '',
      currentbathID: 0,

      data: [],
      list: [],
      // searchOptions: [],

      selectType: 'all',
      selectFreshTime: '',
      selectTime: '',
      searchCell: '',
      loading: false,
      cellTypeOptions: [
        { value: 'all', label: '全部' },
        { value: 'good', label: '正常' },
        { value: 'off', label: '离线' }
      ],
      cacheList: [],
      imgUrl: null,

      curCell: '10000'
    }
  },
  computed: {
    ...mapState({
      alarmItem: (state) => state.station.alarmItem
    }),

    searchOptions() {
      return this.list.map((item) => {
        return { value: `${item.name}`, label: `${item.name}` }
      })
    }
  },
  mounted() {
    this.currentBath = { ...this.alarmItem }
    this.currentbathID = this.currentBath.BathID
    this.sendWs()
  },
  beforeDestroy() {
    this.destroyWs()
  },
  methods: {
    buildData() {
      this.list = this.data.map((v) => {
        return {
          bath_id: v.bath_id,
          name: v.bath_name,
          isRunning: v.point_all > 0,
          bathColor: 'rgba(255, 255, 255, 0.7)',
          point: [
            {
              text: '在线点位',
              value: v.point_online,
              color: 'var(--theme)'
            },
            {
              text: '温度告警',
              value: v.point_temperature,
              color: 'var(--alarmB)'
            },
            {
              text: '设备异常',
              value: v.point_abnormal,
              color: 'var(--alarmC)'
            },
            {
              text: '趋势预警',
              value: v.point_rate,
              color: 'var(--alarmB)'
            }
          ]
        }
      })
      this.cacheList = this.list
      // this.searchOptions = this.list.map((item) => {
      //   return { value: `${item.name}`, label: `${item.name}` }
      // })
    },
    sendWs() {
      const url = '/area_info'
      const params = {
        url,

        data: {
          area_id: this.currentBath.AreaID
        }
      }
      this.bathWs = new Socket(params)
      this.bathWs.onmessage((data) => {
        console.log('data :>> ', data)
        this.data = data || []
        this.buildData()
      })
    },
    destroyWs() {
      this.bathWs && this.bathWs.destroy()
    },
    // 根据状态过滤
    getType(type) {
      if (type === 'off') {
        this.list = this.cacheList.filter((v) => !v.isRunning)
      } else if (type === 'good') {
        this.list = this.cacheList.filter((v) => v.isRunning)
      } else {
        this.list = this.cacheList
      }
    },
    getSearch(val) {
      this.getType(this.selectType)
      if (val) {
        this.list = this.list.filter((v) => {
          // return v.name === val
          return v.name.indexOf(val) > -1
        })
      }
    },
    bathClick(index, item) {
      // if (this.list[index].isRunning) {
      //   for (let i = 0; i < this.list.length; i++) {
      //     this.$refs.bath[i].removeAttribute('style')
      //     this.$set(this.list[i], 'bathColor', 'rgba(255, 255, 255, 0.7)')
      //   }
      //   this.$refs.bath[index].style.boxShadow = 'inset 0 0 0 2px var(--theme)'
      //   this.$refs.bath[index].style.background = 'var(--theme-bg)'
      //   this.$set(this.list[index], 'bathColor', 'var(--theme)')
      // }
      if (item.isRunning) {
        this.currentbathID = item.bath_id
        this.$emit('onClick', item)
      }
    },
    findKeyword() {
      // console.log(this.keyword);
    }
  }
}
</script>

<style lang="scss" scoped>
* {
  color: #fff;
}
#module {
  height: 100%;
}
.sub {
  margin: 10px 0;
}
.title {
  font-size: 24px;
  font-weight: 800;
  color: var(--theme);
}
.content-filter {
  @include flex(space-between, center);

  .content-select {
    width: 40%;
  }
  .content-search {
    // margin-left: 20px;
    width: 50%;
  }
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
  overflow-y: auto;
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
    &.active {
      box-shadow: inset 0 0 0 2px var(--theme);
      background: var(--theme-bg);
    }
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
