<template>
  <div class="admin" v-if="this.$session.exists()">
    <el-tabs :tab-position="tabPosition" style="height: 200px;">
      <el-tab-pane label="文章管理">
        <article-table></article-table>
      </el-tab-pane>
      <el-tab-pane v-if="isSuper" label="标签管理">
        <tag-table></tag-table>
      </el-tab-pane>
      <el-tab-pane v-if="isSuper" label="用户管理">
        <user-table></user-table>
      </el-tab-pane>
    </el-tabs>
  </div>
  <div v-else></div>
</template>

<script>
import articleTable from '@/components/ArticleTable'
import tagTable from '@/components/TagTable'
import userTable from '@/components/UserTable'
export default {
  data () {
    return {
      tabPosition: 'top',
      isSuper: this.$session.get('user-role')
    }
  },
  components: {
    articleTable,
    tagTable,
    userTable
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (!vm.$session.exists()) {
        vm.$message({
          message: '访问当前页面需要登录，正在跳转首页',
          type: 'warning'
        })
        setTimeout(() => {
          vm.$router.push('/')
        }, 1500)
      }
    })
  }
}
</script>
<style lang="stylus" scoped></style>
