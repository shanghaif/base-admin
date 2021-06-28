<template>
  <div>
    <el-dialog
      title="物模型编辑"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="40%"
    >

      <el-tabs
        v-model="activeTab"
        @tab-click="handleClick"
      >
        <el-tab-pane
          label="基础信息"
          name="base"
        >
          <model-base-property
            :is-new="isNew"
            :new-item="activeModel"
          />
        </el-tab-pane>
        <el-tab-pane
          label="属性"
          name="property"
        >属性</el-tab-pane>
        <el-tab-pane
          label="事件/告警"
          name="event"
        >事件/告警</el-tab-pane>
        <el-tab-pane
          label="服务"
          name="service"
        >服务</el-tab-pane>
        <el-tab-pane
          label="设备参数"
          name="params"
        >服务</el-tab-pane>
      </el-tabs>
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
import ModelBaseProperty from './ModelBaseProperty'
import { mapState, mapActions, mapMutations } from 'vuex'

import { nanoid } from 'nanoid'
export default {
  name: 'ZModelDlg',
  components: { ModelBaseProperty },

  props: {},
  data() {
    return {
      dialogVisible: false,
      activeTab: 'base',
      visible: false,
      mode: 'top',
      isNew: true,
      properties: [],
      params: [],
      rules: [],
      events: [],
      services: [],
      isSaved: false,
      isAutoSave: false,
      activeModel: {}
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
    ...mapActions({
      refreshModel: 'zmodel/refreshModel',
      getModel: 'zmodel/getModel'
    }),
    show(item) {
      this.dialogVisible = true

      if (item) {
        this.activeModel = { ...item }
      } else {
        this.isNew = true
        this.activeModel = {
          s_name: '新增',
          uid: 'm_' + nanoid(),
          catalog_id: 'COMMON',
          body: '{}'
        }
      }
    },
    save() {
      this.refreshModel(this.activeModel).then((res) => {
        if (res.status === 200 && res.data.result) {
          this.dialogVisible = false
          this.getModel()
        } else {
          console.log('111 :>> ', 111)
        }
      })
    },
    handleClick() {
      console.log('111 :>> ', 111)
    }
  }
}
</script>

<style lang="scss" scoped></style>
