<template>
    <div class="classify">
        <h2>文章归档</h2>
        <ul>
            <li v-for="item in yearMons" :key="item.year">
                <h4>{{item.year}}年</h4>
                <ul class="month-box">
                    <li class="month" v-for="m in item.months" :key="m.month"><router-link :to="{name:'ArtileList',query:{from:'date',id:{year:item.year,month:m.month}}}">{{m.month}}月</router-link></li>
                </ul>
                <div class="clear"></div>
            </li>
        </ul>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  created () {
    this.$store.commit('clearDates')
    this.$store.dispatch('loadYearsAsync')
    // [{year:xxx,months:[{month:xx},{}]},{}]
  },
  computed: mapState({
    yearMons: state => state.MArticle.yearMons
  })
//   watch: {
//     $route (to, from) {
//       this.$store.commit('clearDates')
//       this.$store.dispatch('loadYearsAsync')
//     }
//   }
}
</script>

<style lang="stylus" scoped>
  .classify{
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
      .month-box{
          .month{
              padding .2rem .8rem
              background #ddd
              float left
              margin .2rem .5rem
          }
      }
      .clear{
          clear both
      }
  }
</style>
