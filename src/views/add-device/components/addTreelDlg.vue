<template>
  <div>
    <el-dialog
      title="typeText + '设备'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="40%"
    >
      <el-form
        ref="ruleForm"
        class="form"
        label-width="80px"
      >
        <el-form-item label="物模型">
          <el-input
            v-model="defaultModel"
            autocomplete="off"
            readonly
            disabled
          />
        </el-form-item>
        <el-form-item
          label="名称"
          prop="s_name"
        >
          <el-input
            v-model="params.s_name"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="id"
          prop="uid"
        >
          <el-input
            v-model="params.uid"
            autocomplete="off"
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
          @click="save"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { editThings } from '@/api/station'
export default {
  name: 'AddTreelDlg',
  components: {},

  props: {
    isNew: {
      type: Boolean,
      default: false
    },
    params: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      form: {},
      defaultModel: '温度传感器'
    }
  },
  computed: {
    typeText() {
      return this.isNew ? '新增' : '编辑'
    }
  },
  watch: {
    params: {
      handler(newName, oldName) {
        if (newName) {
          this.form = Object.assign({}, newName)
        }
      },
      deep: true // 为true，表示深度监听，这时候就能监测到a值变化
    }
  },

  created() {},

  mounted() {},
  methods: {
    show() {
      this.dialogVisible = true
    },
    save() {
      editThings(this.form)
        .then((res) => {
          if (res.data.result) {
            this.dialogVisible = false
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.$emit('refresh')
          }
        })
        .catch((err) => {
          alert(err)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.form {
  width: 75%;
}
</style>
