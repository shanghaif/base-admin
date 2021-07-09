
export default {
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
    }
  },
  data() {
    return {
      dialogVisible: false,
      ruleForm0: {}
    }
  },
  mounted() {
     
  },
  watch: {
    obj: {
      handler(val, oldVal) {
        if (this.isNew) {
          this.ruleForm0 = {}
        } else {
          this.ruleForm0 = {...val}
        }
      }
    }
  },
  computed: {
     
    titleType() {
      return this.isNew ? '新增' : '编辑'
    }
  },
  methods: {
    
    $_show() {
      this.$refs['ruleForm'] && this.$refs['ruleForm'].clearValidate()

      this.dialogVisible = true
    },
    $_hide() {
      this.visible = false
    }
    
  }
}
