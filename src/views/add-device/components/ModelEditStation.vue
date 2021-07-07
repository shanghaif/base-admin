<template>
  <div>
    <el-dialog
      :title="`${titleType}场站`"
      :visible.sync="dialogVisible"
      width="40%"
      :close-on-click-modal="false"
      :modal="false"
      top="5vh"
    >

      <el-form
        ref="ruleForm"
        :model="form"
        :rules="rules"
      >
        <el-form-item
          label="名称"
          prop="s_name"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="form.s_name"
            autocomplete="off"
          />
        </el-form-item>

        <el-form-item
          label="描述"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="form.desc"
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
import { updateStation, delStation } from '@/api/zmodel'
export default {
  name: 'ModelEditStation',
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
      form: {
        s_name: '',
        area_id: '',
        desc: ''
      },
      rules: {
        s_name: [
          { required: true, message: '请输入内容', trigger: 'blur' },
          {
            min: 1,
            max: 500,
            message: '长度在 3 到 500 个字符',
            trigger: 'blur'
          }
        ]
      },
      stationParams: {
        model_id: '',
        lon: '0',
        lat: '0',
        area_id: 1,
        s_name: '',
        level: 1,
        desc: '',
        parent_id: ''
      }
    }
  },
  computed: {
    titleType() {
      return this.isNew ? '新增' : '编辑'
    }
  },
  watch: {
    dialogVisible: {
      handler(val, oldVal) {
        if (this.isNew) {
          this.form = {
            s_name: '',
            desc: ''
          }
        } else {
          this.form = {
            s_name: this.newItem.s_name,
            desc: this.newItem.desc
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
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            model_id: this.newItem.model_id,
            lon: '0',
            lat: '0',
            area_id: 1,
            s_name: this.form.s_name,
            level: 1,
            desc: this.form.desc,
            parent_id: this.newItem.uid
          }
          updateStation(params, this.isNew)
            .then((res) => {
              if (res) {
                this.dialogVisible = false
                this.$message({
                  type: 'success',
                  message: `${this.titleType}场站成功`
                })
                this.dialogVisible = false
                this.$emit('confirm')
              } else {
                this.$message({
                  type: 'error',
                  message: `${this.titleType}场站失败`
                })
              }
            })
            .catch((err) => {
              alert(err)
            })
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
    }
  }
}
</script>

<style lang="scss" scoped></style>
