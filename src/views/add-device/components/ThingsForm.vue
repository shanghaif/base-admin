<template>
  <div>
    <el-dialog
      :title="typeText + '物模型'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="40%"
    >
      <el-form
        ref="ruleForm"
        class="form"
        label-width="80px"
      >

        <el-form-item
          label="名称"
          prop="s_name"
        >
          <el-input
            v-model="newItem.s_name"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="id"
          prop="uid"
        >
          <el-input
            v-model="newItem.uid"
            autocomplete="off"
          />
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
              v-for="(item,i) in options"
              :key="item +i"
              :label="item.label"
              :value="item.value"
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
  name: 'ThingsForm',
  components: {},

  props: {
    isNew: {
      type: Boolean,
      default: false
    },
    newItem: {
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
    newItem: {
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
