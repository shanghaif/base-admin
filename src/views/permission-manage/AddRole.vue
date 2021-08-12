<template>
  <el-card>
    <div>
      <el-button
        v-if="isShowBtn('add')"
        type="primary"
        @click="addRole()"
      >增加角色</el-button>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      stripe
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
        width="120"
      />

      <el-table-column
        prop="permission"
        label="权限"
        show-overflow-tooltip
        width="360"
      >
        <template slot-scope="scope">
          <div
            v-for="(item,i) in scope.row.permission"
            :key="'tmodel' + i"
            class="permission-item"
          >
            <span class="permission-label">

              {{ item.id | permissionName }}
            </span>
            <span class="permission-cell">

              <el-tag
                v-for="(cell,j) in item.Permission"
                :key="'tmodel_child' + j"
                plain
              >{{ cell | btns }}</el-tag>

              <el-tag
                v-if="item.Permission.length <1"
                type="info"
                plain
              >无权限</el-tag>
            </span>
          </div>

        </template>
      </el-table-column>
      <el-table-column
        label="场站权限"
        show-overflow-tooltip
        align="top"
      >
        <template slot-scope="scope">

          <!-- <el-tree
            :data="getTreeData(scope.row.stations)"
            :props="defaultProps"
          /> -->
          <div
            v-if="isAllArea(scope.row.stations)"
            class="role-station"
            style="padding-left:40px"
          >

            <el-tag plain>{{ getTrFactory(scope.row.stations) }}</el-tag>
          </div>
          <div
            v-for="(cell,j) in scope.row.stations"
            :key="'tmodel_child' + j"
            class="role-station"
            :style="{'padding-left':(cell.level+1)*20 + 'px'}"
          >

            <el-tag plain>{{ cell.s_name }}</el-tag>
          </div>
          <div
            v-if="scope.row.stations.length < 1"
            class="role-station"
            style="padding-left:60px"
          >

            <el-tag
              plain
              type="info"
            >无权限</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="isShowBtn('edit') || isShowBtn('delete')"
        label="操作"
        width="160"
      >
        <template slot-scope="scope">
          <el-button
            v-if="isShowBtn('edit')"
            size="mini"
            type="primary"
            @click="addRole(scope.row,scope.$index)"
          >
            <i class="el-icon-edit" />
            <!-- 编辑 -->
          </el-button>
          <!-- <el-popconfirm
            title="确定删除该角色吗？"
            @confirm="delRole(scope.row,scope.$index)"
          >
            <el-button
              slot="reference"
              v-if="!isShowBtn('delete')"
              size="mini"
              type="danger"
              style="margin-left:10px"
            >
              删除

            </el-button>
          </el-popconfirm> -->
          <Poptip
            placement="bottom"
            confirm
            transfer
            title="确定删除该角色吗？"
            @on-ok="delRole(scope.row,scope.$index)"
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
    <RoleFormDlg
      ref="RoleFormDlg"
      :is-new="isNew"
      :obj="userItem"
      :tree-data="treeData"
      @confirm="formDlgConfirm"
    />
    <el-tree
      ref="tree"
      style="display:none"
      :props="props"
      :load="loadNode"
      show-checkbox
      :highlight-current="true"
      :check-on-click-node="true"
      :default-expanded-keys="expandedKeys"
      lazy
      node-key="uid"
    />
  </el-card>
</template>

<script>
import { mapState } from 'vuex'

import { queryRole, deleteRole } from '@/api/user'
import { company, factory, area, cell } from '@/api/station'

import RoleFormDlg from './components/RoleFormDlg'

export default {
  name: 'AddRole',
  components: { RoleFormDlg },
  filters: {
    btns(val) {
      let res = ''
      if (val === 'add') {
        res = '增加'
      } else if (val === 'delete') {
        res = '删除'
      } else if (val === 'edit') {
        res = '修改'
      } else if (val === 'view') {
        res = '查看'
      }
      return res
    },
    permissionName(val) {
      let res
      if (val === 'tmodel') {
        res = '物模型'
      } else if (val === 'protocol') {
        res = '协议'
      } else if (val === 'station') {
        res = '场站'
      } else if (val === 'thing') {
        res = '设备'
      } else if (val === 'user') {
        res = '用户'
      } else if (val === 'role') {
        res = '角色'
      }
      return res
    }
  },
  props: {},
  data() {
    return {
      total: 0,
      tableData: [],
      treeData: [],
      treeTr: [],
      companyList: [],
      factoryList: [],
      areaList: [],
      cellList: [],
      deviceList: [],
      expandedKeys: [],
      props: {
        label: 's_name',
        children: 'zones',
        isLeaf: 'leaf'
      },
      page: 1,
      isNew: false,
      userItem: null,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
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
      ],
      pageParams: {
        page: 1,
        size: 10
      }
    }
  },

  computed: {
    ...mapState({
      permissions: (state) => state.user.permissions
    }),
    isPermissions() {
      return this.permissions.find((v) => v.id === 'role').Permission
    }
  },
  watch: {},

  created() {
    // 生命周期钩子：组件实例创建完成，属性已绑定，但 DOM 还未生成，el 属性还不存在
    // 初始化渲染页面
  },

  mounted() {},

  methods: {
    init() {
      this.query()
    },
    isAllArea(arr) {
      if (arr.length < 1) {
        return false
      }
      const flag = arr.some((v) => v.level === 0 || v.level === 1)
      return !flag
    },
    getTrFactory(arr) {
      const len = arr.length
      if (len < 1) {
        return ''
      }
      const id = arr[len - 1].parent_id
      const f = this.factoryList[0].find((v) => v.uid === id)
      return f.s_name
    },
    stationPermissions(item) {},
    isShowBtn(str) {
      return this.isPermissions.includes(str)
    },
    query() {
      queryRole(this.pageParams)
        .then((res) => {
          const { list, count } = (res.data && res.data.result) || []
          this.tableData = list
          this.total = count
        })
        .catch((err) => {
          alert(err)
        })
    },
    // 构造树结构
    getAllTree() {
      const arr = []
      this.companyList.forEach((v, i) => {
        const company = { uid: v[i].uid, s_name: v[i].s_name }
        const children0 = []
        arr.push(company)
        const len0 = this.factoryList.length > 0
        len0 &&
          this.factoryList[i].forEach((f, j) => {
            const factory = { uid: f.uid, s_name: f.s_name }
            const children1 = []
            children0.push(factory)
            const len1 = this.areaList.length > 0

            len1 &&
              this.areaList[j].forEach((item, k) => {
                const area = { uid: item.uid, s_name: item.s_name }
                children1.push(area)
              })
            factory.children = children1
          })
        company.children = children0
      })
      this.treeData = arr
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        // 第一次加载
        company(1).then((res) => {
          const arr = (res.data.result && res.data.result.stations) || []
          this.companyList.push(arr)
          const keysArr = arr.map((v) => {
            return v.uid
          })
          this.expandedKeys = [...keysArr]

          resolve(arr)
        })
      } else if (node.level === 1) {
        const { uid } = node.data
        factory(uid, 1).then((res) => {
          console.log('工厂')

          const arr = (res.data.result && res.data.result.stations) || []
          this.factoryList.push(arr)

          const keysArr = arr.map((v) => {
            return v.uid
          })
          this.expandedKeys = [...keysArr]
          resolve(arr)
        })
      } else if (node.level === 2) {
        const { uid } = node.data

        area(uid, 1).then((res) => {
          console.log('分区')
          const arr = (res.data.result && res.data.result.stations) || []
          this.areaList.push(arr)

          const data = arr
          data.map((v, i) => {
            return (v.leaf = true)
          })
          this.init()

          return resolve(data)
        })
      } else if (node.level === 3) {
        const { uid } = node.data
        cell(uid, 1).then((res) => {
          const data = res.data.result.stations || []
          data.map((v, i) => {
            return (v.leaf = true)
          })
          return resolve(data)
        })
        // return resolve([])
      } else if (node.level === 4) {
        return resolve([])
      }
      setTimeout(() => {
        this.getAllTree()
      }, 1000)
    },

    formDlgConfirm(obj) {
      // if (this.isNew) {
      //   console.log('123 :>> ', 123)
      //   this.tableData.push(obj)
      // } else {
      //   const index = this.tableData.findIndex((item) => item.uid === obj.uid)
      //   this.tableData.splice(index, 1, obj)
      // }
      this.query()
    },
    addRole(item) {
      if (item) {
        this.isNew = false
        this.userItem = { ...item }
        this.$refs.RoleFormDlg.$_show()
      } else {
        this.isNew = true
        this.userItem = {}

        this.$refs.RoleFormDlg.$_show()
      }
    },

    delRole(row) {
      deleteRole(row.role_name)
        .then((res) => {
          if (res.data.result) {
            this.$message({
              type: 'success',
              message: `删除角色成功`
            })
            this.query()
          } else {
            const { message } = res.data.error
            this.$message({
              type: 'error',
              message
            })
          }
        })
        .catch((err) => {
          alert(err)
        })
    },
    changePage(page) {
      this.pageParams.page = page
      this.query()
    }
  }
}
</script>

<style lang="scss" scoped>
.role-station {
  margin-bottom: 10px;
}
.permission-item {
  margin-bottom: 10px;
}
.permission-label {
  width: 36px;
  text-align: right;
  display: inline-block;
}
.permission-cell {
  margin-left: 10px;
}
</style>
