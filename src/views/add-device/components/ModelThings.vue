<template>
  <div>
    <el-dialog
      :title="`${msg}物模型`"
      :visible.sync="dialogVisible"
      width="50%"
      :close-on-click-modal="false"
      :modal="false"
      top="10vh"
    >

      <el-form
        ref="ruleForm"
        :model="saveParams"
        :rules="rules"
        label-width="120px"
        label-position="right"
        style="width:60%"
      >
        <el-form-item
          label="名称"
          prop="name"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="saveParams.name"
            autocomplete="off"
            :disabled="!isNew"
          />
        </el-form-item>
        <el-form-item
          label="id"
          prop="uid"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="saveParams.uid"
            autocomplete="off"
            :disabled="!isNew"
          />
        </el-form-item>
        <el-form-item label="温度告警范围">
          <el-col :span="6">
            <el-input
              v-model="saveParams.temperature_low"
              autocomplete="off"
            />
          </el-col>
          <el-col
            class="line"
            :span="1"
            style="text-align:center"
          >-</el-col>
          <el-col :span="6">

            <el-input
              v-model="saveParams.temperature_high"
              autocomplete="off"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="温度趋势范围">
          <el-col :span="6">
            <el-input
              v-model="saveParams.rate_low"
              autocomplete="off"
            />
          </el-col>
          <el-col
            class="line"
            :span="1"
            style="text-align:center"
          >-</el-col>
          <el-col :span="6">

            <el-input
              v-model="saveParams.rate_high"
              autocomplete="off"
            />
          </el-col>
        </el-form-item>

        <el-form-item
          label="说明"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="saveParams.desc"
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
import { tmodelNew } from '@/api/zmodel'

export default {
  name: 'ModelThings',
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
      default: false
    }
  },
  data() {
    return {
      saveParams: {},
      dialogVisible: false,
      formLabelWidth: '120px',
      activeModel: {},
      options: [
        { label: 'COMMON', value: 'COMMON' },
        { label: '养猪', value: '养猪' },
        { label: '煤炭', value: '煤炭' }
      ],
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          {
            min: 1,
            max: 100,
            message: '长度在 1 到 100 个字符',
            trigger: 'blur'
          }
        ],
        uid: [
          { required: true, message: '请输入名称', trigger: 'blur' },
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
  computed: {
    msg() {
      return this.isNew ? '新增' : '编辑'
    }
  },
  watch: {
    newItem: {
      handler(val, oldVal) {
        if (val) {
          this.saveParams = { ...val }
        }
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
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // this.saveParams.rate_high = Number(this.saveParams.rate_high)
          // this.saveParams.rate_low = Number(this.saveParams.rate_low)
          // this.saveParams.temperature_high = Number(
          //   this.saveParams.temperature_high
          // )
          // this.saveParams.temperature_low = Number(
          //   this.saveParams.temperature_low
          // )

          tmodelNew(this.saveParams, this.isNew)
            .then((res) => {
              this.$message({
                type: 'success',
                message: `${this.msg}成功!`
              })
              this.dialogVisible = false
              this.$emit('confirm')
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
    show(item) {
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped></style>
