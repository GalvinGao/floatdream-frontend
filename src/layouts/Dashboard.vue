<template>
  <v-layout fill-height>
    <BackgroundCarousel :interval="15" />
    <transition name="slide-fade" mode="out-in" duration="175">
      <router-view name="dashboard" style="z-index: 5"/>
    </transition>
  </v-layout>

</template>

<script>
  import BackgroundCarousel from '@/components/BackgroundCarousel'
  export default {
    name: "DashboardLayout",
    components: {
      BackgroundCarousel
    }
  }
</script>
