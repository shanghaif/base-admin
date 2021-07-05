<template>
  <div>
    <el-dialog
      :title="isNew ? '新增物模型': '编辑物模型'"
      :visible.sync="dialogVisible"
      width="50%"
      :close-on-click-modal="false"
      :modal="false"
      top="10vh"
    >

      <el-form
        ref="ruleForm"
        :model="newItem"
        :rules="rules"
        label-width="120px"
        label-position="right"
        style="width:50%"
      >
        <el-form-item
          label="名称"
          prop="s_name"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="saveParams.s_name"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="id"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="saveParams.uid"
            autocomplete="off"
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
        <!-- <el-form-item
          label="类别"
          :label-width="formLabelWidth"
        >
          <el-select
            v-model="newItem.catalog_id"
            placeholder="请选择"
          >
            <el-option
              v-for="(item,i) in options"
              :key="item +i"
              :label="item.label"
              :value="item.value"
            />

          </el-select>
        </el-form-item> -->
        <el-form-item
          label="说明"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="newItem.desc"
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
          @click="dialogVisible = false"
        >确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { nanoid } from 'nanoid'

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
        s_name: [
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
  computed: {},
  watch: {
    newItem: {
      handler(val, oldVal) {
        if (val) {
          this.saveParams = {
            ...{
              name: val.s_name,
              temperature_high: 0,
              temperature_low: 0,
              rate_high: 0,
              rate_low: 0
            },
            ...val
          }
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
          alert('submit!')
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
