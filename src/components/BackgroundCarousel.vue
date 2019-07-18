<template>
  <div class="carousel-background" ref="background" />
</template>

<script>
  export default {
    name: "BackgroundCarousel",
    data () {
      return {
        lastLoading: false,
        last: 1,
        lastUrl: "",
        timer: null
      }
    },
    props: {
      interval: Number
    },
    mounted () {
      this.updateBackground();
      this.timer = setInterval(() => {
        !this.lastLoading && this.updateBackground()
      }, 1000 * this.interval)
    },
    beforeDestroy () {
      clearInterval(this.timer)
    },
    methods: {
      getBackground() {
        let current = this.last;
        // avoid change to the same background than the last one
        while (current === this.last) {
          current = Math.floor(Math.random() * 16) + 1
        }
        this.last = current;
        // console.log(current)
        return require(`../assets/background/${current}.jpg`)
      },
      updateBackground() {
        let background = this.$refs.background;
        this.lastLoading = true;

        window.fetch(this.getBackground())
          .then((response) => {
            return response.blob();
          })
          .then((blob) => {
            let dataUrl = URL.createObjectURL(blob);
            background.style.backgroundImage = `url(${dataUrl})`;
            // console.log(`created ${dataUrl} | revoking ${this.lastUrl}`)

            !this.lastUrl && URL.revokeObjectURL(this.lastUrl);
            this.lastUrl = dataUrl
          })
          .finally(() => {
            this.lastLoading = false
          })
      }
    }
  }
</script>

<style scoped>
  .carousel-background {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;

    background-size: cover;
    background-position: center center;
    background-attachment: fixed;

    transition: background-image 2s cubic-bezier(0.165, 0.84, 0.44, 1);

    /*background-image: url("../assets/background/1.jpg");*/
    z-index: 0;
  }
</style>