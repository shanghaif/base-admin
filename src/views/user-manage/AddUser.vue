<template>
  <el-card>
    <div>
      <el-button
        type="primary"
        @click="addUser()"
      >增加用户</el-button>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      :stripe="true"
    >
      <!-- <el-table-column
            type="selection"
            width="55"
          /> -->

      <el-table-column
        sortable
        prop="user_name"
        label="用户名"
        show-overflow-tooltip
      />
      <el-table-column
        sortable
        prop="role_name"
        label="角色"
        show-overflow-tooltip
      />
      <el-table-column
        prop="password"
        label="密码"
        show-overflow-tooltip
      />

      <!-- <el-table-column
        prop="alarm_id"
        label="状态"
        show-overflow-tooltip
        width="100"
      >
        <template slot-scope="scope">

          <el-tag
            :type="typeFunc(scope.row.alarm_id)"
            plain
          >{{ scope.row.alarm_id | statusFilter }}</el-tag>
        </template>
      </el-table-column> -->

      <el-table-column
        label="操作"
        width="160"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="addUser(scope.row,scope.$index)"
          >
            编辑
          </el-button>
          <el-popconfirm
            title="确定删除该用户吗？"
            @confirm="delUser(scope.row,scope.$index)"
          >
            <el-button
              slot="reference"
              size="mini"
              type="danger"
            >
              删除

            </el-button>
          </el-popconfirm>
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
    <userFormDlg
      ref="userFormDlg"
      :is-new="isNewUser"
      :obj="userItem"
      @confirm="userFormDlgonfirm"
    />
  </el-card>
</template>

<script>
import { zModelPage } from '@/api/zmodel'
import userFormDlg from './components/userFormDlg'

const result = {
  count: 4,
  list: [
    {
      uid: 1001,
      user_name: 'test0',
      nick_name: '测试',
      password: 'admin',
      email: '123@test.com',
      phone: '456',
      address: 'addr',
      role_id: 1001,
      role_name: 'super'
    },
    {
      uid: 20706957582464,
      user_name: '测试员1',
      nick_name: '测试测试',
      password: 'admin',
      email: '123@test.com',
      phone: '12345',
      address: '',
      role_id: 1001,
      role_name: 'super'
    }
  ]
}

export default {
  name: 'AddUser',
  components: { userFormDlg },

  props: {},
  data() {
    return {
      total: 0,
      tableData: [],
      page: 1,
      isNewUser: false,
      userItem: {}
    }
  },

  computed: {},
  watch: {},

  created() {
    // 生命周期钩子：组件实例创建完成，属性已绑定，但 DOM 还未生成，el 属性还不存在
    // 初始化渲染页面
    this.init()
  },

  mounted() {},

  methods: {
    init() {
      this.queryUser()
    },
    queryUser() {
      const params = {
        page: this.page,
        size: 10
      }
      zModelPage(params)
        .then((res) => {
          this.tableData = result.list
          this.total = result.count
        })
        .catch((err) => {
          alert(err)
        })
    },
    userFormDlgonfirm(obj) {
      if (this.isNewUser) {
        console.log('123 :>> ', 123)
        this.tableData.push(obj)
      } else {
        const index = this.tableData.findIndex((item) => item.uid === obj.uid)
        this.tableData.splice(index, 1, obj)
      }
    },
    addUser(item) {
      if (item) {
        this.isNewUser = false
        this.userItem = { ...item }
        this.$refs.userFormDlg.$_show()
      } else {
        this.isNewUser = true
        this.userItem = {}

        this.$refs.userFormDlg.$_show()
      }
    },
    delUser() {
      console.log('123 :>> ', 123)
    },
    changePage(page) {
      console.log('page :>> ', page)
    }
  }
}
</script>

<style lang="scss" scoped></style>
