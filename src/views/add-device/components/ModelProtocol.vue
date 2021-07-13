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
      <ModelEditProtocol
        ref="ModelEditProtocol"
        :is-new="isNewProtocol"
        :new-item="currentProtocol"
        @confirm="confirm"
      />
      <!-- <el-button-group
        v-if="list.length<1"
        class="btns-wrap"
      >

        <el-button
          type="primary"
          size="mini"
          @click="addProtocol"
        >
          新增
        </el-button>

      </el-button-group> -->
      <el-table
        :data="list"
        height="300"
        style="width: 98%"
      >
        <el-table-column
          prop="protocol_path"
          label="名称"
        />
        <el-table-column
          label="操作"
          width="100"
        >
          <template slot-scope="scope">
            <el-button
              :disabled="!isShowBtn('edit')"
              size="mini"
              type="primary"
              @click="editProtocol(scope.row,scope.$index)"
            >
              <!-- <i class="el-icon-edit" /> -->
              编辑
            </el-button>
            <!-- <el-popconfirm
              title="确定删除该协议吗？"
              @confirm="delProtocol(scope.row,scope.$index)"
            >
              <el-button
                slot="reference"
                size="mini"
                type="danger"
                style="margin-left:10px;"
              >
                <i class="el-icon-delete" />
                删除

              </el-button>
            </el-popconfirm> -->
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
          @click="save"
        >确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { mapState } from 'vuex'

import ModelEditProtocol from './ModelEditProtocol'
import {
  tmodelProtocol,
  updateTmodelProtocol,
  delTmodelProtocol
} from '@/api/zmodel'
import { param } from '@/utils'
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
      dialogVisible: false,
      isNewProtocol: false,
      list: [],
      currentProtocol: {}
    }
  },
  computed: {
    ...mapState({
      permissions: (state) => state.user.permissions
    }),
    isPermissions() {
      return this.permissions.find((v) => v.id === 'protocol').Permission
    },
    titleType() {
      return this.isNewProtocol ? '新增' : '编辑'
    }
  },
  watch: {},

  created() {
    // 生命周期钩子：组件实例创建完成，属性已绑定，但 DOM 还未生成，el 属性还不存在
    // 初始化渲染页面
  },

  mounted() {
    // 生命周期钩子：模板编译、挂载之后（此时不保证已在 document 中）
  },
  methods: {
    isShowBtn(str) {
      return this.isPermissions.includes(str)
    },
    confirm(data) {
      const obj = {
        protocol_path: data.protocol_path,
        param: data.paramStr
      }
      updateTmodelProtocol(obj, this.isNewProtocol)
        .then((res) => {
          if (res) {
            this.$refs.ModelEditProtocol.hide()

            this.$message({
              type: 'success',
              message: `${this.titleType}成功!`
            })
            this.queryProtocolList()
          } else {
            this.$message({
              type: 'error',
              message: `${this.titleType}失败!`
            })
          }
        })
        .catch((err) => {
          alert(err)
        })
    },
    save() {
      const params = {
        model_id: ''
      }
    },
    queryProtocolList() {
      tmodelProtocol()
        .then((res) => {
          // this.list = (res.data && res.data.result) || []
          this.list = [res.data.result]
        })
        .catch((err) => {
          alert(err)
        })
    },
    show() {
      this.dialogVisible = true
      this.queryProtocolList()
    },
    addProtocol() {
      console.log('123 :>> ', 123)
      this.isNewProtocol = true
      this.currentProtocol = {}
      this.$refs.ModelEditProtocol.show()
    },
    delProtocol(row) {
      delTmodelProtocol(row)
        .then((res) => {
          if (res.data.result === 'OK') {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.$refs.ModelEditProtocol.hide()

            this.queryProtocolList()
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
      console.log('123 :>> ', 123)
    },
    editProtocol(row) {
      console.log('123 :>> ', 123)
      this.isNewProtocol = false
      this.currentProtocol = {
        ...row,
        ...{ paramStr: JSON.stringify(row.param) }
      }
      this.$refs.ModelEditProtocol.show()
    }
  }
}
</script>

<style lang="scss" scoped></style>
