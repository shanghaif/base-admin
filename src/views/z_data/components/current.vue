<template>
  <div class="app-container">
    <div class="count-container">
      <div
        class="count-item blue"
        style="width: 32%"
      >
        <span>正常</span>
        <p class="count-num">6568</p>
        <i class="el-icon-success" />
      </div>
      <div
        class="count-item orange"
        style="width: 32%"
      >
        <span>温度告警</span>
        <p class="count-num">58</p>
        <i class="el-icon-warning" />
      </div>
      <div
        class="count-item red"
        style="width: 32%"
      >
        <span>趋势告警</span>
        <p class="count-num">31</p>
        <i class="el-icon-error" />
      </div>
    </div>

    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="请输入点位名称"
        style="width: 160px; margin-right: 10px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.company"
        placeholder="所属分公司"
        clearable
        style="width: 120px; margin-right: 10px"
        class="filter-item"
      >
        <el-option
          v-for="(item, index) in company"
          :key="item"
          :label="item"
          :value="index"
        />
      </el-select>
      <el-select
        v-model="listQuery.temperature"
        placeholder="温度状态"
        clearable
        style="width: 120px; margin-right: 10px"
        class="filter-item"
      >
        <el-option
          v-for="(item, index) in temperature"
          :key="item"
          :label="item"
          :value="index"
        />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        导出选择
      </el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        导出全部
      </el-button>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-refresh-right"
        @click="handleFilter"
      >
        刷新
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      fit
      highlight-current-row
      style="width: 100%;"
      :row-class-name="tempStatus"
      @sort-change="sortChange"
    >
      <el-table-column
        label=""
        prop="check"
        align="center"
        width="40px"
      >
        <template slot-scope="{row}">
          <el-checkbox :checked="check({row})" />
        </template>
      </el-table-column>
      <el-table-column
        label="点位名称"
        prop="id"
        sortable="custom"
        align="center"
        width="160px"
        :class-name="getSortClass('id')"
      >
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="所属分公司"
        align="center"
        width="120px"
      >
        <template slot-scope="{row}">
          <span>{{ company[row.company] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="所在电解槽"
        align="center"
        width="220px"
      >
        <template slot-scope="{row}">
          <span>{{ factory[row.factory] + ' ' + area[row.area] + ' 电解槽' + row.cell }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="当前温度"
        align="center"
        min-width="100px"
      >
        <template slot-scope="{row}">
          <span :style="{color: (row.tCurrent > 3000) ? '#ff2f14' : 'inherit'}">{{ row.tCurrent }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="最高温度"
        align="center"
        min-width="100px"
      >
        <template slot-scope="{row}">
          <span :style="{color: (row.tMax > 3500) ? '#ff2f14' : 'inherit'}">{{ row.tMax }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="最低温度"
        align="center"
        min-width="100px"
      >
        <template slot-scope="{row}">
          <span :style="{color: (row.tMin < 2000) ? '#ff2f14' : 'inherit'}">{{ row.tMin }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="平均温度"
        align="center"
        min-width="100px"
      >
        <template slot-scope="{row}">
          <span :style="{color: (row.tAvg > 3000) ? '#ff2f14' : 'inherit'}">{{ row.tAvg }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <!-- <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
// import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
// import Pagination from '@/components/Pagination' // secondary package based on el-pagination
// import { Random } from 'node_modules/mockjs/dist/mock'
// import '@/styles/table.scss'

export default {
  name: 'Current',
  // components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
    // typeFilter(type) {
    //   return calendarTypeKeyValue[type]
    // }
  },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 100,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        company: undefined,
        temp: undefined,
        sort: '+id'
      },
      company: ['云南分公司', '云南分公司', '云南分公司'],
      factory: ['一分厂', '二分厂', '三分厂', '四分厂'],
      area: ['一分区', '二分区', '三分区'],
      temperature: ['正常', '异常'],
      // importanceOptions: [1, 2, 3],
      // calendarTypeOptions,
      // sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      // statusOptions: ['published', 'draft', 'deleted'],
      // showReviewer: false,
      // temp: {
      //   id: undefined,
      //   company: 0,
      //   factory: 0,
      //   area: 0,
      //   cell: 0,
      //   ip: '192.168.0.0',
      //   point: ['', '', '', ''],
      //   net: 0,
      //   battery: 0.00,
      // },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      dialogPvVisible: false,
      pvData: [],
      // rules: {
      //   id: [{ required: true, message: '请填写设备 ID', trigger: 'change' }],
      //   model: [{ required: true, message: '请选择设备类型', trigger: 'change' }],
      //   company: [{ required: true, message: '请选择所在分公司', trigger: 'change' }],
      //   area: [{ required: true, message: '请选择所在分厂分区', trigger: 'change' }],
      //   cell: [{ required: true, message: '请填写电解槽编号', trigger: 'change' }],
      // },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      // this.list = []
      const level = ['A', 'B']
      const point = ['LEFT', 'MIDDLE', 'RIGHT']
      if (this.list.length === 0) {
        for (let i = 0; i < 20; i++) {
          const dev = {
            name: '',
            company: 0,
            factory: 0,
            area: 0,
            cell: 0,
            tCurrent: 0,
            tMax: 0,
            tMin: 0,
            tAvg: 0
          } // 设备
          dev.name =
            level[Math.floor(Math.random() * 2)] +
            Math.floor(Math.random() * 29) +
            '_' +
            point[Math.floor(Math.random() * 3)] // 名称
          dev.company = Math.floor(Math.random() * 3) // 分公司
          dev.factory = Math.floor(Math.random() * 4) // 分厂
          dev.area = Math.floor(Math.random() * 3) // 分区
          dev.cell = Math.floor(Math.random() * 3000) // 电解槽
          const temp = Math.random() * 1000 + 2200
          dev.tCurrent = temp.toFixed(2) // 当前温度
          dev.tMax = (temp + Math.random() * 500).toFixed(2) // 最高温度
          dev.tMin = (temp - Math.random() * 500).toFixed(2) // 最低温度
          dev.tAvg = (temp * (Math.random() * 0.3 + 0.7)).toFixed(2) // 平均温度
          this.list.push(dev)
        }
      }
      // fetchList(this.listQuery).then(response => {
      //   this.list = response.data.items
      //   this.total = response.data.total

      // Just to simulate the time of the request
      // setTimeout(() => {
      this.listLoading = false
      // }, 1.5 * 1000)
      // })
    },
    check({ row }) {
      return !(
        row.tCurrent < 3000 &&
        row.tMax < 3500 &&
        row.tMin > 2000 &&
        row.tAvg < 3000
      )
    },
    tempStatus({ row }) {
      return row.tCurrent < 3000 &&
        row.tMax < 3500 &&
        row.tMin > 2000 &&
        row.tAvg < 3000
        ? 'normal'
        : 'red'
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      // this.temp = {
      //   id: undefined,
      //   model: 0,
      //   company: 0,
      //   factory: 0,
      //   area: 0,
      //   cell: 0,
      //   ip: '192.168.0.0',
      //   point: ['', '', '', ''],
      //   net: 0,
      //   battery: 0.00,
      // }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          // createArticle(this.temp).then(() => {
          //   this.list.unshift(this.temp)
          //   this.dialogFormVisible = false
          //   this.$notify({
          //     title: 'Success',
          //     message: 'Created Successfully',
          //     type: 'success',
          //     duration: 2000
          //   })
          // })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          // updateArticle(tempData).then(() => {
          //   const index = this.list.findIndex(v => v.id === this.temp.id)
          //   this.list.splice(index, 1, this.temp)
          //   this.dialogFormVisible = false
          //   this.$notify({
          //     title: 'Success',
          //     message: 'Update Successfully',
          //     type: 'success',
          //     duration: 2000
          //   })
          // })
        }
      })
    },
    handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      // fetchPv(pv).then(response => {
      //   this.pvData = response.data.pvData
      //   this.dialogPvVisible = true
      // })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then((excel) => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map((v) =>
        filterVal.map((j) => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
    },
    getSortClass: function (key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
