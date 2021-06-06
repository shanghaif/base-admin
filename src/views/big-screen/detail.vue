<template>
  <div class="detail-wrap">
    <div class="wrap">
      <div class="content">
        <div class="content-top">
          <div class="detail-item detail-item-left">
            <div
              class="content-back"
              @click="goBack"
            ><i class="el-icon-arrow-left" />返回首页</div>
            <div class="chart-box-title">电解槽总览</div>
            <div class="content-crumbs">
              <div class="content-crumb">重庆分公司</div>
              <div class="content-crumb">电解铝二厂</div>
              <div class="content-crumb">一分区</div>
            </div>
            <div class="content-filter">
              <div class="content-select">
                <el-select
                  v-model="selectType"
                  placeholder="请选择"
                  class="screen-slect"
                  @change="getType"
                >
                  <el-option
                    v-for="item in cellTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
              <div class="content-search">
                <el-select
                  v-model="searchCell"
                  filterable
                  remote
                  reserve-keyword
                  clearable
                  placeholder="请输入关键词"
                  :remote-method="remoteMethod"
                  :loading="loading"
                  class="screen-slect"
                  @change="getSearch"
                >
                  <el-option
                    v-for="item in searchOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
            </div>
            <div class="detail-cells">
              <el-scrollbar wrap-class="detail-cells">
                <electrolyzer :list="list" />
              </el-scrollbar>
            </div>

          </div>
          <div class="detail-item detail-item-center">
            <div class="detail-item-center--top top">
              <div class="comp-name">神火集团 温度监测系统</div>
              <div class="update">
                <span>数据更新时间：</span>
                <span>{{ updateTime }}</span>
                <span class="update-text">更新频率：</span>

                <div class="content-select">
                  <el-select
                    v-model="selectFreshTime"
                    placeholder="请选择"
                    class="screen-slect"
                  >
                    <el-option
                      v-for="item in cellFreshTimeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </div>
              </div>
            </div>
            <div class="center-chart">
              <detail-line-chart id="detail_line_r" />

            </div>
          </div>
          <div class="detail-item detail-item-right" />
        </div>
      </div>
    </div>
  </div>
</template>

 
<script>
import Electrolyzer from './components/Electrolyzer'
import DetailLineChart from './components/DetailLineChart'

import _map from 'lodash/map'

function createData(len) {
  const arr = []
  while (len--) {
    const obj = {
      id: len,
      name: `电解槽${len}`,
      type: 'warning',
      dot: 168,
      temperatureDot: 1,
      trendDot: 0,
      unusualDot: 0
    }
    arr.push(obj)
  }
  return arr
}
export default {
  name: 'BigScreen',
  components: {
    Electrolyzer,
    DetailLineChart
  },

  data() {
    return {
      updateTime: this.$dayjs().format('YYYY/MM/DD hh:mm:ss'),
      cellTypeOptions: [
        { value: 'defual', label: '温度告警' },
        { value: 'warning', label: '趋势告警' },
        { value: 'yellow', label: '异常点位' }
      ],
      cellFreshTimeOptions: [
        { value: '10秒', label: '10秒' },
        { value: '30秒', label: '30秒' },
        { value: '1分钟', label: '1分钟' },
        { value: '5分钟', label: '5分钟' },
        { value: '10分钟', label: '10分钟' }
      ],

      searchOptions: [],
      list: [
        {
          id: '10000',
          name: '电解槽1',
          type: 'yellow',
          dot: 168,
          temperatureDot: 0,
          trendDot: 0,
          unusualDot: 1
        },
        {
          id: '10001',
          name: '电解槽2',
          type: 'defual',
          dot: 168,
          temperatureDot: 6,
          trendDot: 0,
          unusualDot: 1
        },
        {
          id: '10002',
          name: '电解槽3',
          type: 'warning',
          dot: 168,
          temperatureDot: 0,
          trendDot: 2,
          unusualDot: 0
        }
      ],

      selectType: '',
      selectFreshTime: '',
      selectTime: '',
      searchCell: '',
      loading: false,
      cacheList: []
      // list: createData(10)
    }
  },
  computed: {},
  created() {},
  mounted() {
    this.cacheList = this.list
    this.searchOptions = _map(this.list, 'name').map((item) => {
      return { value: `${item}`, label: `${item}` }
    })
  },
  destroyed() {},
  methods: {
    goBack() {
      this.$router.push({ path: '/big-screen' })
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.searchOptions = this.searchOptions.filter((item) => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.options = []
      }
    },
    getType(type) {
      console.log('type :>> ', type)
      this.list = this.cacheList.filter((v) => {
        return v.type === type
      })
    },
    getSearch(val) {
      if (!val) {
        this.list = this.cacheList
      } else {
        this.list = this.cacheList.filter((v) => {
          return v.name === val
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
$top-Height: 10vh;

.detail-wrap {
  height: 100%;
  color: #fff;
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
      height: 68%;
      @include flex(space-between, center);
      padding-top: 30px;
      .detail-item {
        height: 100%;
        .content-filter {
          @include flex(flex-start, center);
          width: 100%;
          margin-bottom: 15px;
          .content-select {
            width: 140px;
          }
          .content-search {
            margin-left: 20px;
          }
        }
        &.detail-item-left {
          width: 20%;
          ::v-deep .el-scrollbar {
            height: 100%;
          }
          ::v-deep .el-scrollbar__wrap {
            overflow: auto;
          }
          .content-back {
            margin-bottom: 24px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            &:hover {
              text-decoration: underline;
              color: $defaultColor;
            }
          }

          .content-crumbs {
            @include flex(flex-start, center);
            line-height: 32px;
            font-size: 14px;
            .content-crumb {
              &:after {
                content: '/';
                // color: #fff;
                padding: 0 6px;
              }
              &:last-child {
                &::after {
                  content: '';
                }
              }
            }
          }

          .detail-cells {
            width: 390px;
            height: 430px;
            padding: 15px;
            background: rgba(255, 255, 255, 0.04);
          }
        }
        &.detail-item-center {
          width: 50%;
          .detail-item-center--top {
            @include flex();
            flex-direction: column;
            .update {
              @include flex(flex-start, center);
            }
            .update-text {
              margin-left: 20px;
            }
          }
        }
        &.detail-item-right {
          width: 20%;
        }
      }
    }
  }
}
</style>
