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
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <div class="unusual-list">
        <div
          v-for="(item,i) in list"
          :key="i + 'b'"
          class="unusual-list-item"
          :class="item.type"
          @click="detail(item.id)"
        >
          <div class="left">
            <div>{{ item.area }} / {{ item.name }}</div>
            <div class="reason">{{ item.reason }}</div>
          </div>
          <div class="right">
            {{ item.time }}
            <i class="el-icon-arrow-right" />
          </div>
        </div>

      </div>
    </el-scrollbar>
  </div>
</template>

<script>
export default {
  name: 'UnusualList',
  props: {},
  data() {
    return {
      activeTab: 'now',
      tabList: [
        { text: '当前', type: 'now' },
        { text: '当日', type: 'day' },
        { text: '一周', type: 'week' },
        { text: '30天', type: 'month' }
      ],
      list: [
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
  computed: {},
  watch: {},

  methods: {
    choose(val) {
      this.activeTab = val
    },
    detail(id) {
      this.$router.push({ path: '/big-screen/detail', query: { cell_id: id } })
    }
  }
}
</script>

<style lang="scss" scoped>
.unusual-wrap {
  width: 100%;

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
  .unusual-list {
    height: 45vh;
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
