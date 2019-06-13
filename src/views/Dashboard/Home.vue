<template>
  <v-card
    class="mx-auto"
  >
    <v-card
      dark
      flat
    >
      <v-btn
        absolute
        bottom
        color="pink"
        right
        fab
      >
        <v-icon>close</v-icon>
      </v-btn>
      <v-parallax src="https://cdn.vuetifyjs.com/images/parallax/material.jpg" height="300" alt="Background"></v-parallax>
      <v-container fill-height>
        <v-layout align-center>
          <v-flex xs12 md6 lg4 column>
            <strong class="display-3 font-weight-regular mr-2">GalvinGao</strong>
          </v-flex>
          <v-flex xs12 md6 lg4 column>
            <v-layout column justify-end>
              <div class="headline font-weight-light">剩余 LB：1000</div>
              <div class="text-uppercase font-weight-light">最近赞助日期：2019.8.7 10:33</div>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-card>
</template>

<script>
  export default {
    name: "DashboardHome"
  }
</script>

<style scoped>

</style>
