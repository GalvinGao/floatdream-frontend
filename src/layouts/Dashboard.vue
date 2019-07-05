<template>
  <v-layout fill-height id="background">
    <transition name="slide-fade" mode="out-in" duration="175">
      <router-view name="dashboard"/>
    </transition>
  </v-layout>

</template>

<script>
  export default {
    name: "DashboardLayout"
  }
</script>

<style scoped>
  #background {
    background: radial-gradient(ellipse at center, #5989df 0%, #1c1c36 100%);
    background: url('../assets/background/1.png') 0 0 / cover fixed;
    -webkit-background-size: auto 100%;
    background-size: auto 100%;
  }
</style>
