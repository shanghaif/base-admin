<template>
  <el-card class="device-wrap">

    <div class="left">
      <el-button-group class="btns-wrap">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addNewNode"
        />
        <el-button
          type="primary"
          icon="el-icon-refresh-right"
          @click="refreshNode"
        />
        <el-button
          type="danger"
          icon="el-icon-delete"
          @click="delNode"
        />
      </el-button-group>

      <el-tree
        ref="tree"
        :props="props"
        :load="loadNode"
        :highlight-current="true"
        :check-on-click-node="true"
        lazy
        node-key="uid"
        @node-click="clickNode"
      />
    </div>
    <div
      v-if="currentNode.leaf"
      class="right"
    >
      <div class="count-container">
        <div
          class="count-item blue"
          style="width: 32%"
        >
          <span>设备总数</span>
          <p class="count-num">{{ total }}</p>
          <i class="el-icon-info" />
        </div>
        <div
          class="count-item gray"
          style="width: 32%"
        >
          <span>在线设备</span>
          <p class="count-num">936</p>
          <i class="el-icon-success" />
        </div>
        <div
          class="count-item red"
          style="width: 32%"
        >
          <span>离线设备</span>
          <p class="count-num">68</p>
          <i class="el-icon-warning" />
        </div>
      </div>

      <div class="filter-container">
        <el-input
          v-model="listQuery.point"
          placeholder="请输入关联点位"
          style="width: 160px; margin-right: 10px"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />

        <el-select
          v-model="listQuery.net"
          placeholder="状态"
          clearable
          style="width: 120px; margin-right: 10px"
          class="filter-item"
        >
          <el-option
            label="启用"
            value="1"
          />
          <el-option
            label="禁用"
            value="0"
          />
        </el-select>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
        >
          搜索
        </el-button>
        <el-button
          type="primary"
          @click="addNewDevice()"
        >增加设备</el-button>
        <el-button
          type="primary"
          @click="refreshDevice"
        >刷新</el-button>
        <el-button
          v-if="multipleSelection.length>0"
          type="danger"
        >删除已选</el-button>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-download"
          @click="handleDownload"
        >
          导出选择
        </el-button>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-download"
          @click="handleDownload"
        >
          导出全部
        </el-button>
      </div>
      <!-- <el-button-group>
        <el-button
          type="primary"
          @click="addNewDevice"
        >增加设备</el-button>
        <el-button
          type="primary"
          @click="refreshDevice"
        >刷新</el-button>
        <el-button
          v-if="multipleSelection.length>0"
          type="danger"
        >删除已选</el-button>
      </el-button-group> -->
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        :stripe="true"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
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
          prop="s_name"
          label="名称"
          width="120"
        >
          <template slot-scope="scope">

            <el-link
              type="primary"
              @click="addNewDevice(scope.row)"
            >{{ scope.row.s_name }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
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

        <el-table-column
          label="操作"
          width="160"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="addNewDevice(scope.row,scope.$index)"
            >
              <!-- <i class="el-icon-edit" /> -->
              编辑
            </el-button>
            <el-popconfirm
              title="确定删除该物模型吗？"
              @confirm="delDevice(scope.row,scope.$index)"
            >
              <el-button
                slot="reference"
                size="mini"
                type="danger"
              >
                <!-- <i class="el-icon-delete" /> -->
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
    </div>
    <devicel-dlg
      ref="DevicelDlg"
      :params="dlgData"
      :is-new="isNew"
      @refresh="refreshDevice"
    />
    <AddDeviceDlg
      ref="AddDeviceDlg"
      :new-device="isNew"
      :node="currentNode"
      :new-item="dlgData"
      @confirm="refreshDevice"
    />
  </el-card>
</template>

<script>
import {
  company,
  factory,
  area,
  cell,
  device,
  deleteThings,
  editThings,
  deviceStatus
} from '@/api/station'
import DevicelDlg from './components/DevicelDlg'
import AddDeviceDlg from './components/AddDeviceDlg'

export default {
  name: 'AddDevice',
  components: { DevicelDlg, AddDeviceDlg },
  filters: {
    statusFilter(type) {
      let res = ''
      if (type === 1) {
        res = '启用'
      } else if (type === -2) {
        res = '停用'
      } else if (type === -1) {
        res = '维护'
      }
      return res
    }
  },
  data() {
    return {
      total: 0,
      isNew: false,
      treeData: [],
      companyList: [],
      factoryList: [],
      areaList: [],
      cellList: [],
      deviceList: [],
      warningList: [],
      statusList: [],
      currentNode: {},
      listQuery: {
        page: 1,
        limit: 20,
        model: undefined,
        company: undefined,
        net: undefined,
        sort: '+id'
      },
      dlgData: {
        area: '',
        area_id: '',
        bath: '',
        bath_id: '',
        company: '',
        company_id: '',
        factory: '',
        factory_id: '',
        is_proxy: false,
        is_station: false,
        level: 1,
        model_id: '',
        protocol_path: null,
        proxy_thing_id: '',
        s_name: '',
        sno: 10,
        status_used: 1,
        uid: ''
      },
      tableData: [],
      multipleSelection: [],

      props: {
        label: 's_name',
        children: 'zones',
        isLeaf: 'leaf'
      },
      zDevices: [
        {
          desc: '',
          has_stream: false,
          is_edge_control: false,
          is_station: true,
          s_name: '测试站',
          uid: 'm_qzIuThYd42vqxz0lkp7nV'
        }
      ]
    }
  },
  computed: {
    isCheck() {
      return Object.keys(this.currentNode).length > 0
    }
  },

  created() {
    // 生命周期钩子：组件实例创建完成，属性已绑定，但 DOM 还未生成，el 属性还不存在
    // 初始化渲染页面
  },

  mounted() {
    // 生命周期钩子：模板编译、挂载之后（此时不保证已在 document 中）
  },
  methods: {
    handleFilter() {
      console.log('123 :>> ', 123)
    },
    handleDownload() {
      console.log('123 :>> ', 123)
    },
    addDeviceConfirmm() {
      console.log('123 :>> ', 123)
    },
    typeFunc(type) {
      let res = ''
      if (type === 1) {
        res = 'success'
      } else if (type === 0) {
        res = 'info'
      } else if (type === -1) {
        res = 'warning'
      }
      return res
    },
    changePage(page) {
      const id = this.currentNode.uid
      device(id, 1, page).then((res) => {
        this.tableData = res.data.result.devices || []
        this.total = res.data.result.devices_count
      })
    },
    delDevice(row) {
      deleteThings(row.uid)
        .then((res) => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.clickNode(this.currentNode)
        })
        .catch((err) => {
          alert(err)
        })
    },
    addNewNode(node) {
      if (this.isCheck) {
        console.log('node :>> ', node)
        this.$refs.tree.append(
          { s_name: '电解铝5厂', leaf: false },
          this.currentNode
        )
      }
    },
    refreshNode(node) {
      console.log('node :>> ', node)
    },
    delNode(node) {
      console.log('node :>> ', node)
    },

    refreshDevice() {
      debugger
      device(this.dlgData.bath_id, 1).then((res) => {
        this.tableData = res.data.result.devices || []
        this.total = res.data.result.devices_count
      })
    },

    // 当前点击的节点
    clickNode(node) {
      this.currentNode = node
      if (node.leaf) {
        console.log('node :>> ', node)
        this.dlgData.bath = node.s_name
        this.dlgData.bath_id = node.uid

        device(node.uid, 1).then((res) => {
          this.tableData = res.data.result.devices || []
          this.total = res.data.result.devices_count
        })
      }
    },
    // 点击树结构
    loadNode(node, resolve) {
      if (node.level === 0) {
        // 第一次加载
        company(1).then((res) => {
          this.companyList = res.data.result.stations
          resolve(this.companyList)
        })
      } else if (node.level === 1) {
        this.dlgData.company = node.data.s_name
        this.dlgData.company_id = node.data.uid
        const { uid } = node.data
        factory(uid, 1).then((res) => {
          this.factoryList = res.data.result.stations || []
          resolve(this.factoryList)
        })
      } else if (node.level === 2) {
        const { uid } = node.data
        this.dlgData.factory = node.data.s_name
        this.dlgData.factory_id = node.data.uid

        area(uid, 1).then((res) => {
          const data = res.data.result.stations || []
          return resolve(data)
        })
      } else if (node.level === 3) {
        const { uid } = node.data
        this.dlgData.area = node.data.s_name
        this.dlgData.area_id = node.data.uid

        cell(uid, 1).then((res) => {
          const data = res.data.result.stations || []
          data.map((v, i) => {
            return (v.leaf = true)
          })
          return resolve(data)
        })
      } else if (node.level === 4) {
        return resolve([])
      }
    },
    handleSelectionChange(item) {
      this.multipleSelection = item
    },
    // 编辑设备弹窗

    editDevice(item) {
      console.log('item :>> ', item)
      this.multipleSelection = item
      this.dlgData = item
      this.isNew = false
      this.$refs.DevicelDlg.show()
    },
    // 新增设备弹窗
    addNewDevice(item) {
      if (item) {
        this.isNew = false
        this.multipleSelection = item
        this.dlgData = item

        this.$refs.AddDeviceDlg.show()
      } else {
        this.isNew = true
        this.$refs.AddDeviceDlg.show()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-tree--highlight-current {
  .el-tree-node.is-current {
    & > .el-tree-node__content {
      background: #1890ff;
      color: #fff;
    }
  }
}
.device-wrap {
  min-height: calc(100vh - 84px);
  .btns-wrap {
    margin-bottom: 20px;
  }
}
.left {
  float: left;
  width: 240px;
  margin-right: 30px;
  height: 100%;
  min-height: calc(100vh - 84px);
  border-right: 1px solid #000;
}
.right {
  float: left;
  width: calc(100% - 270px);
}
</style>
