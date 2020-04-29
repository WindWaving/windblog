<template>
  <div class="articlelist">
    <div v-for="item in articles" :key="item.id">
      <article-item :data="item"></article-item>
    </div>
  </div>
</template>

<script>
import ArticleItem from '@/components/ArticleItem'
import { mapState, mapMutations } from 'vuex'
export default {
  data () {
    return {
      query: {}
    }
  },
  components: {
    ArticleItem
  },
  computed: mapState({
    articles: state => state.MArticle.articles,
    pagination: state => state.MArticle.pagination
  }),
  created () {
    this.initArticles()
    this.query = this.$route.query
    this.loadArticles(this.query)
    document.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy () {
    document.removeEventListener('scroll', this.handleScroll)
  },
  watch: {
    $route (to, from) {
      this.initArticles()
      this.query = this.$route.query
      this.loadArticles(this.query)
    }
  },
  methods: {
    handleScroll () {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      let windowHeight = document.documentElement.clientHeight || document.body.clientHeight
      let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
      let nextOffset = this.pagination.offset + this.pagination.limit
      if (scrollTop + windowHeight + 10 >= scrollHeight && nextOffset < this.pagination.total) {
        this.loadMore()
      }
    },
    loadMore () {
      this.goNext(this.pagination)
      this.loadArticles(this.query)
    },
    ...mapMutations({
      initArticles: 'initArticles',
      goNext: 'goNext'
    }),
    loadArticles (query) {
      if (Object.keys(query).length > 0) {
        let {from, id} = this.$route.query
        if (from === 'tag') {
          this.$store.dispatch('loadListByTagAsync', {id})
        } else if (from === 'date') {
          this.$store.dispatch('loadListByDateAsync', {id})
        }
      } else {
        this.$store.dispatch('loadArticlesAsync', true)
      }
    }
  }
}
</script>

<style lang="stylus" scoped></style>
