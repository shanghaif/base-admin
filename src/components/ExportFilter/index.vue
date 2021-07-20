<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      title="导出"
      width="40%"
      center
    >
      <div class="export-filter">
        <div class="filter-items">
          <div class="filter-item">
            <div class="filter-item-label">
              设备名称
            </div>
            <div class="filter-item-content">

              <div class="content-crumbs">
                <div class="content-crumb">{{ item && item.s_name }}</div>

              </div>
            </div>
          </div>
          <div class="filter-item">
            <div class="filter-item-label">
              时间范围
            </div>
            <div class="filter-item-content">
              <el-date-picker
                v-model="exportDate"
                type="daterange"
                format="yyyy-MM-dd"
                :picker-options="pickerOptions"
                range-separator="至"
                placeholder="选择日期"
                class="screen-select"
                unlink-panels
                @change="changeExportDate"
              >
                />
              </el-date-picker>

            </div>
          </div>

        </div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="detail-cancel-btn"
          style="margin-right:30px"
          @click="dialogVisible = false"
        >取消</el-button>
        <el-dropdown
          trigger="click"
          @command="exportPoint"
        >
          <!-- <span class="el-dropdown-link">
            导出<i class="el-icon-arrow-down el-icon--right" />
          </span> -->
          <el-button
            class="detail-ok-btn"
            type="primary"
          >导出</el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="true">压缩</el-dropdown-item>
            <el-dropdown-item :command="false">不压缩</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ExportFilter',

  props: {
    item: {
      type: Object,
      default() {
        return { s_name: '' }
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      exportDate: null,
      pickerOptions: {}
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
    this.pickerOptions = this.getPickerOptions()
  },

  methods: {
    show() {
      this.dialogVisible = true
    },
    hide() {
      this.dialogVisible = false
    },
    changeExportDate(arr) {
      if (arr) {
        this.exportDate[0] = this.$dayjs(arr[0]).format('YYYY-MM-DD')
        this.exportDate[1] = this.$dayjs(arr[1]).format('YYYY-MM-DD')
      }
    },
    isExcel(res) {
      let fileName = ''
      const data = res.data
      const disposition = res.headers['content-disposition']
      if (disposition) {
        fileName = window
          .decodeURI(disposition.split('=')[1], 'UTF-8')
          .replace(/"/g, '')
      }
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        const blob = new Blob([data])
        window.navigator.msSaveOrOpenBlob(blob, fileName)
      } else {
        /* 火狐谷歌的文件下载方式 */
        const blob = new Blob([data])
        const downloadElement = document.createElement('a')
        const href = window.URL.createObjectURL(blob)
        downloadElement.href = href
        downloadElement.download = fileName
        document.body.appendChild(downloadElement)
        downloadElement.click()
        document.body.removeChild(downloadElement)
        window.URL.revokeObjectURL(href)
      }
    },
    exportPoint(is_compress) {
      if (!this.exportDate) {
        this.$message.error('请先选择日期')
        return
      }
      const params = { arr: this.exportDate, is_compress }
      this.$emit('export', params)
    },
    getPickerOptions() {
      const that = this
      return {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [
          {
            text: '当日',
            onClick(picker) {
              const end = that.$dayjs().format('YYYY-MM-DD') + ' 23:59'
              const start = that.$dayjs().format('YYYY-MM-DD') + ' 00:00'
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '一周',
            onClick(picker) {
              const start =
                that.$dayjs().subtract(7, 'day').format('YYYY-MM-DD') + ' 00:00'
              const end = that.$dayjs().format('YYYY-MM-DD') + ' 23:59'
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '30天',
            onClick(picker) {
              const start =
                that.$dayjs().subtract(30, 'day').format('YYYY-MM-DD') +
                ' 00:00'
              const end = that.$dayjs().format('YYYY-MM-DD') + ' 23:59'
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.export-filter {
  .filter-items {
    .filter-item {
      @include flex(flex-start, flex-start);
      width: 100%;
      margin-bottom: 15px;
      .filter-item-label {
        font-size: 16px;
        line-height: 32px;
        width: 70px;
      }
      .filter-item-content {
        flex: 1;
        line-height: 32px;
        margin-left: 25px;
        .content-crumbs {
          color: #999;
        }
      }
    }
  }
}
</style>
