<template>
  <div>
    <el-tree
      ref="tree"
      :props="props"
      :load="loadNode"
      :highlight-current="true"
      :check-on-click-node="true"
      :default-expanded-keys="expandedKeys"
      :expand-on-click-node="false"
      :current-node-key="currentId"
      lazy
      node-key="uid"
      @node-click="clickNode"
    />
  </div>
</template>

<script>
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
export default {
  name: 'StationTree',
  components: {},
  props: {
    currentId: { type: String, default: '' }
  },
  data() {
    return {
      currentNode: null,
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
      expandedKeys: [],
      companyList: [],
      factoryList: [],
      areaList: [],
      cellList: []
    }
  },
  computed: {},

  created() {
    // 生命周期钩子：组件实例创建完成，属性已绑定，但 DOM 还未生成，el 属性还不存在
    // 初始化渲染页面
  },

  mounted() {
    // 生命周期钩子：模板编译、挂载之后（此时不保证已在 document 中）
  },

  methods: {
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

          resolve(this.companyList)
        })
      } else if (node.level === 1) {
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

        area(uid, 1).then((res) => {
          const data = res.data.result.stations || []

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
    },
    // 当前点击的节点
    clickNode(node) {
      this.currentNode = node
      this.queryDeviceParams.uid = node.uid
      this.queryDeviceParams.level = node.level
      this.$emit('clickNode', node)
    }
  }
}
</script>

<style lang="scss" >
.el-tree--highlight-current {
  .el-tree-node.is-current {
    & > .el-tree-node__content {
      background: #1890ff;
      color: #fff;
    }
  }
}
</style>
