<template>
  <div class="device-dlg-wrap">
    <el-dialog
      title="新增设备"
      :visible.sync="dialogVisible"
      width="60%"
      :close-on-click-modal="false"
    >
      <ModelThings ref="ModelThings" />
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
            @click="addThings"
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
                @click="editThings(scope.row,scope.$index)"
              >
                编辑
              </el-button>
              <el-popconfirm
                title="确定删除该物模型吗？"
                @confirm="delThings(scope.row,scope.$index)"
              >
                <el-button
                  slot="reference"
                  size="mini"
                  type="danger"
                  style="margin-left:10px;"
                >
                  删除
                </el-button>
              </el-popconfirm>
            </template>
          </el-table-column>

        </el-table>
      </div>

      <!-- 右侧表单 -->
      <div class="device-dlg-right">
        <el-form
          ref="ruleForm"
          class="form"
          label-width="80px"
        >
          <el-form-item label="物模型">
            <el-input
              v-model="defaultModel"
              autocomplete="off"
              readonly
              disabled
            />
          </el-form-item>
          <el-form-item
            label="名称"
            prop="s_name"
          >
            <el-input
              v-model="params.s_name"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            label="id"
            prop="uid"
          >
            <el-input
              v-model="params.uid"
              autocomplete="off"
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
import ModelThings from './ModelThings'
import ModelProtocol from './ModelProtocol'

export default {
  name: 'AddDeviceDlg',
  components: { ModelThings, ModelProtocol },

  props: {},
  data() {
    return {
      dialogVisible: false,
      defaultModel: '温度传感器',
      params: {
        s_name: '',
        uid: ''
      },
      tableData: [
        {
          s_name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }
      ]
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
    editThings() {
      console.log('1234 :>> ', 1234)
      this.$refs.ModelThings.show()
    },
    addThings() {
      console.log('1234 :>> ', 1234)
      this.$refs.ModelThings.show()
    },
    delThings() {
      console.log('1234 :>> ', 1234)
    },
    show() {
      this.dialogVisible = true
    },
    editProtocol() {
      console.log('1234 :>> ', 1234)
      this.$refs.ModelProtocol.show()
    },
    save() {
      this.$emit('confirmm', 123)
    }
  }
}
</script>

<style lang="scss" scoped>
.device-dlg-wrap {
  .device-dlg-left {
    display: inline-block;

    width: 60%;
    vertical-align: top;
    .device-dlg-title {
      font-size: 16px;
      text-align: center;
      // font-weight: bold;
      margin-bottom: 10px;
    }
  }
  .device-dlg-right {
    border-left: 1px solid #ccc;
    display: inline-block;
    width: 40%;
  }
}
</style>
