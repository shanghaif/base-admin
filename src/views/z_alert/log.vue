<template>
  <div class="app-container">
    <div class="count-container">
      <div
        class="count-item blue"
        style="width: 32%"
      >
        <span>已完成</span>
        <p class="count-num">3462</p>
        <i class="el-icon-success" />
      </div>
      <div
        class="count-item gray"
        style="width: 32%"
      >
        <span>进行中</span>
        <p class="count-num">94568</p>
        <i class="el-icon-question" />
      </div>
      <div
        class="count-item red"
        style="width: 32%"
      >
        <span>未开始</span>
        <p class="count-num">574</p>
        <i class="el-icon-warning" />
      </div>
    </div>

    <div class="filter-container">
      <el-date-picker
        type="datetime"
        placeholder="选择搜索日期"
        style="width: 200px; margin-right: 10px"
      />
      <el-input
        v-model="listQuery.name"
        placeholder="请输入点位名称"
        style="width: 160px; margin: -2px 10px 0 0"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.company"
        placeholder="所属分公司"
        clearable
        style="width: 120px; margin: -2px 10px 0 0"
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
        v-model="listQuery.status"
        placeholder="告警类型"
        clearable
        style="width: 120px; margin: -2px 10px 0 0"
        class="filter-item"
      >
        <el-option
          v-for="(item, index) in status"
          :key="item"
          :label="item"
          :value="index"
        />
      </el-select>
      <el-select
        v-model="listQuery.process"
        placeholder="进度"
        clearable
        style="width: 120px; margin: -2px 10px 0 0"
        class="filter-item"
      >
        <el-option
          v-for="(item, index) in process"
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
        style="margin-top: 8px"
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
        style="margin-top: 8px"
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
        style="margin-top: 8px"
        @click="handleDownload"
      >
        导出全部
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
        prop="name"
        sortable="custom"
        align="center"
        width="140px"
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
        label="日期"
        align="center"
        min-width="160px"
      >
        <template slot-scope="{row}">
          <span>{{ row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="告警信息"
        align="center"
        min-width="100px"
      >
        <template slot-scope="{row}">
          <span>{{ status[row.status] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="负责人"
        align="center"
        min-width="100px"
      >
        <template slot-scope="{row}">
          <span>{{ person[row.person] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="进度"
        align="center"
        min-width="100px"
      >
        <template slot-scope="{row}">
          <span :style="{color: (row.process === 2) ? '#ff2f14' : (row.process === 0) ? '#1890FF' : 'inherit'}">{{ process[row.process] }}</span>
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
  name: 'History',
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
      status: ['温度异常', '趋势异常', '设备离线'],
      person: ['张三', '李四', '王五', '赵六', '钱七'],
      process: ['已完成', '进行中', '未开始'],
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
            date: 0,
            status: 0,
            person: 0,
            process: 0
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
          dev.date = '2021年6月1日 19:33:57' // 时间
          dev.status = Math.floor(Math.random() * 3) // 告警类型
          dev.person = Math.floor(Math.random() * 5) // 负责人
          dev.process = Math.floor(Math.random() * 3) // 进度
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
      return row.process === 2
    },
    tempStatus({ row }) {
      return row.process === 2 ? 'red' : row.process === 0 ? 'blue' : 'normal'
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
          //   const index = this.list.findIndex((v) => v.id === this.temp.id)
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
      // fetchPv(pv).then((response) => {
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
