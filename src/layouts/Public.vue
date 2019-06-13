<template>
  <transition name="default-transition" mode="out-in">
    <router-view name="public"/>
  </transition>
</template>

<script>
  export default {
    name: "PublicLayout"
  }
</script>

<style scoped>

</style>
