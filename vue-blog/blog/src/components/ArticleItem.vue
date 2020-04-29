<template>
    <div class="aitem">
        <h1>{{data.title}}</h1>
        <div class="sub">
            <span v-for="tag in data.tags" :key="tag.labelname">{{tag.labelname+" "}}</span>.
            <span>{{data.date}}</span>.
            <span>浏览</span>
            <span>{{data.clickTimes}}</span>
        </div>
        <div class="content">
            <p>
                {{data.content}}
            </p>
        </div>
        <div class="view">
            |<router-link :to="{name:'Article',query:{id:data.id}}">查看文章</router-link>|
        </div>
    </div>
</template>

<script>
export default {
  props: ['data']
}
</script>

<style lang="stylus" scoped>
.aitem{
    text-align center
    margin-bottom 4rem
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
    .view{
        a{
            color black
            text-decoration none
            margin 1rem
        }
    }
}
</style>
