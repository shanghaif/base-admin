<template>
  <div>
    <el-card class="box-card">
      <el-button-group>
        <el-button
          type="primary"
          @click="addNew"
        >新建物模型</el-button>
        <el-button type="primary">刷新</el-button>
      </el-button-group>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          label="日期"
          width="120"
        >
          <template slot-scope="scope">{{ scope.row.date }}</template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="120"
        />
        <el-table-column
          prop="address"
          label="地址"
          show-overflow-tooltip
        />
      </el-table>
      <Z-model-dlg ref="ZModelDlg" />

    </el-card>
  </div>
</template>

<script>
import ZModelDlg from './components/ZModelDlg'

export default {
  name: 'AddThings',
  components: {
    ZModelDlg
  },

  props: {},
  data() {
    return {
      tableData: [
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }
      ],
      multipleSelection: []
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
  },
  methods: {
    handleSelectionChange(val) {
      console.log('val :>> ', val)
    },
    addNew() {
      this.$refs.ZModelDlg.show()
    }
  }
}
</script>

<style lang="scss" scoped></style>
