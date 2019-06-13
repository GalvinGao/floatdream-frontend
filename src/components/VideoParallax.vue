<template>
  <v-layout align-space-between justify-space-between column fill-height>
    <div class="video-container">
      <video src="@/assets/background/video.webm" autoplay="autoplay" preload="auto" muted="muted" playsinline="playsinline"
             class="video"
             loop="loop">
      </video>
    </div>
    <v-layout justify-center align-center class="video-text-container" tag="header">
      <v-flex text-xs-center>
        <h1 class="white--text mb-2 display-1 text-xs-center">FloatDream</h1>
        <div class="white--text subheading mb-3 text-xs-center">一个很骚的服务器（？</div>
      </v-flex>
    </v-layout>
  </v-layout>
</template>

<script>
  export default {
    name: "VideoParallax"
  }
</script>

<style scoped>
.video-container {
  position: absolute;
  top: 0;
  left: 0;
}

.video-container > video {
  width: 100%;
  height: 90vh;
  object-fit: cover;
}

  .video-text-container {
    position: absolute;
    top: 0;
    left: 0;
    height: 90vh;
    width: 100%;
    background: linear-gradient(to top right, rgba(198, 255, 221, 1), rgba(251, 215, 134, .3), rgba(247, 121, 125, 0));
  }
</style>
