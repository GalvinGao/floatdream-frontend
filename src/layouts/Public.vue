<template>
  <v-layout fill-height>
    <BackgroundCarousel :interval="30" />
    <transition name="default-transition" mode="out-in">
      <router-view name="public" style="z-index: 5"/>
    </transition>
  </v-layout>

</template>

<script>
  import BackgroundCarousel from '@/components/BackgroundCarousel'
  export default {
    name: "PublicLayout",
    components: {
      BackgroundCarousel
    }
  }
</script>
