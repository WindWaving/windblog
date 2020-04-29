<template>
  <div id="app">
    <navbar></navbar>
    <div class="container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'
import Home from '@/pages/Home'
import About from '@/pages/About'
// import store from './store'
export default {
  name: 'App',
  components: {
    Home,
    About,
    Navbar
  }
}
</script>

<style lang="stylus">
.container {
  padding: 1rem 5rem;

}
</style>>
