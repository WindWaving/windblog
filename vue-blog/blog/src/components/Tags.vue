<template>
    <div class="tags">
        <h2>标签</h2>
        <ul>
            <li v-for="tag in tags" :key="tag.labelname"><router-link :to="{name:'ArtileList',query:{from:'tag',id:tag.id}}">{{tag.labelname}}</router-link></li>
        </ul>
        <div style="clear:both"></div>
        <a class="loadmore" @click="loadMore">加载更多</a>
    </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
  data () {
    return {
    }
  },
  methods: {
    ...mapActions({
      loadTags: 'loadTagsAsync'
    }),
    ...mapMutations({
      initTags: 'initTags',
      goNext: 'goNext'
    }),
    loadMore () {
      let nextOffset = this.pagination.offset + this.pagination.limit
      if (nextOffset < this.pagination.total) {
        this.goNext(this.pagination)
        this.loadTags(true)
      }
    }
  },
  created () {
    this.initTags()
    this.loadTags(true)
  },
  watch: {
    $route (to, from) {
      // 路由跳转后重新加载标签
      this.initTags()
      this.loadTags(true)
    }
  },
  computed: mapState({
    tags: state => state.MTag.tags,
    pagination: state => state.MTag.pagination
  })
}
</script>

<style lang="stylus" scoped>
 .tags{
     padding 1rem 2rem
     h2{
         font-weight 400
         font-size 1.2rem
     }
     ul{
         padding 0
         li{
             list-style none
             padding .1rem .2rem
             border 1px solid green
             float left
             margin-right .3rem
             margin-bottom .3rem
             a{
                 text-decoration none
                 color black
                 font-size .9rem
             }
         }
     }
     .loadmore{
       display block
     }
     a:hover{
       cursor pointer
     }
 }

</style>
