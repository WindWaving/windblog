<template>
  <div class="table">
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      :default-sort="{prop: 'date', order: 'descending'}"
      @selection-change="handleSelectionChange"
    >
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="标题：">
            <span>{{ props.row.title }}</span>
          </el-form-item><br>
          <el-form-item label="标签：">
            <span>{{ props.row.tags.map(tag=>tag.labelname) }}</span>
          </el-form-item><br>
          <el-form-item label="作者：">
            <span>{{ props.row.author }}</span>
          </el-form-item><br>
          <el-form-item label="内容简略：">
            <span>{{ props.row.content.length>60? props.row.content.substr(0,60)+'......':props.row.content }}</span>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>

      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="title" label="标题" sortable></el-table-column>
      <el-table-column prop="author" label="作者"  sortable></el-table-column>
      <el-table-column prop="date" label="日期" sortable></el-table-column>
      <el-table-column prop="clickTimes" label="浏览量" sortable></el-table-column>
      <el-table-column fixed="right" label="操作" >
        <template slot-scope="scope">
          <!-- 只有文章作者可以编辑文章 -->
          <el-button v-if="userRole===0" @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <el-button @click="toggleSelection()">取消选择</el-button>
      <el-button @click="deleteBatch()">批量删除</el-button>
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
import {mapState, mapActions, mapMutations} from 'vuex'
export default {
  data () {
    return {
      multipleSelection: [],
      minPagesize: 5,
      tablePag: {
        offset: 0,
        limit: 5,
        total: 0
      },
      userRole: this.$session.get('user-role'), // 0为普通用户，1为管理员
      username: this.$session.get('blog-user')
    }
  },
  created () {
    this.initArticles()
    if (this.userRole === 1) {
      this.loadArticles(false).then(() => {
        this.tablePag = this.pagination
      })
    } else {
      this.loadArtByUser(this.username).then(() => {
        this.tablePag = this.pagination
      })
    }
  },
  computed: mapState({
    tableData: state => state.MArticle.articles,
    pagination: state => state.MArticle.pagination
  }),
  methods: {
    ...mapActions({
      loadArticles: 'loadArticlesAsync',
      loadArtByUser: 'loadArtByUser'
    }),
    ...mapMutations({
      initArticles: 'initArticles',
      setPagination: 'setPagination'
      // goNext: 'goNext'
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
    clearSelection (rows) {
      this.$refs.multipleTable.clearSelection()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleEdit (row) {
      this.$router.push({name: 'UpdateArticle', params: {article: row}})
    },
    handleDelete (row) {
      this.$confirm('删除后不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('delArticleAsync', row.id)
          .then(res => {
            if (res.data.err) {
              this.$message.error('删除出现错误')
            } else {
              this.userRole === 1 ? this.loadArticles(false) : this.loadArtByUser(this.username)
            }
          })
      }).catch(() => {})
    },
    deleteBatch () {
      this.$confirm('删除后不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('delArticleBatch', this.multipleSelection).then(res => {
          if (res.data.err) {
            this.$message.error('删除出现错误')
          } else {
            this.userRole === 1 ? this.loadArticles(false) : this.loadArtByUser(this.username)
          }
        })
      }).catch(() => {})
    },
    handleSizeChange (pagesize) {
      this.initArticles()
      this.tablePag.offset = 0
      this.tablePag.limit = pagesize
      let payload = {
        oldPag: this.pagination,
        newPag: this.tablePag
      }
      this.setPagination(payload)
      this.userRole === 1 ? this.loadArticles(false) : this.loadArtByUser(this.username)
    },
    handleCurrentChange (curpage) {
      this.tablePag.offset = (curpage - 1) * this.tablePag.limit
      let oldPag = this.pagination
      let newPag = this.tablePag
      this.setPagination({oldPag, newPag})
      this.userRole === 1 ? this.loadArticles(false) : this.loadArtByUser(this.username)
    }
  }
}
</script>
