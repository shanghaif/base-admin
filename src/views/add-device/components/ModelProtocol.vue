<template>
  <div>
    <el-dialog
      title="接入协议"
      :visible.sync="dialogVisible"
      width="50%"
      :close-on-click-modal="false"
      :modal="false"
      top="10vh"
    >
      <ModelEditProtocol ref="ModelEditProtocol" />
      <el-button-group class="btns-wrap">

        <el-button
          type="primary"
          size="mini"
          @click="addProtocol"
        >
          新增
        </el-button>

      </el-button-group>
      <el-table
        :data="tableData"
        height="300"
        style="width: 98%"
      >
        <el-table-column
          prop="s_name"
          label="名称"
        />
        <el-table-column
          label="操作"
          width="160"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="editProtocol(scope.row,scope.$index)"
            >
              <!-- <i class="el-icon-edit" /> -->
              编辑
            </el-button>
            <el-popconfirm
              title="确定删除该协议吗？"
              @confirm="delProtocol(scope.row,scope.$index)"
            >
              <el-button
                slot="reference"
                size="mini"
                type="danger"
                style="margin-left:10px;"
              >
                <!-- <i class="el-icon-delete" /> -->
                删除

              </el-button>
            </el-popconfirm>
          </template>
        </el-table-column>

      </el-table>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="dialogVisible = false"
        >确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import ModelEditProtocol from './ModelEditProtocol'
export default {
  name: 'ModelProtocol',
  components: { ModelEditProtocol },

  props: {
    newItem: {
      type: Object,
      default() {
        return {}
      }
    },
    isNew: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dialogVisible: false
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
    show() {
      this.dialogVisible = true
    },
    addProtocol() {
      console.log('123 :>> ', 123)
      this.$refs.ModelEditProtocol.show()
    },
    delProtocol() {
      console.log('123 :>> ', 123)
    },
    editProtocol() {
      console.log('123 :>> ', 123)
      this.$refs.ModelEditProtocol.show()
    }
  }
}
</script>

<style lang="scss" scoped></style>
