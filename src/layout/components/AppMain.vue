<template>
  <section class="app-main">
    <!--
      v-slot="{ Component }"
      router-view组件使用插槽的时候,可以解构出当前要渲染的组件Component
      然后又使用 <component :is="Component" /> 进行了动态渲染
    -->
    <router-view v-slot="{ Component }" :key="$route.path">
      <transition name="fade-transform" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </section>
</template>

<script lang="ts">
  export default {
    name: 'AppMain'
  }
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  padding: 20px;
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
.fixed-header+.app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
