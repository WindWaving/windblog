<template>
<div>
  <el-table :data="tableData" style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55"></el-table-column>
    <el-table-column label="标签id" prop="id" sortable></el-table-column>
    <el-table-column label="标签名称" prop="labelname" sortable></el-table-column>
    <el-table-column fixed="right" label="操作">
      <template slot-scope="scope">
        <el-button @click="handleTagDelete(scope.row)" type="text" size="small">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div style="margin-top: 20px">
      <el-button @click="toggleSelection()">取消选择</el-button>
      <el-button @click="deleteTagBatch()">批量删除</el-button>
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
        :current-page="Math.floor(tablePag.offset/tablePag.limit)+1"
        :page-sizes="[minPagesize,minPagesize*2,minPagesize*3]"
        :page-size="tablePag.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tablePag.total"
      ></el-pagination>
    </div>
</div>

</template>

<style scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
  data () {
    return {
      multipleSelection: [],
      minPagesize: 5,
      tablePag: {
        offset: 0,
        limit: 5,
        total: 0
      }
    }
  },
  created () {
    this.initTags()
    this.loadTags(false).then(() => {
      this.tablePag = this.pagination
    })
  },
  computed: mapState({
    tableData: state => state.MTag.tags,
    pagination: state => state.MTag.pagination
  }),
  methods: {
    ...mapMutations({
      initTags: 'initTags',
      setPagination: 'setPagination'
    }),
    ...mapActions({
      loadTags: 'loadTagsAsync'
    }),
    confirmDelete () {
      return this.$confirm('删除后不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => true).catch(() => false)
    },
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    clearSelection (rows) {
      this.$refs.multipleTable.clearSelection()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleTagDelete (row) {
      this.$confirm('删除后不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('delTagAsync', row.id).then(res => {
          if (res.data.err) {
            this.$message.error('删除出现错误')
          } else {
            this.loadTags(false)
          }
        })
      }).catch(() => {})
    },
    deleteTagBatch () {
      this.$confirm('删除后不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(this.multipleSelection)
        this.$store
          .dispatch('delTagBatch', this.multipleSelection)
          .then(res => {
            console.log('delte tag', res)
            if (res.data.err) {
              this.$message.error('删除出现错误')
            } else {
              this.loadTags(false)
            }
          })
      }).catch(() => {})
    },
    handleSizeChange (pagesize) {
      this.initTags()
      this.tablePag.offset = 0
      this.tablePag.limit = pagesize
      let payload = {
        oldPag: this.pagination,
        newPag: this.tablePag
      }
      this.setPagination(payload)
      this.loadTags(false)
    },
    handleCurrentChange (curpage) {
      this.tablePag.offset = (curpage - 1) * this.tablePag.limit
      let payload = {
        oldPag: this.pagination,
        newPag: this.tablePag
      }
      this.setPagination(payload)
      this.loadTags(false)
    }
  }
}
</script>
