<template>
  <div class="app-container">
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="temp"
      label-position="left"
      label-width="120px"
      style="width: 600px"
    >
      <el-form-item label="告警信息">
        <el-input
          v-model="temp.msg"
          :autosize="{ minRows: 4, maxRows: 6}"
          type="textarea"
          placeholder="请编辑告警信息"
        />
      </el-form-item>
      <el-form-item label="推送时间">
        <el-select
          v-model="temp.time"
          class="filter-item"
          placeholder="请选择推送时间"
          style="width: 280px"
        >
          <el-option
            v-for="(item, index) in time"
            :key="item"
            :label="item"
            :value="index"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="推送渠道">
        <el-checkbox-group v-model="temp.channel">
          <el-checkbox
            v-for="(item, index) in channel"
            :key="item"
            :label="index"
          >{{ item }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="推送对象">
        <el-checkbox-group v-model="temp.person">
          <el-checkbox
            v-for="(item, index) in person"
            :key="item"
            :label="index"
          >{{ item }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="dialogFormVisible = false">
        取消
      </el-button>
      <el-button
        type="primary"
        @click="dialogStatus==='create'?createData():updateData()"
      >
        确定
      </el-button>
    </div>

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
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
// import Pagination from '@/components/Pagination' // secondary package based on el-pagination
// import { Random } from 'node_modules/mockjs/dist/mock'

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'Gateway',
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
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
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
        model: undefined,
        company: undefined,
        net: undefined,
        sort: '+id'
      },
      channel: ['微信', 'QQ', '钉钉', '短信'],
      person: ['张三', '李四', '王五', '赵六', '钱七'],
      time: [
        '02:00',
        '04:00',
        '06:00',
        '08:00',
        '10:00',
        '12:00',
        '14:00',
        '16:00',
        '18:00',
        '20:00',
        '22:00',
        '24:00'
      ],
      // importanceOptions: [1, 2, 3],
      // calendarTypeOptions,
      // sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      // statusOptions: ['published', 'draft', 'deleted'],
      // showReviewer: false,
      temp: {
        msg: '{{date}}, {{company}} {{factory}} 共发生告警 {{warning_count}} 次, 异常 {{abnormal_count}} 次, 已处理 {{fixed_count}} 次.',
        time: 0,
        channel: [0, 2, 3],
        person: [1, 2]
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        // id: [{ required: true, message: '请填写设备 ID', trigger: 'change' }],
        // model: [{ required: true, message: '请选择设备类型', trigger: 'change' }],
        // company: [{ required: true, message: '请选择所在分公司', trigger: 'change' }],
        // area: [{ required: true, message: '请选择所在分厂分区', trigger: 'change' }],
        // cell: [{ required: true, message: '请填写电解槽编号', trigger: 'change' }],
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      // fetchList(this.listQuery).then(response => {
      //   this.list = response.data.items
      //   this.total = response.data.total

      // Just to simulate the time of the request
      // setTimeout(() => {
      this.listLoading = false
      // }, 1.5 * 1000)
      // })
    },
    netStatus({ row }) {
      return row.net === 0 ? 'net-offline' : 'net-online'
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
      this.temp = {
        id: undefined,
        model: 0,
        company: 0,
        factory: 0,
        area: 0,
        cell: 0,
        ip: '192.168.0.0',
        point: ['', '', '', ''],
        net: 0,
        battery: 0.0
      }
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

<style>
.el-table .net-offline td {
  background: rgba(255, 47, 20, 0.1) !important;
}
</style>
