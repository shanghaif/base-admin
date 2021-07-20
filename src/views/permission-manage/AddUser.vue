<template>
  <el-card>
    <div>
      <el-button
        v-if="isShowBtn('add')"
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
        prop="nick_name"
        label="昵称"
        show-overflow-tooltip
      />
      <el-table-column
        sortable
        prop="role_name"
        label="角色"
        show-overflow-tooltip
      />
      <el-table-column
        v-if="false"
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
        v-if="isShowBtn('delete') || isShowBtn('edit')"
        label="操作"
        width="160"
      >
        <template slot-scope="scope">
          <el-button
            v-if="isShowBtn('edit')"
            size="mini"
            type="primary"
            @click="addUser(scope.row,scope.$index)"
          >
            <i class="el-icon-edit" />
            <!-- 编辑 -->
          </el-button>
          <!-- <el-popconfirm
            title="确定删除该用户吗？"
            @confirm="delUser(scope.row,scope.$index)"
          >
            <el-button
              slot="reference"
              :disabled="!isShowBtn('delete')"
              size="mini"
              type="danger"
            >
              删除

            </el-button>
          </el-popconfirm> -->
          <Poptip
            v-if="isShowBtn('delete')"
            placement="bottom"
            confirm
            transfer
            title="确定删除该用户吗？"
            @on-ok="delUser(scope.row,scope.$index)"
          >
            <el-button
              v-if="isShowBtn('delete')"
              size="mini"
              type="danger"
              class="ml-10"
            >
              <i class="el-icon-delete" />
            </el-button>
          </Poptip>
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
    <UserFormDlg
      ref="UserFormDlg"
      :is-new="isNewUser"
      :obj="userItem"
      :roles="roles"
      @confirm="formDlgConfirm"
    />

  </el-card>
</template>

<script>
import { mapState } from 'vuex'

import { queryUser, queryRole, deleteUser } from '@/api/user'
import UserFormDlg from './components/UserFormDlg'

export default {
  name: 'AddUser',
  components: { UserFormDlg },

  props: {},
  data() {
    return {
      total: 0,
      tableData: [],

      roles: [],
      page: 1,
      isNewUser: false,
      userItem: {}
    }
  },

  computed: {
    ...mapState({
      permissions: (state) => state.user.permissions
    }),
    isPermissions() {
      return this.permissions.find((v) => v.id === 'user').Permission
    }
  },
  watch: {},

  created() {
    // 生命周期钩子：组件实例创建完成，属性已绑定，但 DOM 还未生成，el 属性还不存在
    // 初始化渲染页面
    this.init()
  },

  mounted() {},

  methods: {
    init() {
      this.query()
    },
    isShowBtn(str) {
      return this.isPermissions.includes(str)
    },
    query() {
      const params = {
        page: this.page,
        size: 10
      }
      queryUser(params)
        .then((res) => {
          const { list, count } = (res.data && res.data.result) || []
          this.tableData = list
          this.total = count
        })
        .catch((err) => {
          alert(err)
        })
      queryRole(params)
        .then((res) => {
          const { list } = (res.data && res.data.result) || []
          this.roles = list
        })
        .catch((err) => {
          alert(err)
        })
    },
    formDlgConfirm(obj) {
      // if (this.isNewUser) {

      //   // updateUser(obj,'add').then(res=>{
      //   //   console.log('res :>> ', res);
      //   // })catch(err=>{

      //   // })
      // } else {
      //   const index = this.tableData.findIndex((item) => item.uid === obj.uid)
      //   this.tableData.splice(index, 1, obj)
      // }
      this.query()
    },
    addUser(item) {
      if (item) {
        this.isNewUser = false
        this.userItem = { ...item }
        this.$refs.UserFormDlg.$_show()
      } else {
        this.isNewUser = true
        this.userItem = {}

        this.$refs.UserFormDlg.$_show()
      }
    },
    delUser(row) {
      deleteUser(row.uid)
        .then((res) => {
          if (res.data.result) {
            this.$message({
              type: 'success',
              message: `删除用户成功`
            })
            this.query()
          } else {
            this.$message({
              type: 'error',
              message: `删除用户失败`
            })
          }
        })
        .catch((err) => {
          alert(err)
        })
    },
    changePage(page) {
      console.log('page :>> ', page)
    }
  }
}
</script>

<style lang="scss" scoped></style>
