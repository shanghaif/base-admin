<template>
  <div>
    <el-card class="box-card">
      <el-button-group>
        <el-button
          type="primary"
          @click="addNew"
        >新建物模型</el-button>
        <el-button
          type="primary"
          @click="refresh"
        >刷新</el-button>
        <el-button
          v-if="multipleSelection.length>0"
          type="danger"
        >删除已选</el-button>
      </el-button-group>
      <el-table
        ref="multipleTable"
        :data="zModels"
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
          prop="s_name"
          label="姓名"
          width="120"
        >
          <template slot-scope="scope">

            <el-link
              type="primary"
              @click="handleEdit(scope.row)"
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
              @click="handleEdit(scope.row,scope.$index)"
            ><i class="el-icon-edit" />编辑</el-button>
            <el-popconfirm
              title="确定删除该物模型吗？"
              @confirm="handleDelete(scope.row,scope.$index)"
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
      <Z-model-dlg ref="ZModelDlg" />

    </el-card>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

import ZModelDlg from './components/ZModelDlg'

export default {
  name: 'AddThings',
  components: {
    ZModelDlg
  },

  props: {},
  data() {
    return {
      tableData: [],
      multipleSelection: []
    }
  },
  computed: {
    ...mapState({
      zModels: (state) => state.zmodel.zModels
    })
  },
  watch: {},

  created() {
    // 生命周期钩子：组件实例创建完成，属性已绑定，但 DOM 还未生成，el 属性还不存在
    // 初始化渲染页面
  },

  mounted() {
    // 生命周期钩子：模板编译、挂载之后（此时不保证已在 document 中）
    this.refresh()
  },
  methods: {
    ...mapActions({
      getModel: 'zmodel/getModel',
      deleteModel: 'zmodel/deleteModel'
    }),
    refresh() {
      this.getModel()
    },
    handleSelectionChange(item) {
      this.multipleSelection = item
    },
    addNew() {
      this.$refs.ZModelDlg.show()
    },
    handleEdit(row, index) {
      this.$refs.ZModelDlg.show(row)
    },

    handleDelete(row, index) {
      this.deleteModel(row.uid)
        .then((res) => {
          if (res.status === 200 && res.data.result === null) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getModel()
          } else {
            this.$message({
              type: 'error',
              message: '删除失败!'
            })
          }
        })
        .catch((err) => {
          alert(err)
        })
    }
  }
}
</script>

<style lang="scss" scoped></style>
