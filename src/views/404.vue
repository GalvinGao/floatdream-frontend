<template>
  <v-container fluid grid-list-xl fill-height id="not-found-page">
    <v-layout justify-center align-center fill-height text-xs-center row class="white--text"
               v-bind="binding">
      <v-flex md5 class="mt-4">
        <img src="../assets/unknownTexture.png" class="unknown-texture" />
      </v-flex>
      <v-flex md5 text-xs-left>
        <h1 class="display-2 mb-3 mt-sm-3">404 页面未找到</h1>
        <v-progress-circular
          :value="countdown.percentage"
          color="blue-grey"
          rotate="-90"
        >
          {{ countdown.display }}
        </v-progress-circular>
        <p class="d-inline-block ml-2">即将回到首页</p>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    name: "NotFound",
    data () {
      return {
        countdown: {
          percentage: -1.0,
          display: -1,
          start: null,
          duration: null,
          timer: null
        }
      }
    },
    mounted() {
      this.countdown.start = new Date().getTime();
      this.countdown.duration = 5000;
      this.updateCountdown();
      this.countdown.timer = setInterval(() => {
        requestAnimationFrame(() => {
          this.updateCountdown()
        })
      }, 50)
    },
    methods: {
      updateCountdown() {
        let elapsed = new Date().getTime() - this.countdown.start;
        this.countdown.percentage = (elapsed / this.countdown.duration) * 100;

        let display = (this.countdown.duration - elapsed) / 1000;
        this.countdown.display = Math.round(display);
        if (elapsed > this.countdown.duration) {
          clearInterval(this.countdown.timer);
          this.$router.push({name: 'Home'})
        }
      }
    },
    computed: {
      binding() {
        const binding = {};
        if (this.$vuetify.breakpoint.smAndDown) binding.column = true;
        return binding
      }
    }
  }
</script>

<style scoped>
  @keyframes flashing {
    0% {
      filter: drop-shadow(0 0 0px rgba(248, 0, 248, 0.4))
    }
    100% {
      filter: drop-shadow(0 0 55px rgba(248, 0, 248, 0.7))
    }
  }

  .unknown-texture {
    animation: flashing 4s alternate infinite cubic-bezier(0.455, 0.03, 0.515, 0.955);
    max-width: 100%;
  }

  #not-found-page {
    /*background: linear-gradient(45deg, #850085 25%, transparent 25%, transparent 75%, #850085 75%,  #850085),*/
    /*linear-gradient(-45deg, #850085 25%, transparent 25%, transparent 75%,  #850085 75%, #850085), #000000;*/
    /*background-size: 80px 80px;*/

    background: #0e0e0e;
    border-color: #0e0e0e;
  }
</style>
