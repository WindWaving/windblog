<template>
  <div class="table">
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%;text-align:center"
      :default-sort="{prop: 'createdAt', order: 'descending'}"
      @selection-change="handleSelectionChange"
    >
      <el-table-column prop="username" label="用户名" sortable></el-table-column>
      <el-table-column prop="createdAt" label="注册日期"  sortable></el-table-column>
      <el-table-column prop="counts" label="文章数量"  sortable></el-table-column>
    </el-table>
    <div style="margin-top: 20px">
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

<script>
import {mapState, mapMutations, mapActions} from 'vuex'
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
    this.loadUser().then(() => {
      this.tablePag = this.pagination
    })
  },
  computed: mapState({
    tableData: state => state.MUser.users,
    pagination: state => state.MUser.pagination
  }),
  methods: {
    ...mapMutations({
      initUser: 'initUser',
      setPagination: 'setPagination'
    }),
    ...mapActions({
      loadUser: 'loadUserAsync'
    }),
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleSizeChange (pagesize) {
      this.initUser()
      this.tablePag.offset = 0
      this.tablePag.limit = pagesize
      let payload = {
        oldPag: this.pagination,
        newPag: this.tablePag
      }
      this.setPagination(payload)
      this.loadUser()
    },
    handleCurrentChange (curpage) {
      this.tablePag.offset = (curpage - 1) * this.tablePag.limit
      let payload = {
        oldPag: this.pagination,
        newPag: this.tablePag
      }
      this.setPagination(payload)
      this.loadUser()
    }
  }
}

</script>
