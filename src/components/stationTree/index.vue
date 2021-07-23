<template>
  <div>
    <el-cascader
      :props="props"
      style="width:400px"
      @change="cascaderChange"
    />
  </div>
</template>

<script>
import { company, factory, area, cell } from '@/api/station'

export default {
  name: 'StationTree',

  props: {
    level: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      props: {
        lazy: true,
        lazyLoad(node, resolve) {
          const { level } = node
          let keysArr = []

          if (level === 0) {
            company(1).then((res) => {
              const arr = (res.data.result && res.data.result.stations) || []
              keysArr = arr.map((v) => ({
                value: v.uid,
                label: v.s_name
              }))

              resolve(keysArr)
            })
          } else if (node.level === 1) {
            const { value } = node.data
            factory(value, 1).then((res) => {
              const arr = (res.data.result && res.data.result.stations) || []

              keysArr = arr.map((v) => ({
                value: v.uid,
                label: v.s_name
              }))

              resolve(keysArr)
            })
          } else if (node.level === 2) {
            const { value } = node.data

            area(value, 1).then((res) => {
              const arr = (res.data.result && res.data.result.stations) || []
              keysArr = arr.map((v) => ({
                value: v.uid,
                label: v.s_name
              }))

              return resolve(keysArr)
            })
          } else if (node.level === 3) {
            const { value } = node.data

            cell(value, 1).then((res) => {
              const arr = (res.data.result && res.data.result.stations) || []
              keysArr = arr.map((v) => ({
                value: v.uid,
                label: v.s_name,
                leaf: true
              }))

              return resolve(keysArr)
            })
          }
        }
      }
    }
  },
  computed: {},
  watch: {},

  created() {},

  mounted() {},

  methods: {
    cascaderChange(arr) {
      this.$emit('select', arr)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
