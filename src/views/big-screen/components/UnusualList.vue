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
          @click="detail(item)"
        >
          <div class="left">
            <!-- <div>{{ item.area }} / {{ item.name }}</div> -->
            <div>{{ item.Area }} / {{ item.Bath }}</div>
            <div class="reason">{{ item.thing_name }}：{{ item.alarm_id | t_type }}</div>
          </div>
          <div class="right">
            {{ $dayjs(item.AlarmTime).format('YYYY.MM.DD HH:mm:ss') }}
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
      <div
        v-show="isEmpty"
        class="b-text"
      >暂无数据</div>
    </div>
  </div>
</template>

<script>
import { warningAll } from '@/api/station'
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  name: 'UnusualList',
  filters: {
    t_type(val) {
      let res = ''
      if (val === 'temperature_high') {
        res = '温度告警'
      } else if (val === 'offline') {
        res = '离线'
      } else if (val === 'rate_high') {
        res = '趋势预警'
      } else if (val === 'abnormal') {
        res = '异常'
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
      isEmpty: false,
      page: 1,
      size: 8,
      chooseDate: {},
      list: [],
      noMoreList: [],
      tabList: [
        { text: '当前', type: 'now' },
        { text: '当日', type: 'day' },
        { text: '一周', type: 'week' },
        { text: '30天', type: 'month' }
      ]
    }
  },
  computed: {
    ...mapState({
      currentFactory: (state) => state.station.currentFactory
    }),
    noMore() {
      return this.noMoreList.length < this.size && this.noMoreList.length !== 0
    }
  },
  watch: {
    currentFactory: {
      handler(newName, oldName) {
        this.choose('now')
      },
      deep: true
    }
  },
  created() {},
  mounted() {},
  methods: {
    ...mapMutations({
      SET_ALARMITEM: 'station/SET_ALARMITEM',
      SET_ALARMLIST: 'station/SET_ALARMLIST'
    }),
    getDate(type) {
      let begin_time, end_time
      const obj = {}
      if (type === 'now') {
        begin_time = this.$dayjs()
          .subtract(3600, 'second')
          .format('YYYY-MM-DD HH:mm')
        end_time = this.$dayjs().format('YYYY-MM-DD HH:mm')
      } else if (type === 'day') {
        begin_time = this.$dayjs().format('YYYY-MM-DD') + ' 00:00'
        end_time = this.$dayjs().format('YYYY-MM-DD') + ' 23:59'
      } else if (type === 'week') {
        begin_time =
          this.$dayjs().subtract(7, 'day').format('YYYY-MM-DD') + ' 00:00'
        end_time = this.$dayjs().format('YYYY-MM-DD') + ' 23:59'
      } else if (type === 'month') {
        begin_time =
          this.$dayjs().subtract(30, 'day').format('YYYY-MM-DD') + ' 00:00'
        end_time = this.$dayjs().format('YYYY-MM-DD') + ' 23:59'
      }
      obj.end_time = end_time
      obj.begin_time = begin_time
      // obj.begin_time = '2021-06-01 15:48'
      // obj.end_time = '2021-06-25 16:48'
      this.chooseDate = obj
    },
    load(val) {
      if (!this.noMore) {
        // this.list.push({})
        this.page++
        this.queryWarning()
      }
    },
    styleStatus(val) {
      const obj = {}
      obj.hot = val === 'temperature_high'
      obj.error = val === 'rate_high'
      obj.error = val === 'abnormal'
      obj.warning = val === 'b'
      return obj
    },
    choose(val) {
      this.page = 1
      this.activeTab = val
      this.list = []
      this.getDate(val)
      this.queryWarning()
    },
    detail(item) {
      this.$router.push({ path: '/big-screen/detail' })
      this.SET_ALARMITEM(item)
    },
    async queryWarning() {
      this.loading = true
      this.isEmpty = false
      // {factory: true, tid, page, size: 8, begin_time, begin_time, alarm_id: 'all' }
      const obj = {
        begin_time: '',
        t_id: this.currentFactory.uid,
        page: this.page,
        size: this.size
      }
      if (this.activeTab === 'now') {
        obj.active = true
      }
      const res = await warningAll({ ...obj, ...this.chooseDate })
      this.noMoreList = (res.data.result && res.data.result.alarms) || []
      this.list = [...this.list, ...this.noMoreList]
      this.SET_ALARMLIST(this.list)
      if (this.list.length === 0) {
        this.isEmpty = true
      }
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.unusual-wrap {
  width: 100%;
  height: 65%;
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
