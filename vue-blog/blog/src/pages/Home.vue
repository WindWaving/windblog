<template>
  <div class="home">
    <div class="passages">
      <router-view></router-view>
    </div>
    <div class="sidebar">
      <tag-latest></tag-latest>
      <classify></classify>
      <tags></tags>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'
import ArticleList from '@/components/ArticleList'
import Article from '@/components/Article'
import TagLatest from '@/components/TagLatest'
import Classify from '@/components/Classify'
import Tags from '@/components/Tags'
export default {
  components: {
    Navbar,
    ArticleList,
    Article,
    TagLatest,
    Classify,
    Tags
  }
}
</script>

<style lang="stylus" scoped>
.passages {
  width: 66.6%;
  padding: 1rem 2rem;
  box-sizing: border-box;
  float: left;
}

.sidebar {
  width: 33.4%;
  float: right;
  padding: 1rem;
  box-sizing: border-box;
}
</style>
