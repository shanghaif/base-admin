<template>
  <div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="40%"
    >
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
    <el-form
      ref="ruleForm"
      :model="newItem"
      :rules="rules"
    >
      <el-form-item
        label="名称"
        prop="s_name"
        :label-width="formLabelWidth"
      >
        <el-input
          v-model="newItem.s_name"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item
        label="id"
        :label-width="formLabelWidth"
      >
        <el-input
          v-model="newItem.uid"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item
        label="场站"
        :label-width="formLabelWidth"
      >
        <el-switch v-model="newItem.is_station" />
      </el-form-item>
      <el-form-item
        label="边缘控制器"
        :label-width="formLabelWidth"
      >
        <el-switch v-model="newItem.is_edge_control" />
      </el-form-item>
      <el-form-item
        label="类别"
        :label-width="formLabelWidth"
      >
        <el-select
          v-model="newItem.catalog_id"
          placeholder="请选择"
        >
          <el-option
            label="煤炭"
            value="shanghai"
          />
          <el-option
            label="养猪"
            value="beijing"
          />
        </el-select>
      </el-form-item>
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
  </div>
</template>

<script>
export default {
  name: 'ModelBaseProperty',
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

      rules: {
        s_name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      }
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
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
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
