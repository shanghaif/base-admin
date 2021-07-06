<template>
  <div class="device-dlg-wrap">
    <el-dialog
      title="新增设备"
      :visible.sync="dialogVisible"
      width="60%"
      :close-on-click-modal="false"
    >
      <ModelThings
        ref="ModelThings"
        :is-new="isNew"
        :new-item="activeModel"
        @confirm="ThingsConfirm"
      />
      <ModelProtocol ref="ModelProtocol" />
      <!-- 左侧表单 -->
      <div class="device-dlg-left">

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
            type="primary"
            size="mini"
            @click="addThings()"
          >
            新增
          </el-button>

        </el-button-group>

        <el-table
          ref="multipleTable"
          :data="list"
          tooltip-effect="dark"
          style="width: 100%"
          :stripe="true"
          height="400"
          @selection-change="handleSelectionChange"
        >
          <!-- <el-table-column
            type="selection"
            width="55"
          /> -->

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
            label="操作"
            width="120"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                title="编辑"
                @click="editThings(scope.row,scope.$index)"
              ><i class="el-icon-edit" /></el-button>
              <el-popconfirm
                title="确定删除该物模型吗？"
                @confirm="handleDelete(scope.row,scope.$index)"
              >
                <el-button
                  slot="reference"
                  size="mini"
                  type="danger"
                  title="删除"
                  style="margin-left:6px"
                >
                  <i class="el-icon-delete" />

                </el-button>
              </el-popconfirm>
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
      <div class="device-dlg-right">
        <div class="device-dlg-title">点位信息</div>

        <el-form
          ref="ruleForm"
          :model="form"
          :rules="deviceFormRules"
          class="form"
          label-width="80px"
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
          >
            <el-input
              v-model="form.uid"
              autocomplete="off"
              clearable
            />
          </el-form-item>

        </el-form>
      </div>
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
import { nanoid } from 'nanoid'
import { zModelPage, delModel } from '@/api/zmodel'

import ModelThings from './ModelThings'
import ModelProtocol from './ModelProtocol'

export default {
  name: 'AddDeviceDlg',
  components: { ModelThings, ModelProtocol },

  props: {},
  data() {
    return {
      dialogVisible: false,
      isNew: false,
      total: 0,
      activeModel: {},
      multipleSelection: [],
      list: [],
      defaultModel: '温度传感器',
      params: {
        s_name: '',
        uid: ''
      },
      queryParams: { page: 1, size: 5 },
      form: {
        s_name: '',
        uid: ''
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
        ]
      }
    }
  },
  computed: {},
  watch: {
    dialogVisible: {
      handler(val, oldVal) {
        if (val) {
          this.init()
          this.form = {
            s_name: '新增_' + nanoid(),
            uid: 'm_' + nanoid()
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
    ThingsConfirm() {
      this.init()
    },
    init() {
      zModelPage(this.queryParams)
        .then((res) => {
          this.list = res.data.result.data || []
          this.total = res.data.result.count || 0
        })
        .catch((err) => {
          alert(err)
        })
    },
    handleSelectionChange(item) {
      this.multipleSelection = item
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
          rate_high: 100,
          rate_low: 30,
          temperature_high: 300,
          temperature_low: 200
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
      debugger
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
          if (res.status === 200 && res.data.result === null) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.init()
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

    width: 70%;
    vertical-align: top;
    border-right: 1px solid #ccc;
  }
  .device-dlg-right {
    display: inline-block;
    width: 30%;
  }
}
</style>
