<template>
  <el-card>
    <div class="right">

      <div class="right-content">

        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          :stripe="true"
          max-height="600px"
        >
          <!-- <el-table-column
            type="selection"
            width="55"
          /> -->

          <!-- <el-table-column
            sortable
            prop="ID"
            label="id"
            show-overflow-tooltip
          /> -->
          <el-table-column
            sortable
            prop="OperaUser"
            label="用户名"
            show-overflow-tooltip
          />
          <el-table-column
            sortable
            prop="OperaAction"
            label="操作"
            show-overflow-tooltip
          />

          <el-table-column
            prop="OperaResult"
            label="操作结果"
            show-overflow-tooltip
            width="100"
          >
            <template slot-scope="scope">

              <el-tag
                :type="typeFunc(scope.row.OperaResult)"
                plain
              >{{ scope.row.OperaResult | statusFilter }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            sortable
            prop="UpdatedAt"
            label="时间"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ $dayjs(scope.row.UpdatedAt).format('YYYY-MM-DD hh:mm') }}

            </template>
          </el-table-column>

        </el-table>
        <div class="pagination-wrap">

          <el-pagination
            :hide-on-single-page="total < 10"
            background
            :page-sizes="[10, 100, 200, 500]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="changePage"
          />
        </div>
      </div>
    </div>

  </el-card>
</template>

<script>
import { Log } from '@/api/station'

export default {
  name: 'Log',
  components: {},
  filters: {
    statusFilter(type) {
      let res = ''
      if (type === 'success') {
        res = '成功'
      } else if (type === 'temperature_high') {
        res = '温度高'
      } else if (type === 'fail') {
        res = '失败'
      }
      return res
    }
  },
  props: {},
  data() {
    return {
      total: 0,
      tableData: [],
      queryParams: {
        page: 1,
        size: 10
      }
    }
  },

  computed: {},
  watch: {},

  created() {
    // 生命周期钩子：组件实例创建完成，属性已绑定，但 DOM 还未生成，el 属性还不存在
    // 初始化渲染页面
  },

  mounted() {
    // 生命周期钩子：模板编译、挂载之后（此时不保证已在 document 中）
    this.query()
  },

  methods: {
    async query() {
      const res = await Log(this.queryParams)
      this.tableData = (res.data.result && res.data.result.list) || []
      this.total = (res.data.result && res.data.result.count) || 0
    },
    changePage(page) {
      this.queryParams.page = page
      this.query()
    },
    handleSizeChange(size) {
      this.queryParams.page = 1
      this.queryParams.size = size
      this.query()
    },
    typeFunc(type) {
      let res = ''
      if (type === 'temperature_high') {
        res = 'danger'
      } else if (type === 0) {
        res = 'info'
      } else if (type === 'success') {
        res = 'success'
      } else if (type === 'fail') {
        res = 'danger'
      }
      return res
    }
  }
}
</script>

<style lang="scss" scoped></style>
