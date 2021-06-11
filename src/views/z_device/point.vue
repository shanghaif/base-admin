<template>
  <div class="app-container">
    <div class="count-container">
      <div
        class="count-item blue"
        style="width: 32%"
      >
        <span>设备总数</span>
        <p class="count-num">41004</p>
        <i class="el-icon-info" />
      </div>
      <div
        class="count-item gray"
        style="width: 32%"
      >
        <span>在线设备</span>
        <p class="count-num">30936</p>
        <i class="el-icon-success" />
      </div>
      <div
        class="count-item red"
        style="width: 32%"
      >
        <span>离线设备</span>
        <p class="count-num">10068</p>
        <i class="el-icon-warning" />
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
        v-model="listQuery.net"
        placeholder="网络状态"
        clearable
        style="width: 120px; margin-right: 10px"
        class="filter-item"
      >
        <el-option
          v-for="(item, index) in net"
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
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        添加设备
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
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      fit
      highlight-current-row
      style="width: 100%;"
      :row-class-name="netStatus"
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
        label="设备 ID"
        prop="id"
        sortable="custom"
        align="center"
        width="100px"
        :class-name="getSortClass('id')"
      >
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="点位名称"
        align="center"
        min-width="160px"
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
        min-width="220px"
      >
        <template slot-scope="{row}">
          <span>{{ factory[row.factory] + ' ' + area[row.area] + ' 电解槽' + row.cell }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="关联网关"
        align="center"
        width="120px"
      >
        <template slot-scope="{row}">
          <span>{{ row.gateway }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="网络状态"
        align="center"
        width="80px"
      >
        <template slot-scope="{row}">
          <span :style="{color: (row.net === 0) ? '#ff2f14' : 'inherit'}">{{ net[row.net] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="180px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row,$index}">
          <el-button
            type="primary"
            size="mini"
            @click="handleUpdate(row)"
          >
            编辑
          </el-button>
          <el-button
            v-if="row.status!='deleted'"
            size="mini"
            type="danger"
            @click="handleDelete(row,$index)"
          >
            删除
          </el-button>
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

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="120px"
        style="width: 400px; margin-left: 50px;"
      >
        <el-form-item
          label="设备 ID"
          placeholder="请填写设备 ID"
          prop="id"
        >
          <el-input
            v-model="temp.id"
            :disabled="dialogStatus==='create'?false:true"
          />
        </el-form-item>
        <el-form-item
          label="点位名称"
          placeholder="请填写点位名称"
          prop="name"
        >
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item
          label="所属分公司"
          prop="company"
        >
          <el-select
            v-model="temp.company"
            class="filter-item"
            placeholder="请选择所在分公司"
            style="width: 280px"
          >
            <el-option
              v-for="(item, index) in company"
              :key="item"
              :label="item"
              :value="index"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="所在分厂分区"
          prop="area"
        >
          <el-select
            v-model="temp.factory"
            class="filter-item"
            placeholder="请选择分厂"
            style="width: 130px; margin-right: 20px"
          >
            <el-option
              v-for="(item, index) in factory"
              :key="item"
              :label="item"
              :value="index"
            />
          </el-select>
          <el-select
            v-model="temp.area"
            class="filter-item"
            placeholder="请选择分区"
            style="width: 130px"
          >
            <el-option
              v-for="(item, index) in area"
              :key="item"
              :label="item"
              :value="index"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="所在电解槽"
          placeholder="请填写电解槽编号"
          prop="cell"
        >
          <el-input v-model="temp.cell" />
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
    </el-dialog>

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
  name: 'Point',
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
        model: undefined,
        company: undefined,
        net: undefined,
        sort: '+id'
      },
      model: ['网关设备0', '网关设备1', '网关设备2'],
      company: ['云南分公司', '云南分公司', '云南分公司'],
      factory: ['一分厂', '二分厂', '三分厂', '四分厂'],
      area: ['一分区', '二分区', '三分区'],
      net: ['离线', '在线'],
      // importanceOptions: [1, 2, 3],
      // calendarTypeOptions,
      // sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      // statusOptions: ['published', 'draft', 'deleted'],
      // showReviewer: false,
      temp: {
        id: undefined,
        name: '',
        company: 0,
        factory: 0,
        area: 0,
        cell: 0,
        ip: '192.168.0.0',
        gateway: '',
        net: 0
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
        id: [{ required: true, message: '请填写设备 ID', trigger: 'change' }],
        name: [
          { required: true, message: '请填写点位名称', trigger: 'change' }
        ],
        company: [
          { required: true, message: '请选择所在分公司', trigger: 'change' }
        ],
        area: [
          { required: true, message: '请选择所在分厂分区', trigger: 'change' }
        ],
        cell: [
          { required: true, message: '请填写电解槽编号', trigger: 'change' }
        ]
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
      // this.list = []
      const devId = Math.floor(Math.random() * 1000)
      const level = ['A', 'B']
      const point = ['LEFT', 'MIDDLE', 'RIGHT']
      if (this.list.length === 0) {
        for (let i = 0; i < 20; i++) {
          const dev = {
            id: 0,
            name: '',
            company: 0,
            factory: 0,
            area: 0,
            cell: 0,
            gateway: 0,
            net: 0
          }
          dev.id = devId + i // 设备
          dev.name =
            level[Math.floor(Math.random() * 2)] +
            Math.floor(Math.random() * 29) +
            '_' +
            point[Math.floor(Math.random() * 3)] // 名称
          dev.company = Math.floor(Math.random() * 3) // 分公司
          dev.factory = Math.floor(Math.random() * 4) // 分厂
          dev.area = Math.floor(Math.random() * 3) // 分区
          dev.cell = Math.floor(Math.random() * 3000) // 电解槽
          dev.gateway = Math.floor(devId * i * Math.random()) // 关联网关
          dev.net = Math.floor(Math.random() * 2) // 网络
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
      return row.net === 0
    },
    netStatus({ row }) {
      return row.net === 0 ? 'red' : 'normal'
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
        name: '',
        company: 0,
        factory: 0,
        area: 0,
        cell: 0,
        ip: '192.168.0.0',
        gateway: '',
        net: 0
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
