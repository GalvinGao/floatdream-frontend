<template>
  <transition name="default-transition" mode="out-in">
    <router-view name="settings"/>
  </transition>
</template>

<script>
  export default {
    name: "SettingsLayout"
  }
</script>

<style scoped>

</style>
