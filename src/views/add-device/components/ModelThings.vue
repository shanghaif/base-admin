<template>
  <div>
    <el-dialog
      :title="`${msg}物模型`"
      :visible.sync="dialogVisible"
      width="50%"
      :close-on-click-modal="false"
      :modal="false"
      top="10vh"
      @closed="hide"
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

        <div class="rage-box">

          <el-form-item
            prop="temperature_low"
            label="温度告警范围"
          >

            <el-input
              v-model="saveParams.temperature_low"
              v-num
              autocomplete="off"
            >
              <template slot="append">最小值</template>
            </el-input>

          </el-form-item>
          <el-form-item
            label=""
            prop="temperature_high"
          >

            <el-input
              v-model="saveParams.temperature_high"
              v-num
              autocomplete="off"
            >
              <template slot="append">最大值</template>
            </el-input>
          </el-form-item>
        </div>
        <div class="rage-box">

          <el-form-item
            prop="rate_low"
            label="温度趋势范围"
          >

            <el-input
              v-model="saveParams.rate_low"
              v-num
              autocomplete="off"
            >
              <template slot="append">最小值</template>
            </el-input>

          </el-form-item>
          <el-form-item
            label=""
            prop="rate_high"
          >

            <el-input
              v-model="saveParams.rate_high"
              v-num
              autocomplete="off"
            >
              <template slot="append">最大值</template>
            </el-input>
          </el-form-item>
        </div>

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
        temperature_low: [
          { required: true, message: '请输入数值', trigger: 'blur' }
        ],
        temperature_high: [
          { required: true, message: '请输入数值', trigger: 'blur' }
        ],
        rate_low: [{ required: true, message: '请输入数值', trigger: 'blur' }],
        rate_high: [{ required: true, message: '请输入数值', trigger: 'blur' }]
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

<style lang="scss" scoped>
.el-form-item {
  &.left-label {
    width: 70%;
  }
  &.no-label {
    width: 30%;
  }
}
</style>
