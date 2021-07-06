<template>
  <div>
    <el-dialog
      :title="typeText + '设备'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="40%"
    >
      <el-form
        ref="ruleForm"
        v-model="form"
        class="form"
        label-width="80px"
      >
        <el-form-item
          label="物模型"
          style="display:none;"
        >
          <el-input
            v-model="defaultModel"
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
            disabled
          />
        </el-form-item>
        <el-form-item
          label="id"
          prop="uid"
        >
          <el-input
            v-model="params.uid"
            disabled
          />
        </el-form-item>
        <el-form-item
          label="状态"
          prop="status_used"
        >

          <el-select
            v-model="params.status_used"
            placeholder="状态"
            style="width: 120px; margin-right: 10px"
            class="filter-item"
          >
            <el-option
              label="启用"
              :value="1"
            />
            <el-option
              label="停用"
              :value="0"
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
          @click="save"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { editThings } from '@/api/station'
export default {
  name: 'DevicelDlg',
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
