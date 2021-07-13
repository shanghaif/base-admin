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
        prop="role_name"
        label="角色名"
        show-overflow-tooltip
      />

      <el-table-column
        prop="alarm_id"
        label="权限"
        show-overflow-tooltip
      >
        <template slot-scope="scope">

          <el-tag
            :type="typeFunc(scope.row.alarm_id)"
            plain
          >{{ scope.row.alarm_id | statusFilter }}</el-tag>
          <el-form>

            <el-form-item label="物模型权限">
              <el-checkbox-group v-model="form.type">
                <el-checkbox
                  v-for="(item,i) in curdList"
                  :key="'a1' + i"
                  :label="item.label"
                  :name="item.name"
                />

              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

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
      :is-new="isNew"
      :obj="userItem"
      @confirm="userFormDlgonfirm"
    />
  </el-card>
</template>

<script>
import { zModelPage } from '@/api/zmodel'
import userFormDlg from './components/userFormDlg'

const result = {
  count: 1,
  list: [
    {
      role_id: 1001,
      role_name: 'super',
      role_desc: '超级管理员',
      permission: [
        {
          id: 'tmodel',
          Permission: ['add', 'delete', 'edit', 'view']
        },
        {
          id: 'protocol',
          Permission: ['add', 'delete', 'edit', 'view']
        },
        {
          id: 'station',
          Permission: ['add', 'delete', 'edit', 'view']
        },
        {
          id: 'thing',
          Permission: ['add', 'delete', 'edit', 'view']
        },
        {
          id: 'user',
          Permission: ['add', 'delete', 'edit', 'view']
        },
        {
          id: 'role',
          Permission: ['add', 'delete', 'edit', 'view']
        }
      ],
      stations: [
        {
          uid: '93edbab4-9250-4347-ae49-f9e653a090f3',
          s_name: '电解铝三厂',
          lon: '',
          lat: '',
          desc: '',
          level: 1,
          area_id: 1,
          rule: null,
          parent_id: 'e7813a6f-528f-4bcd-8b26-b04471cdd3fa'
        },
        {
          uid: '57000a03-55a7-4b27-a2aa-7047ba607ff9',
          s_name: '一分区',
          lon: '',
          lat: '',
          desc: '',
          level: 2,
          area_id: 1,
          rule: null,
          parent_id: 'c727e71c-e31c-446e-92bd-5f4d8783cceb'
        }
      ]
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
      isNew: false,
      userItem: {},
      curdList: [
        {
          label: '增加',
          name: 'add'
        },
        {
          label: '删除',
          name: 'delete'
        },
        {
          label: '编辑',
          name: 'edit'
        },
        {
          label: '查看',
          name: 'view'
        }
      ]
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
