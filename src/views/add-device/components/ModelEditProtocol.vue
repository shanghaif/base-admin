<template>
  <div>
    <el-dialog
      :title="`${titleType}协议`"
      :visible.sync="dialogVisible"
      width="40%"
      :close-on-click-modal="false"
      :modal="false"
      top="5vh"
      @closed="hide"
    >

      <el-form
        ref="ruleForm"
        :model="newItem"
        :rules="rules"
        label-position="top"
      >
        <el-form-item
          label="路径"
          prop="protocol_path"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="newItem.protocol_path"
            autocomplete="off"
            disabled
          />
        </el-form-item>

        <el-form-item
          label="运行参数"
          prop="paramStr"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="newItem.paramStr"
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
        >确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'ModelEditProtocol',
  components: {},

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
      formLabelWidth: '120px',
      options: [
        { label: 'COMMON', value: 'COMMON' },
        { label: '养猪', value: '养猪' },
        { label: '煤炭', value: '煤炭' }
      ],
      rules: {
        paramStr: [
          { required: true, message: '请输入内容', trigger: 'blur' },
          {
            min: 1,
            max: 500,
            message: '长度在 3 到 500 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    titleType() {
      return this.isNew ? '新增' : '编辑'
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
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('confirm', this.newItem)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    show() {
      this.dialogVisible = true
    },

    hide() {
      this.dialogVisible = false
      this.$refs.ruleForm.clearValidate()
    }
  }
}
</script>

<style lang="scss" scoped></style>
