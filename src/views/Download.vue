<template>
  <v-layout justify-center align-center text-xs-center fill-height style="overflow: hidden">
    <div id="download-page--background"></div>
    <v-layout
      align-center
      column
      justify-center

    >
      <h1 class="display-2 font-weight-thin mb-3">Vuetify.js</h1>
      <h4 class="subheading">Build your application today!</h4>
    </v-layout>
  </v-layout>
</template>

<script>
  export default {
    name: "Download"
  }
</script>

<style scoped>
  #download-page--background {
    background: radial-gradient(ellipse at center, #5989df 0%, #1c1c36 100%);
    background: url('../assets/background/3.png') 0 0 / cover fixed;
    -webkit-background-size: auto 100%;
    background-size: auto 100%;

    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    height: 100vh;
    width: 100vw;
  }

  .modified-card {
    background: transparent;
  }

  .modified-card::before {
    background: url('../assets/background/3.png') 0 0 / cover fixed;
    content: '';
    margin: 0px;
    position: absolute;
    top: -24px;
    right: -24px;
    bottom: -24px;
    left: -24px;
    filter: blur(20px) saturate(.75);
    z-index: -1;
  }

  .modified-card .v-card__text {
    z-index: 4
  }
</style>
