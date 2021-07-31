<template>
  <el-card class="device-wrap">

    <div class="left">

      <el-button-group class="btns-wrap">
        <el-button
          :disabled="canAdd || !isShowBtn('add')"
          type="primary"
          icon="el-icon-plus"
          @click="addNewNode"
        />
        <el-button
          type="primary"
          icon="el-icon-refresh-right"
          @click="refreshNode"
        />
        <!-- <el-button
          type="primary"
          icon="el-icon-edit"
          @click="editNode"
        /> -->
        <el-button
          :disabled="!isShowBtn('delete')"
          type="danger"
          icon="el-icon-delete"
          @click="delNode"
        />
      </el-button-group>

      <el-tree
        :key="treeId"
        ref="tree"
        :props="props"
        :load="loadNode"
        :highlight-current="true"
        :check-on-click-node="true"
        :default-expanded-keys="expandedKeys"
        lazy
        node-key="uid"
        @node-click="clickNode"
      />
    </div>
    <div class="right">
      <div class="count-container">
        <div
          class="count-item blue"
          style="width: 32%"
        >
          <span>设备总数</span>
          <p class="count-num">{{ rightTopInfo.devices_count }}</p>
          <i class="el-icon-info" />
        </div>
        <div
          class="count-item gray"
          style="width: 32%"
        >
          <span>绑定设备数</span>
          <p class="count-num">{{ rightTopInfo.devices_online_count }}</p>
          <i class="el-icon-success" />
        </div>
        <div
          class="count-item red"
          style="width: 32%"
        >
          <span>解绑设备数</span>
          <p class="count-num">{{ rightTopInfo.devices_offline_count }}</p>
          <i class="el-icon-warning" />
        </div>
      </div>
      <!-- v-if="currentNode.leaf" -->
      <div class="right-content">

        <div class="filter-container">
          <!-- <el-input
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
          </el-select> -->
          <!-- <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleFilter"
          >
            搜索
          </el-button> -->
          <el-button
            v-if="isShowBtnDvice('add') && queryDeviceParams.level === 3"
            type="primary"
            @click="addNewDevice()"
          >增加设备</el-button>
          <el-button
            type="primary"
            @click="refreshDevice"
          >刷新</el-button>
          <!-- <el-button
            v-if="multipleSelection.length>0"
            type="danger"
          >删除已选</el-button> -->
          <!-- <el-button
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
          </el-button> -->
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
          <!-- <el-table-column
            type="selection"
            width="55"
          /> -->
          <el-table-column
            sortable
            prop="model_name"
            label="模型名称"
            show-overflow-tooltip
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
            label="设备名称"
            class-name="n-wrap"
            show-overflow-tooltip
          >
            <template slot-scope="scope">

              <el-link
                type="primary"
                @click="addNewDevice(scope.row)"
              >{{ scope.row.s_name }}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            v-if="false"
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
            v-if="isShowBtnDvice('delete') || isShowBtnDvice('edit')"
            label="操作"
            width="160"
          >
            <template slot-scope="scope">
              <el-button
                v-if="isShowBtnDvice('edit')"
                size="mini"
                type="primary"
                @click="addNewDevice(scope.row,scope.$index)"
              >
                <i class="el-icon-edit" />
                <!-- 编辑 -->
              </el-button>
              <!-- <el-popconfirm
                title="确定删除该物模型吗？"
                @confirm="delDevice(scope.row,scope.$index)"
              >
                <el-button
                  slot="reference"
                  :disabled="!isShowBtnDvice('delete')"
                  size="mini"
                  type="danger"
                >
                  
                  删除

                </el-button>
              </el-popconfirm> -->
              <Poptip
                placement="bottom"
                confirm
                transfer
                title="您确认删除这条内容吗？"
                @on-ok="delDevice(scope.row,scope.$index)"
              >
                <el-button
                  v-if="isShowBtnDvice('delete')"
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
      </div>
    </div>
    <!-- <DevicelDlg
      ref="DevicelDlg"
      :params="dlgData"
      :is-new="isNew"
      @refresh="refreshDevice"
    /> -->
    <AddDeviceDlg
      ref="AddDeviceDlg"
      :new-device="isNew"
      :node="currentNode"
      :new-item="dlgData"
      :bind-list="bindData"
      @confirm="confirmAddDeviceDlg"
    />
    <ModelEditStation
      ref="ModelEditStation"
      :is-new="isNewStation"
      :new-item="currentNode"
      @confirm="confirmStationDlg"
    />
  </el-card>
</template>

<script>
import { mapState } from 'vuex'

import {
  company,
  factory,
  area,
  cell,
  device,
  countDevice,
  deleteThings,
  editThings,
  bindList,
  deviceStatus
} from '@/api/station'
import { delStation } from '@/api/zmodel'

// import DevicelDlg from './components/DevicelDlg'
import AddDeviceDlg from './components/AddDeviceDlg'
import ModelEditStation from './components/ModelEditStation'
import groupBy from 'lodash/groupBy'

export default {
  name: 'AddDevice',
  components: { AddDeviceDlg, ModelEditStation },
  filters: {
    statusFilter(type) {
      let res = ''
      if (type === 1) {
        res = '绑定'
      } else if (type === -2) {
        res = '解绑'
      }
      return res
    }
  },
  data() {
    return {
      total: 0,
      treeId: 0,
      isNew: false,
      isNewStation: false,
      companyList: [],
      factoryList: [],
      areaList: [],
      cellList: [],
      deviceList: [],
      warningList: [],
      statusList: [],
      expandedKeys: [],
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
      bindData: [],
      multipleSelection: [],

      props: {
        label: 's_name',
        children: 'zones',
        isLeaf: 'leaf'
      },
      queryDeviceParams: {
        page: 1,
        size: 10,
        level: 0,
        uid: ''
      },
      rightTopInfo: {
        devices_count: 0,
        devices_offline_count: 0,
        devices_online_count: 0
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
    ...mapState({
      permissions: (state) => state.user.permissions
    }),
    isPermissions() {
      return (
        (this.permissions.length > 0 &&
          this.permissions.find((v) => v.id === 'station').Permission) ||
        false
      )
    },
    isPermissionsDevice() {
      return (
        (this.permissions.length > 0 &&
          this.permissions.find((v) => v.id === 'thing').Permission) ||
        false
      )
    },
    isCheck() {
      return Object.keys(this.currentNode).length > 0
    },
    isLeaf() {
      return this.currentNode.leaf === true
    },
    canAdd() {
      return !(this.isCheck && !this.isLeaf)
    }
  },

  created() {
    this.queryBindList()
  },

  mounted() {},
  methods: {
    queryBindList() {
      bindList()
        .then((res) => {
          this.bindData = res.data.result || []
        })
        .catch((err) => {
          this.$message({ type: 'error', message: err })
        })
    },
    isShowBtn(str) {
      return this.permissions.length > 0 && this.isPermissions.includes(str)
    },
    isShowBtnDvice(str) {
      return (
        this.permissions.length > 0 && this.isPermissionsDevice.includes(str)
      )
    },
    confirmAddDeviceDlg() {
      this.refreshDevice()
    },
    confirmStationDlg() {
      this.treeId++
    },
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
      } else if (type === -2) {
        res = 'warning'
      }
      return res
    },
    changePage(page) {
      const id = this.currentNode.uid
      // device(id, 1, page).then((res) => {
      //   this.tableData = res.data.result.devices || []
      //   this.total = res.data.result.devices_count
      // })
      this.queryDeviceParams.page = page
      this.queryCountDevice()
    },
    delDevice(row) {
      const uid = encodeURIComponent(row.uid)
      deleteThings(uid)
        .then((res) => {
          if (res.data.result === 'ok') {
            this.$message({
              type: 'success',
              message: '删除成功!',
              duration: 5000
            })
            this.clickNode(this.currentNode)
          } else {
            this.$message({
              type: 'error',
              message: '删除失败!',
              duration: 5000
            })
          }
        })
        .catch((err) => {
          alert(err)
        })
    },
    addNewNode(node) {
      this.isNewStation = true
      if (this.isCheck) {
        console.log('node :>> ', node)
        // this.$refs.tree.append(
        //   { s_name: '电解铝5厂', leaf: false },
        //   this.currentNode
        // )

        this.$refs.ModelEditStation.show()
      }
    },
    editNode(node) {
      this.isNewStation = false

      if (this.isCheck) {
        console.log('node :>> ', node)
        // this.$refs.tree.append(
        //   { s_name: '电解铝5厂', leaf: false },
        //   this.currentNode
        // )

        this.$refs.ModelEditStation.show()
      }
    },
    refreshNode(node) {
      console.log('node :>> ', node)
    },
    delNode(node) {
      console.log('node :>> ', node)
      this.$confirm('此操作将永久删除该场站, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delStation(this.currentNode.uid).then((res) => {
            if (res.data.result) {
              this.dialogVisible = false
              this.$message({
                type: 'success',
                message: `删除场站成功`,
                duration: 5000
              })
              this.dialogVisible = false
              this.treeId++
            } else {
              const message = res.data.error.message || '删除失败'
              this.$message({
                type: 'error',
                message,
                duration: 5000
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    refreshDevice() {
      this.queryCountDevice()
    },

    // 当前点击的节点
    clickNode(node) {
      this.currentNode = node
      // if (node.leaf) {
      //   console.log('node :>> ', node)
      //   this.dlgData.bath = node.s_name
      //   this.dlgData.bath_id = node.uid

      //   device(node.uid, 1).then((res) => {
      //     this.tableData = res.data.result.devices || []
      //     this.total = res.data.result.devices_count
      //   })
      // }
      this.dlgData.bath = node.s_name
      this.dlgData.bath_id = node.uid
      this.queryDeviceParams.uid = node.uid
      this.queryDeviceParams.level = node.level

      this.queryCountDevice()
    },
    queryCountDevice() {
      countDevice(this.queryDeviceParams)
        .then((res) => {
          this.tableData = (res.data.result && res.data.result.devices) || []
          this.total = (res.data.result && res.data.result.devices_count) || 0
          this.rightTopInfo = (res.data.result && res.data.result.info) || {
            devices_count: 0,
            devices_offline_count: 0,
            devices_online_count: 0
          }
        })
        .catch((err) => {
          this.$message({ type: 'error', message: err })
        })
    },
    // 点击树结构
    loadNode(node, resolve) {
      if (node.level === 0) {
        // 第一次加载
        company(1).then((res) => {
          this.companyList = res.data.result.stations
          const keysArr = this.companyList.map((v) => {
            return v.uid
          })
          this.expandedKeys = [...keysArr]
          this.queryDeviceParams.level = 0
          this.queryDeviceParams.uid =
            this.companyList.length > 0 && this.companyList[0].uid
          this.queryCountDevice()

          resolve(this.companyList)
        })
      } else if (node.level === 1) {
        this.dlgData.company = node.data.s_name
        this.dlgData.company_id = node.data.uid
        const { uid } = node.data
        factory(uid, 1).then((res) => {
          this.factoryList = res.data.result.stations || []
          const keysArr = this.factoryList.map((v) => {
            return v.uid
          })
          this.expandedKeys = [...keysArr]
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
        // return resolve([])
      } else if (node.level === 4) {
        return resolve([])
      }
    },
    handleSelectionChange(item) {
      this.multipleSelection = item
    },

    // 新增编辑设备弹窗
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
