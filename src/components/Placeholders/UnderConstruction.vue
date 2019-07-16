<template>
  <v-layout justify-center align-center fill-height id="under-construction--page">
    <v-flex xs12 sm10 md8 lg6 text-xs-center>
      <v-card class="white--text pa-1 under-construction" elevation="24">
        <v-container>
          <h1 class="mb-3">功能建设中</h1>
          <p>前端小哥哥还在努力肝代码 ~(￣▽￣)~*</p>
        </v-container>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    name: "UnderConstruction"
  }
</script>

<style scoped>
#under-construction--page {
  background: repeating-linear-gradient(-45deg, rgba(168, 128, 36, .9), rgba(168, 128, 36, .9) 90px, rgba(0, 0, 0, .8) 90px, rgba(0, 0, 0, .8) 180px);
  z-index: 10;
}
.under-construction {
  background: rgba(0, 0, 0, .8);
}
</style>
