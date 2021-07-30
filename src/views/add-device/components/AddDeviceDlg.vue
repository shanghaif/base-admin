<template>
  <div class="device-dlg-wrap">
    <el-dialog
      :title="`${titleType}设备`"
      :visible.sync="dialogVisible"
      :width="newDevice ? '60%' : '40%'"
      :close-on-click-modal="false"
      @closed="closed"
    >
      <ModelThings
        ref="ModelThings"
        :is-new="isNew"
        :new-item="activeModel"
        @confirm="ThingsConfirm"
      />
      <ModelProtocol ref="ModelProtocol" />
      <!-- 左侧表单 -->
      <div
        v-if="newDevice"
        class="device-dlg-left"
      >

        <div class="device-dlg-title">温度传感器</div>
        <el-button-group class="btns-wrap">
          <el-button
            type="primary"
            size="mini"
            @click="editProtocol"
          >
            协议接入
          </el-button>
          <el-button
            v-if="isShowBtn('add')"
            type="primary"
            size="mini"
            @click="addThings()"
          >
            新增
          </el-button>

        </el-button-group>
        <!-- @current-change="handleCurrentChange" -->

        <el-table
          :data="list"
          tooltip-effect="dark"
          style="width: 100%"
          :stripe="true"
          height="400"
          highlight-current-row
        >

          <el-table-column
            label="选择"
            width="50"
          >
            <template slot-scope="scope">

              <el-radio
                v-model="radio"
                :label="scope.row.uid"
              ><span /></el-radio>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="名称"
            width="120"
          >
            <template slot-scope="scope">

              <el-link
                type="primary"
                @click="editThings(scope.row)"
              >{{ scope.row.name }}</el-link>
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
            v-if="isShowBtn('edit') || isShowBtn('delete')"
            label="操作"
            width="120"
          >
            <template slot-scope="scope">
              <el-button
                v-if="isShowBtn('edit')"
                size="mini"
                type="primary"
                title="编辑"
                @click="editThings(scope.row,scope.$index)"
              ><i class="el-icon-edit" /></el-button>
              <!-- <el-popconfirm
                title="确定删除该物模型吗？"
                @confirm="handleDelete(scope.row,scope.$index)"
              >
                <el-button
                  slot="reference"
                  :disabled="!isShowBtn('delete')"
                  size="mini"
                  type="danger"
                  title="删除"
                  style="margin-left:6px"
                >
                  <i class="el-icon-delete" />

                </el-button>
              </el-popconfirm> -->
              <Poptip
                placement="bottom"
                confirm
                transfer
                title="确定删除该物模型吗？"
                @on-ok="handleDelete(scope.row,scope.$index)"
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
            :hide-on-single-page="total <1"
            background
            :page-size="5"
            layout="total, prev, pager, next"
            :total="total"
            @current-change="changePage"
          />
        </div>
      </div>

      <!-- 右侧表单 -->
      <div
        class="device-dlg-right"
        :class="{full:!newDevice}"
      >
        <div
          class="device-dlg-title"
          style="text-align:right;width:100px;margin-bottom:10px;padding-right:10px"
        >点位信息</div>

        <el-form
          ref="ruleForm"
          :model="form"
          :rules="deviceFormRules"
          class="form"
          label-width="100px"
        >
          <!-- <el-form-item label="物模型">
            <el-input
              v-model="defaultModel"
              autocomplete="off"
              readonly
              disabled
            />
          </el-form-item> -->
          <el-form-item
            label="名称"
            prop="s_name"
          >
            <el-input
              v-model="form.s_name"
              autocomplete="off"
              clearable
            />
          </el-form-item>
          <el-form-item
            label="id"
            prop="uid"
            disabled
          >
            <el-input
              v-model="form.uid"
              autocomplete="off"
              clearable
              :disabled="!newDevice"
            />
          </el-form-item>
          <el-form-item
            label="温度漂移值"
            prop="value"
            disabled
          >
            <el-input
              v-model="form.value"
              v-num
              autocomplete="off"
              clearable
            />
          </el-form-item>
          <el-form-item
            label="状态"
            prop="status_used"
          >

            <el-select
              v-model="form.status"
              placeholder="状态"
              class="filter-item"
            >
              <el-option
                label="绑定"
                :value="1"
              />
              <el-option
                label="解绑"
                :value="-2"
              />
              <!-- <el-option
                label="维护"
                :value="-1"
              /> -->
            </el-select>
          </el-form-item>
          <el-form-item
            label="绑定位置"
            prop="bind_id"
          >

            <el-select
              v-model="form.bind_id"
              filterable
              placeholder="选择"
              class="filter-item"
            >
              <el-option
                v-for="(item) in bindList"
                :key="item + 'a'"
                :label="item"
                :value="item"
              />

            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVisible = false">关闭</el-button>
        <!-- <el-button @click="dialogVisible = false">保存</el-button> -->
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
        >确认{{ titleType }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import { nanoid } from 'nanoid'
import { zModelPage, delModel, updateDevice } from '@/api/zmodel'

import ModelThings from './ModelThings'
import ModelProtocol from './ModelProtocol'

export default {
  name: 'AddDeviceDlg',
  components: { ModelThings, ModelProtocol },

  props: {
    bindList: {
      type: Array,
      default() {
        return []
      }
    },
    newItem: {
      type: Object,
      default() {
        return {}
      }
    },
    node: {
      type: Object,
      default() {
        return {}
      }
    },
    newDevice: {
      type: Boolean,
      default: null
    }
  },
  data() {
    return {
      dialogVisible: false,
      isNew: false,
      total: 0,
      radio: '',
      activeModel: {},
      currentRow: {},
      list: [],

      defaultModel: '温度传感器',
      params: {
        s_name: '',
        uid: ''
      },
      queryParams: { page: 1, size: 5 },
      form: {
        s_name: '',
        status: '',
        value: 0,
        uid: '',
        bind_id: ''
      },

      deviceFormRules: {
        s_name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          {
            min: 1,
            max: 100,
            message: '长度在 1 到 100 个字符',
            trigger: 'blur'
          }
        ],
        uid: [
          { required: true, message: '请输入id', trigger: 'blur' },
          {
            min: 1,
            max: 100,
            message: '长度在 1 到 100 个字符',
            trigger: 'blur'
          }
        ],
        value: [
          { required: true, message: '请输入温度漂移值', trigger: 'blur' }
        ],
        bind_id: [
          { required: true, message: '请输入选择绑定位置', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      permissions: (state) => state.user.permissions
    }),
    isPermissions() {
      return this.permissions.find((v) => v.id === 'tmodel').Permission
    },
    titleType() {
      return this.newDevice ? '新增' : '编辑'
    }
  },
  watch: {
    dialogVisible: {
      handler(val, oldVal) {
        if (this.newDevice) {
          this.init()
          this.form = {
            s_name: '新增_' + nanoid(),
            status: 1,
            value: 0,
            bind_id: '',
            uid: 'm_' + nanoid()
          }
          this.radio = ''
          this.$refs.ruleForm.resetFields()
        } else {
          this.form = {
            ...{
              s_name: this.newItem.s_name,
              status: this.newItem.status_used,
              value: this.newItem.value,
              bind_id: this.newItem.value,
              uid: this.newItem.uid
            },
            ...this.newItem
          }
        }
      }
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
    closed() {
      this.$refs.ruleForm.resetFields()
    },
    isShowBtn(str) {
      return this.isPermissions.includes(str)
    },
    submitForm(formName) {
      if (!this.radio && this.newDevice) {
        this.$message({
          type: 'error',
          message: `请选择物模型`
        })
        return
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const obj = {
            station_id: this.node.uid,
            model_id: this.radio || this.form.model_id,
            thing_id: this.form.uid,
            s_name: this.form.s_name,
            value: this.form.value,
            bind_id: this.form.bind_id,
            status: this.form.status
          }
          updateDevice(obj, this.newDevice)
            .then((res) => {
              if (res.data.result) {
                this.dialogVisible = false
                this.$message({
                  type: 'success',
                  message: `${this.titleType}设备成功`
                })
                this.dialogVisible = false
                this.$emit('confirm')
              } else {
                this.$message({
                  type: 'error',
                  message: res.data.error.message || `${this.titleType}设备失败`
                })
              }
            })
            .catch((err) => {
              alert(err)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    ThingsConfirm() {
      this.init()
    },
    init() {
      zModelPage(this.queryParams)
        .then((res) => {
          this.list = (res.data.result && res.data.result.data) || []
          this.total = (res.data.result && res.data.result.count) || 0
        })
        .catch((err) => {
          alert(err)
        })
    },
    // handleSelectionChange(item) {
    //   this.multipleSelection = item
    // },
    handleCurrentChange(item) {
      this.radio = item.uid
      this.currentRow = item
    },
    changePage(page) {
      this.queryParams.page = page
      this.init()
    },
    editThings(row) {
      this.isNew = false
      this.activeModel = { ...row }
      this.$refs.ModelThings.show()
    },
    addThings(item) {
      if (item) {
        this.activeModel = { ...item }
      } else {
        this.isNew = true
        this.activeModel = {
          name: '新增',
          uid: 'm_' + nanoid(),
          desc: '',
          rate_high: '',
          rate_low: '',
          temperature_high: '',
          temperature_low: ''
        }
      }
      this.$refs.ModelThings.show()
    },
    delThings() {},
    show() {
      this.dialogVisible = true
    },
    editProtocol() {
      this.$refs.ModelProtocol.show()
    },
    save() {
      this.$emit('confirmm', 123)
    },
    query() {
      zModelPage({ page: 1, size: 2 })
        .then((res) => {
          console.log('res :>> ', res)
          this.zModelList = res.data.result || []
          this.$refs.AddDeviceDlg.show()
        })
        .catch((err) => {
          alert(err)
        })
    },
    handleDelete(row, index) {
      delModel(row.uid)
        .then((res) => {
          if (res.data.result) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.init()
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
    }
  }
}
</script>

<style lang="scss" scoped>
.device-dlg-wrap {
  .device-dlg-title {
    font-size: 16px;
    text-align: center;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .device-dlg-left {
    display: inline-block;

    width: 65%;
    vertical-align: top;
    border-right: 1px solid #ccc;
  }
  .device-dlg-right {
    display: inline-block;
    width: 35%;
    &.full {
      width: 50%;
    }
  }
}
</style>
