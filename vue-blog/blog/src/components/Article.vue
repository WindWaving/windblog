<template>
    <div class="article">
        <h1>{{curArt.title}}</h1>
        <div class="sub">
            <span v-for="tag in curArt.tags" :key="tag.labelname">{{tag.labelname+" "}}</span>.
            <span>{{curArt.date}}</span>.
            <span>浏览</span>
            <span>{{curArt.clickTimes}}</span>
        </div>
        <div class="content">
            {{curArt.content}}
        </div>
    </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  computed: mapState({
    curArt: state => state.MArticle.curArt
  }),
  created () {
    let {id} = this.$route.query
    this.$store.dispatch('loadArtByIdAsync', id)
  },
  watch: {
    $route (to, from) {
      let {id} = this.$route.query
      this.$store.dispatch('loadArtByIdAsync', id)
    }
  }
}
</script>

<style lang="stylus" scoped>
.article{
    text-align center
    width 100%
    h1{
        color #333
        font-size 1.5rem
        font-weight 400
    }
    .sub{
        margin 1.5rem
        span{
            font-size .8rem
            color #666
        }
    }
    .content{
        text-align justify
        margin 2rem 0
    }
}
</style>
