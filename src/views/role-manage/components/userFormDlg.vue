<template>
  <div>
    <el-dialog
      :title="`${titleType}用户`"
      :visible.sync="dialogVisible"
      width="35%"
      :close-on-click-modal="false"
      :modal="false"
      top="15vh"
    >

      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
      >
        <el-form-item
          label="用户名"
          prop="user_name"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="ruleForm.user_name"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="ruleForm.email"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="密码"
          prop="email"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="ruleForm.password"
            autocomplete="off"
            type="password"
          />
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="checkPass"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="ruleForm.checkPass"
            autocomplete="off"
            type="password"
          />
        </el-form-item>
        <el-form-item
          label="角色选择"
          prop="role_id"
          :label-width="formLabelWidth"
        >
          <el-select
            v-model="ruleForm.role_id"
            placeholder="请选择角色"
          >
            <el-option
              v-for="(item,i) in roles"
              :key="'a' + i"
              :label="item.role_name"
              :value="item.role_id"
            />

          </el-select>
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
import add from '@/mixins/add.js'
const roles = [{ role_id: 1001, role_name: 'super' }]
export default {
  name: 'UserFormDlg',
  components: {},
  mixins: [add],

  props: {},
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      dialogVisible: false,
      formLabelWidth: '120px',
      roles: [],
      ruleForm: {},
      rules: {
        user_name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 1,
            max: 500,
            message: '长度在 3 到 500 个字符',
            trigger: 'blur'
          }
        ],

        role_id: [{ required: true, message: '请选择角色', trigger: 'change' }],
        // email: [
        //   { required: true, message: '请输入内容', trigger: 'blur' },
        //   {
        //     min: 1,
        //     max: 500,
        //     message: '长度在 3 到 500 个字符',
        //     trigger: 'blur'
        //   }
        // ],
        password: [{ validator: validatePass, trigger: 'blur' }],
        checkPass: [{ validator: validatePass2, trigger: 'blur' }]
      }
    }
  },
  computed: {},
  watch: {
    dialogVisible: {
      handler(val, oldVal) {
        if (val) {
          if (this.isNew) {
            this.ruleForm = {
              uid: '',
              user_name: '',
              nick_name: '',
              password: '',
              email: '',
              phone: '',
              address: '',
              role_id: '',
              role_name: ''
            }
          } else {
            this.ruleForm = {
              ...this.ruleForm0,
              ...{ password: '', checkPass: '' }
            }
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
    this.roles = roles
    this.getRuleForm()
  },
  methods: {
    getRuleForm() {},
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // updateStation(params, this.isNew)
          //   .then((res) => {
          //     if (res) {
          //       this.dialogVisible = false
          //       this.$message({
          //         type: 'success',
          //         message: `${this.titleType}场站成功`
          //       })
          //       this.dialogVisible = false
          //       this.$emit('confirm')
          //     } else {
          //       this.$message({
          //         type: 'error',
          //         message: `${this.titleType}场站失败`
          //       })
          //     }
          //   })
          //   .catch((err) => {
          //     alert(err)
          //   })

          this.$emit('confirm', this.ruleForm)
          this.dialogVisible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
