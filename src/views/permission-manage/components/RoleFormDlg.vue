<template>
  <div>
    <el-dialog
      :title="`${titleType}角色`"
      :visible.sync="dialogVisible"
      width="50%"
      :close-on-click-modal="false"
      top="5vh"
    >
      <div class="wrap">

        <div class="left">

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
                v-model="ruleForm.role_name"
                autocomplete="off"
                :disabled="!isNew"
              />
            </el-form-item>
            <el-form-item
              label="物模型"
              :label-width="formLabelWidth"
            >
              <el-checkbox-group v-model="tmodelBtns">
                <el-checkbox
                  v-for="(item,i) in btnList"
                  :key="('a' + i)"
                  :label="item"
                  name="type"
                >{{ item | btns }}</el-checkbox>

              </el-checkbox-group>
            </el-form-item>
            <el-form-item
              label="设备"
              :label-width="formLabelWidth"
            >
              <el-checkbox-group v-model="thingBtns">
                <el-checkbox
                  v-for="(item,i) in btnList"
                  :key="('b' + i)"
                  :label="item"
                  name="type"
                >{{ item | btns }}</el-checkbox>

              </el-checkbox-group>
            </el-form-item>
            <el-form-item
              label="协议"
              :label-width="formLabelWidth"
            >
              <el-checkbox-group v-model="protocolBtns">
                <el-checkbox
                  v-for="(item,i) in btnList"
                  :key="('c' + i)"
                  :label="item"
                  name="type"
                >{{ item | btns }}</el-checkbox>

              </el-checkbox-group>
            </el-form-item>
            <el-form-item
              label="场站"
              :label-width="formLabelWidth"
            >
              <el-checkbox-group v-model="stationBtns">
                <el-checkbox
                  v-for="(item,i) in btnList"
                  :key="('d' + i)"
                  :label="item"
                  name="type"
                >{{ item | btns }}</el-checkbox>

              </el-checkbox-group>
            </el-form-item>
            <el-form-item
              label="用户"
              :label-width="formLabelWidth"
            >
              <el-checkbox-group v-model="userBtns">
                <el-checkbox
                  v-for="(item,i) in btnList"
                  :key="('e' + i)"
                  :label="item"
                  name="type"
                >{{ item | btns }}</el-checkbox>

              </el-checkbox-group>
            </el-form-item>
            <el-form-item
              label="角色"
              :label-width="formLabelWidth"
            >
              <el-checkbox-group v-model="roleBtns">
                <el-checkbox
                  v-for="(item,i) in btnList"
                  :key="('f' + i)"
                  :label="item"
                  name="type"
                >{{ item | btns }}</el-checkbox>

              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </div>
        <div class="right">
          <el-tree
            ref="treeF"
            default-expand-all
            :props="props"
            :data="treeList"
            show-checkbox
            :highlight-current="true"
            node-key="uid"
            @check-change="handleCheckChange"
          />

        </div>
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
import { updateRole } from '@/api/user'
import permission from '@/store/modules/permission'

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
    },
    treeData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      formLabelWidth: '80px',
      props: {
        label: 's_name',
        children: 'children',
        isLeaf: 'leaf'
      },
      btnList: ['add', 'delete', 'view', 'edit'],
      pList: [],

      treeList: [],
      tmodelBtns: [],
      protocolBtns: [],
      stationBtns: [],
      thingBtns: [],
      userBtns: [],
      roleBtns: [],
      ruleForm: { role_name: '' },
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
        if (this.isNew) {
          this.ruleForm = {
            role_name: '',
            permission: [
              {
                id: 'tmodel',
                Permission: []
              },
              {
                id: 'protocol',
                Permission: []
              },
              {
                id: 'station',
                Permission: []
              },
              {
                id: 'thing',
                Permission: []
              },
              {
                id: 'user',
                Permission: []
              },
              {
                id: 'role',
                Permission: []
              }
            ]
          }
          this.tmodelBtns = []
          this.protocolBtns = []
          this.stationBtns = []
          this.thingBtns = []
          this.userBtns = []
          this.roleBtns = []
          this.$nextTick(() => {
            this.$refs.treeF.setCheckedKeys([])
          })
        } else {
          this.ruleForm = { ...val }
          const obj1 = this.ruleForm.permission.find((v) => v.id === 'tmodel')
          const obj2 = this.ruleForm.permission.find((v) => v.id === 'protocol')
          const obj3 = this.ruleForm.permission.find((v) => v.id === 'station')
          const obj4 = this.ruleForm.permission.find((v) => v.id === 'thing')
          const obj5 = this.ruleForm.permission.find((v) => v.id === 'user')
          const obj6 = this.ruleForm.permission.find((v) => v.id === 'role')
          this.tmodelBtns = (obj1 && obj1.Permission) || []
          this.protocolBtns = (obj2 && obj2.Permission) || []
          this.stationBtns = (obj3 && obj3.Permission) || []
          this.thingBtns = (obj4 && obj4.Permission) || []
          this.userBtns = (obj5 && obj5.Permission) || []
          this.roleBtns = (obj6 && obj6.Permission) || []

          const { stations = [] } = this.ruleForm
          const arr = []
          stations.map((v) => {
            arr.push(v.uid)
          })
          this.$nextTick(() => {
            this.$refs.treeF.setCheckedKeys(arr)
          })
        }
      },
      deep: true
    },
    treeData: {
      handler(val, oldVal) {
        if (val.length > 0) {
          this.treeList = [...val]
        }
      }
    },
    deep: true
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
    // close() {
    //   this.ruleForm = null
    //   this.dialogVisible = false
    // },
    $_show() {
      this.$refs['ruleForm'] && this.$refs['ruleForm'].clearValidate()

      this.dialogVisible = true
    },
    handleCheckChange(val) {
      console.log('val :>> ', val)
    },
    getRuleForm() {},
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = { ...this.ruleForm }
          const pArr = params.permission.map((v) => {
            const obj = { id: v.id }
            const val = v.id
            if (val === 'tmodel') {
              obj.Permission = this.tmodelBtns
            } else if (val === 'protocol') {
              obj.Permission = this.protocolBtns
            } else if (val === 'station') {
              obj.Permission = this.stationBtns
            } else if (val === 'thing') {
              obj.Permission = this.thingBtns
            } else if (val === 'user') {
              obj.Permission = this.userBtns
            } else if (val === 'role') {
              obj.Permission = this.roleBtns
            }
            return obj
          })
          params.permission = pArr
          params.stations_list = this.$refs.treeF.getCheckedKeys()
          delete params.stations
          debugger
          updateRole(params, this.isNew)
            .then((res) => {
              if (res.data.result) {
                this.dialogVisible = false
                this.$message({
                  type: 'success',
                  message: `${this.titleType}角色成功`
                })
                this.dialogVisible = false
                this.$emit('confirm')
              } else {
                this.$message({
                  type: 'error',
                  message: `${this.titleType}角色失败`
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

<style lang="scss" scoped>
.wrap {
  @include flex(space-between, flex-start);
}
.left {
  width: 48%;
  min-width: 400px;
}
.right {
  width: 48%;
  display: inline-block;
}
</style>
