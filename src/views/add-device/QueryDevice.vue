<template>
  <el-card>
    <div class="">

      <div class="filter-container">
        <StationTree @select="selectTree" />
        <!-- <el-input
          v-model="filterParams.device"
          placeholder="请输入设备名称"
          style="width: 160px; margin-right: 10px"
          class="filter-item"
        />

        <el-select
          v-model="filterParams.factory"
          placeholder="厂区"
          clearable
          style="width: 120px; margin-right: 10px"
          class="filter-item"
        >
          <el-option
            v-for="(item,i) in factoryList"
            :key="item.value + i"
            :label="item.label"
            :value="item.value"
          />

        </el-select>
        <el-select
          v-model="filterParams.status"
          placeholder="状态"
          clearable
          style="width: 120px; margin-right: 10px"
          class="filter-item"
        >
          <el-option
            v-for="(item,i) in statusList"
            :key="item.value + i"
            :label="item.label"
            :value="item.value"
          />

        </el-select> -->
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
        >
          搜索
        </el-button>

        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-download"
        >
          导出
        </el-button>

      </div>

      <el-table
        ref="multipleTable"
        v-loading="loading"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        :stripe="true"
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column
          type="selection"
          width="55"
        /> -->
        <el-table-column
          sortable
          prop="model_name"
          label="模型名称"
          show-overflow-tooltip
        />
        <el-table-column
          sortable
          prop="company"
          label="公司"
          show-overflow-tooltip
        />
        <el-table-column
          sortable
          prop="factory"
          label="厂区"
          show-overflow-tooltip
        />
        <el-table-column
          sortable
          prop="area"
          label="分区"
          show-overflow-tooltip
        />
        <el-table-column
          sortable
          prop="bath"
          label="电解槽"
          show-overflow-tooltip
        />
        <el-table-column
          sortable
          prop="s_name"
          label="设备名称"
          class-name="n-wrap"
          show-overflow-tooltip
        >
          <template slot-scope="scope">

            <el-link
              type="primary"
              @click="addNewDevice(scope.row)"
            >{{ scope.row.s_name }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          v-if="false"
          sortable
          prop="uid"
          label="id"
        />

        <el-table-column
          prop="status_used"
          label="状态"
          show-overflow-tooltip
          width="100"
        >
          <template slot-scope="scope">

            <!-- <el-link
              type="primary"
              @click="editDevice(scope.row)"
            >{{ scope.row.s_name }}</el-link> -->
            <el-tag
              :type="typeFunc(scope.row.status_used)"
              plain
            >{{ scope.row.status_used | statusFilter }}</el-tag>
          </template>
        </el-table-column>

      </el-table>
      <div class="pagination-wrap">

        <el-pagination
          :hide-on-single-page="total < 10"
          background
          layout="total, prev, pager, next"
          :total="total"
          @current-change="changePage"
        />
      </div>
    </div>
  </el-card>
</template>

<script>
import {
  company,
  factory,
  area,
  cell,
  device,
  countDevice,
  deleteThings,
  editThings,
  deviceStatus
} from '@/api/station'
import StationTree from '@/components/stationTree'
export default {
  name: 'QueryDevice',
  components: { StationTree },

  filters: {
    statusFilter(type) {
      let res = ''
      if (type === 1) {
        res = '绑定'
      } else if (type === -2) {
        res = '解绑'
      }
      return res
    }
  },

  data() {
    return {
      total: 1,
      loading: false,

      tableData: [],
      companyList: [],
      factoryList: [],
      areaList: [],
      cellList: [],
      queryDeviceParams: {
        page: 1,
        size: 10,
        level: 0,
        uid: ''
      },
      filterParams: {
        device: '',
        factory: '',
        status: ''
      },
      statusList: [
        { label: '绑定', value: 1 },
        { label: '解绑', value: -2 }
      ]
    }
  },
  computed: {},
  watch: {},

  created() {
    // 生命周期钩子：组件实例创建完成，属性已绑定，但 DOM 还未生成，el 属性还不存在
    // 初始化渲染页面
    // this.queryCompany()
    // this.queryCountDevice()
  },

  mounted() {
    // 生命周期钩子：模板编译、挂载之后（此时不保证已在 document 中）
  },

  methods: {
    selectTree(arr) {
      // this.queryDeviceParams.arr
      this.queryDeviceParams.page = 1
      this.queryDeviceParams.level = 3

      this.queryDeviceParams.uid = arr[3]
    },
    changePage(page) {
      this.queryDeviceParams.page = page
      this.queryCountDevice()
    },
    queryCompany() {
      company(1).then((res) => {
        this.companyList = (res.data.result && res.data.result.stations) || []
        this.queryDeviceParams.level = 0
        this.queryDeviceParams.uid =
          this.companyList.length > 0 && this.companyList[0].uid
        this.queryCountDevice()
      })
    },
    handleSelectionChange(item) {
      console.log('item :>> ', item)
    },
    handleFilter() {
      this.queryCountDevice()
    },
    queryCountDevice() {
      this.loading = true
      countDevice(this.queryDeviceParams)
        .then((res) => {
          this.tableData = (res.data.result && res.data.result.devices) || []
          this.total = (res.data.result && res.data.result.devices_count) || 0
          this.loading = false
        })
        .catch((err) => {
          this.loading = false

          this.$message({ type: 'error', message: err })
        })
    },
    typeFunc(type) {
      let res = ''
      if (type === 1) {
        res = 'success'
      } else if (type === 0) {
        res = 'info'
      } else if (type === -2) {
        res = 'warning'
      }
      return res
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-container {
  @include flex(flex-start, center);
}
</style>
