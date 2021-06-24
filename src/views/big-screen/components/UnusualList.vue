<template>
  <div class="unusual-wrap">
    <div class="chart-box-title">异常告警统计</div>

    <div class="tabs">
      <div
        v-for="(item,i) in tabList"
        :key="i + 'a'"
        class="tab"
        :class="{active:activeTab === item.type}"
        @click="choose(item.type)"
      >
        {{ item.text }}
      </div>

    </div>
    <div class="unusual-list-box">
      <!-- <ul class="infinite-list" v-infinite-scroll="load" style="overflow:auto">
        <li v-for="i in count" class="infinite-list-item">{{ i }}</li>
      </ul> -->
      <div
        v-infinite-scroll="load"
        class="unusual-list"
        :infinite-scroll-delay="500"
        :infinite-scroll-distance="0"
      >
        <div
          v-for="(item,i) in list"
          :key="i + 'b'"
          class="unusual-list-item"
          :class="styleStatus(item.alarm_id)"
        >
          <div class="left">
            <!-- <div>{{ item.area }} / {{ item.name }}</div> -->
            <div>一分区 / 电解槽2000</div>
            <div class="reason">{{ item.thing_name }}：{{ item.alarm_id | t_type }}</div>
          </div>
          <div
            class="right"
            @click="detail(item.t_id)"
          >
            {{ $dayjs(item.time * 1000).format('YYYY.MM.DD HH:mm:ss') }}
            <i class="el-icon-arrow-right" />
          </div>
        </div>

      </div>
      <div
        v-show="loading"
        class="b-text"
      >加载中...</div>
      <div
        v-show="noMore"
        class="b-text"
      >没有更多了</div>
    </div>
  </div>
</template>

<script>
import { warningAll } from '@/api/station'

export default {
  name: 'UnusualList',
  filters: {
    t_type(val) {
      let res = ''
      if (val === 'temperature_high') {
        res = '温度告警'
      }
      return res
    }
  },
  props: {
    // list: {
    //   type: Array,
    //   default() {
    //     return []
    //   }
    // }
  },
  data() {
    return {
      activeTab: 'now',
      loading: false,
      page: 1,
      size: 8,
      list: [],
      noMoreList: [],
      tabList: [
        { text: '当前', type: 'now' },
        { text: '当日', type: 'day' },
        { text: '一周', type: 'week' },
        { text: '30天', type: 'month' }
      ],
      list1: [
        {
          id: '10000',
          type: 'error',
          area: '一分区',
          name: '电解槽10000',
          reason: 'B37_LEFT: 趋势告警',
          time: '2021.05.19 13:49:50'
        },
        {
          id: 'b',
          type: 'warning ',
          area: '一分区',
          name: '电解槽2027',
          reason: 'A16_RIGHT: 通信异常',
          time: '2021.05.19 13:49:50'
        },
        {
          id: 'c',
          type: 'off',
          area: '一分区',
          name: '电解槽2027',
          reason: 'B06_RIGHT: 离线',
          time: '2021.05.19 13:49:50'
        },
        {
          id: 'd',
          type: 'hot',
          area: '一分区',
          name: '电解槽2027',
          reason: 'A01_MIDDLE: 温度过高',
          time: '2021.05.19 13:49:50'
        },
        {
          id: 'd',
          type: 'hot',
          area: '一分区',
          name: '电解槽2027',
          reason: 'A01_MIDDLE: 温度过高',
          time: '2021.05.19 13:49:50'
        },
        {
          id: 'd',
          type: 'hot',
          area: '一分区',
          name: '电解槽2027',
          reason: 'A01_MIDDLE: 温度过高',
          time: '2021.05.19 13:49:50'
        },
        {
          id: 'd',
          type: 'hot',
          area: '一分区',
          name: '电解槽2027',
          reason: 'A01_MIDDLE: 温度过高',
          time: '2021.05.19 13:49:50'
        },
        {
          id: 'd',
          type: 'hot',
          area: '一分区',
          name: '电解槽2027',
          reason: 'A01_MIDDLE: 温度过高',
          time: '2021.05.19 13:49:50'
        }
      ]
    }
  },
  computed: {
    noMore() {
      return this.noMoreList.length < this.size
    }
  },
  watch: {},
  created() {
    this.queryWarning()
  },

  methods: {
    load(val) {
      if (!this.noMore) {
        // this.list.push({})
        this.page++
        console.log('1 :>> ', 1)
        this.queryWarning()
      }
    },
    styleStatus(val) {
      const obj = {}
      obj.hot = val === 'temperature_high'
      obj.error = val === 'a'
      obj.warning = val === 'b'
      return obj
    },
    choose(val) {
      this.activeTab = val
    },
    detail(id) {
      this.$router.push({ path: '/big-screen/detail', query: { cell_id: id } })
    },
    async queryWarning() {
      this.loading = true
      const res = await warningAll(this.page)
      this.noMoreList = res.data.result
      this.list = [...this.list, ...this.noMoreList]
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.unusual-wrap {
  width: 100%;
  height: 70%;
  .tabs {
    margin-top: 15px;
    margin-bottom: 10px;
    display: flex;
    width: 100%;
    .tab {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 25%;
      height: 30px;
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
      font-size: 14px;
      cursor: pointer;
      &.active {
        background: $selfColor;
      }
    }
  }
  .b-text {
    color: #999;
    text-align: center;
    padding: 10px 0;
  }
  .unusual-list-box {
    height: 45vh;
    overflow: auto;
    padding-bottom: 3px;
  }
  .unusual-list {
    .unusual-list-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #fff;
      font-size: 12px;
      padding: 6px 12px;
      // height: 60px;
      margin-bottom: 10px;
      background: linear-gradient(
        90deg,
        rgba(214, 214, 214, 0.1),
        rgba(214, 214, 214, 0.3)
      );
      // cursor: pointer;
      cursor: default;
      &:last-child {
        margin-bottom: 0;
      }
      &.error,
      &.hot {
        background: linear-gradient(
          90deg,
          rgba(255, 47, 20, 0.1),
          rgba(255, 47, 20, 0.3)
        );

        .left {
          .reason {
            color: $err;
          }
        }
      }
      &.warning {
        background: linear-gradient(
          90deg,
          rgba(237, 168, 46, 0.1),
          rgba(237, 168, 46, 0.3)
        );

        .left {
          .reason {
            color: $yl;
          }
        }
      }
      .left {
        height: 100%;
        line-height: 24px;
        @include flex(space-between, flex-start);
        flex-direction: column;
        .reason {
          font-size: 16px;
          color: #fff;
        }
      }
      .right {
        white-space: nowrap;
        color: #ccc;
        .el-icon-arrow-right {
          &:hover {
            font-weight: bold;
            color: $selfColor;
          }
        }
      }
    }
  }
}
</style>
