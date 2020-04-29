<template>
  <div class="latest">
    <h2>近期文章</h2>
    <ul class="late-list">
        <li v-for="item in latest" :key="item.id"><router-link :to="{name:'Article',query:{id:item.id}}">{{item.title}}</router-link></li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  created () {
    this.$store.dispatch('loadLatestAsync')
  },
  watch: {
    $route (to, from) {
      this.$store.dispatch('loadLatestAsync')
    }
  },
  computed: mapState({
    latest: state => state.MArticle.latest
  })
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
 .latest{
   padding 1rem 2rem
   h2{
     font-weight 400
     font-size 1.2rem
   }
   ul{
     padding 0
     li{
       list-style none
       a{
         text-decoration none
         color black
         font-size .9rem
       }
     }
   }
 }
</style>
