<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
  export default {
    data() {
      return {
        allowBack: this.$store.state.allowBack
      }
    },
    mounted() {
      window.onpopstate = () => {
        if (!this.allowBack) { //    这个allowBack 是存在vuex里面的变量
          history.go(1)
        }
      }
    }
  }
</script>
<style lang="scss">
  @import "assets/css/font.css"
</style>