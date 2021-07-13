<template>
  <div>
    <el-dialog
      :title="`${titleType}角色`"
      :visible.sync="dialogVisible"
      width="35%"
      :close-on-click-modal="false"
      :modal="false"
      top="15vh"
      @close="close"
    >
      <div
        v-if="ruleForm"
        class="left"
      >

        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
        >
          <el-form-item
            label="角色名"
            prop="role_name"
            :label-width="formLabelWidth"
          >
            <el-input
              v-model="ruleForm.user_name"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            v-for="(item,i) in pList"
            :key="'a' + i"
            :label="item.id | permissionName"
          >
            <el-checkbox-group v-model="ruleForm.permission[i]['Permission']">
              <!-- <el-checkbox-group v-model="tmodelBtns"> -->
              <el-checkbox
                v-for="(btn,j) in item.Permission"
                :key="'a' + j"
                :label="btn"
                name="type"
              >{{ btn | btns }}</el-checkbox>

            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </div>
      <div class="right">
        <!-- <el-tree
          :data="pList"
          :props="BtnProps"
        /> -->
      </div>
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
import { queryUser, updateUser } from '@/api/user'
const pList = [
  {
    id: 'tmodel',
    Permission: ['add', 'delete', 'edit', 'view']
  },
  {
    id: 'protocol',
    Permission: ['add', 'delete', 'edit', 'view']
  },
  {
    id: 'station',
    Permission: ['add', 'delete', 'edit', 'view']
  },
  {
    id: 'thing',
    Permission: ['add', 'delete', 'edit', 'view']
  },
  {
    id: 'user',
    Permission: ['add', 'delete', 'edit', 'view']
  },
  {
    id: 'role',
    Permission: ['add', 'delete', 'edit', 'view']
  }
]
export default {
  name: 'RoleFormDlg',
  components: {},
  filters: {
    btns(val) {
      let res
      if (val === 'add') {
        res = '增加'
      } else if (val === 'delete') {
        res = '删除'
      } else if (val === 'edit') {
        res = '修改'
      } else if (val === 'view') {
        res = '查看'
      }
      return res
    },
    permissionName(val) {
      let res
      if (val === 'tmodel') {
        res = '物模型'
      } else if (val === 'protocol') {
        res = '协议'
      } else if (val === 'station') {
        res = '场站'
      } else if (val === 'thing') {
        res = '设备'
      } else if (val === 'user') {
        res = '用户'
      } else if (val === 'role') {
        res = '角色'
      }
      return res
    }
  },
  props: {
    obj: {
      type: Object,
      default() {
        return {}
      }
    },
    isNew: {
      type: Boolean,
      default: false
    },
    roles: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      formLabelWidth: '120px',
      btnList: ['add', 'delete', 'view', 'edit'],
      pList: [],
      tmodelBtns: ['add', 'delete'],
      protocolBtns: [],
      stationBtns: [],
      thingBtns: [],
      userBtns: [],
      roleBtns: [],
      ruleForm: {
        role_id: '',
        role_name: '',

        stations: [],
        stations_list: null,
        permission: [{ id: '', Permission: [] }]
      },
      BtnProps: {
        label: 'id',
        children: 'Permission'
      },
      rules: {
        role_name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 1,
            max: 500,
            message: '长度在 3 到 500 个字符',
            trigger: 'blur'
          }
        ],

        role_id: [{ required: true, message: '请选择角色', trigger: 'change' }]
      }
    }
  },
  computed: {
    titleType() {
      return this.isNew ? '新增' : '编辑'
    }
  },
  watch: {
    obj: {
      handler(val, oldVal) {
        this.ruleForm = { ...val }
      },
      deep: true
    }
  },

  created() {
    // 生命周期钩子：组件实例创建完成，属性已绑定，但 DOM 还未生成，el 属性还不存在
    // 初始化渲染页面
  },

  mounted() {
    // 生命周期钩子：模板编译、挂载之后（此时不保证已在 document 中）
    this.pList = pList

    this.getRuleForm()
  },
  methods: {
    close() {
      this.ruleForm = null
    },
    $_show() {
      this.$refs['ruleForm'] && this.$refs['ruleForm'].clearValidate()

      this.dialogVisible = true
    },

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
            role_id: obj.role_id
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
