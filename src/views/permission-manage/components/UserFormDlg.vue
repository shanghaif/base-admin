<template>
  <div>
    <el-dialog
      :title="`${titleType}用户`"
      :visible.sync="dialogVisible"
      width="35%"
      :close-on-click-modal="false"
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
          label="昵称"
          prop="nick_name"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="ruleForm.nick_name"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="手机号"
          prop="phone"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="ruleForm.phone"
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
          prop="password"
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
          prop="role_name"
          :label-width="formLabelWidth"
        >
          <el-select
            v-model="ruleForm.role_name"
            placeholder="请选择角色"
          >
            <el-option
              v-for="(item,i) in roles"
              :key="'a' + i"
              :label="item.role_name"
              :value="item.role_name"
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
import { queryUser, updateUser } from '@/api/user'

export default {
  name: 'UserFormDlg',
  components: {},
  mixins: [add],

  props: {
    roles: {
      type: Array,
      default() {
        return []
      }
    }
  },
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
    var validatePhone = (rule, value, callback) => {
      const phoneReg = /^1[3|4|5|7|8][0-9]{9}$/
      if (!value) {
        return callback(new Error('手机号码不能为空'))
      }
      setTimeout(() => {
        // Number.isInteger是es6验证数字是否为整数的方法,但是我实际用的时候输入的数字总是识别成字符串
        // 所以我就在前面加了一个+实现隐式转换

        if (!Number.isInteger(+value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (phoneReg.test(value)) {
            callback()
          } else {
            callback(new Error('手机号码格式不正确'))
          }
        }
      }, 100)
    }
    var validateEmail = (rule, value, callback) => {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
      if (!value) {
        return callback(new Error('邮箱不能为空'))
      }
      setTimeout(() => {
        if (mailReg.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的邮箱格式'))
        }
      }, 100)
    }
    return {
      dialogVisible: false,
      formLabelWidth: '120px',

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
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
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
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },

          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { required: true, message: '请确认密码', trigger: 'blur' },

          { validator: validatePass2, trigger: 'blur' }
        ]
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
    this.getRuleForm()
  },
  methods: {
    getRuleForm() {},
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const obj = this.ruleForm
          const params = {
            user_name: obj.user_name,
            nick_name: obj.nick_name,
            password: obj.password,
            email: obj.email,
            phone: obj.phone,
            role_name: obj.role_name
          }
          updateUser(params, this.isNew)
            .then((res) => {
              if (res.data.result) {
                this.dialogVisible = false
                this.$message({
                  type: 'success',
                  message: `${this.titleType}用户成功`
                })
                this.dialogVisible = false
                this.$emit('confirm')
              } else {
                this.$message({
                  type: 'error',
                  message: `${this.titleType}用户失败`
                })
              }
            })
            .catch((err) => {
              alert(err)
            })

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
