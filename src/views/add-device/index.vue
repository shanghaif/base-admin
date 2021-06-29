<template>
  <el-card class="device-wrap">

    <div class="left">
      <el-button-group class="btns-wrap">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addNew"
        />
        <el-button
          type="primary"
          icon="el-icon-refresh-right"
          @click="refresh"
        />
        <el-button
          type="danger"
          icon="el-icon-delete"
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
    <div class="right">
      <el-button-group>
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
      </el-button-group>
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
        <!-- <el-table-column
          label="日期"
          width="120"
        >
          <template slot-scope="scope">{{ scope.row.date }}</template>
          <el-link type="primary">主要链接</el-link>
        </el-table-column> -->
        <el-table-column
          prop="s_name"
          label="名称"
          width="120"
        >
          <template slot-scope="scope">

            <el-link
              type="primary"
              @click="editDevice(scope.row)"
            >{{ scope.row.s_name }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          sortable
          prop="uid"
          label="id"
          show-overflow-tooltip
        />

        <el-table-column
          prop="desc"
          label="说明"
          show-overflow-tooltip
        />
        <el-table-column
          prop="catalog_name"
          label="分类"
          show-overflow-tooltip
        />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="editDevice(scope.row,scope.$index)"
            ><i class="el-icon-edit" />编辑</el-button>
            <el-popconfirm
              title="确定删除该物模型吗？"
              @confirm="delDevice(scope.row,scope.$index)"
            >
              <el-button
                slot="reference"
                size="mini"
                type="danger"
              >
                <i class="el-icon-delete" />删除

              </el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        :hide-on-single-page="total < 10"
        background
        layout="prev, pager, next"
        :total="total"
        @current-change="changePage"
      />
    </div>
    <devicel-dlg
      ref="DevicelDlg"
      :params="dlgData"
      :is-new="isNew"
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

export default {
  name: 'AddDevice',
  components: { DevicelDlg },

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
      currentDevice: {},
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
    addNew(node) {
      if (this.isCheck) {
        console.log('node :>> ', node)
        this.$refs.tree.append(
          { s_name: '电解铝5厂', leaf: false },
          this.currentNode
        )
      }
    },

    refreshDevice(node) {
      console.log('111 :>> ', 111)
    },
    refresh(node) {
      console.log('111 :>> ', 111)
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

    loadNode(node, resolve) {
      if (node.level === 0) {
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
      this.multipleSelection = item
      this.dlgData = item
      this.isNew = false
      this.$refs.DevicelDlg.show()
    },
    // 新增设备弹窗
    addNewDevice() {
      this.dlgData = {}
      this.isNew = true
      this.$refs.DevicelDlg.show()
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
