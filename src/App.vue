<template>
  <v-app id="app-inner">
    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <router-link :to="{'name': 'Home'}">
        <div class="drawer-logo indigo darken-2 white--text">
          FloatDream
        </div>
      </router-link>

      <v-list>
        <v-list-tile :to="{'name': 'Home'}">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>首页</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile :to="{'name': 'About'}">
          <v-list-tile-action>
            <v-icon>people</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>关于我们</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile :to="{'name': 'Forum'}">
          <v-list-tile-action>
            <v-icon>forum</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>论坛 &nbsp;<v-icon small>open_in_new</v-icon>
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile :to="{'name': 'Download'}">
          <v-list-tile-action>
            <v-icon>cloud_download</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>下载</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-group
          prepend-icon="account_circle"
        >
          <template v-slot:activator>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>我的 FloatDream</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>

          <v-list-tile :to="{'name': 'Dashboard'}">
            <v-list-tile-content>
              <v-list-tile-title>仪表板</v-list-tile-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-icon>dashboard</v-icon>
            </v-list-tile-action>
          </v-list-tile>

          <v-list-tile :to="{'name': 'DashboardSponsor'}">
            <v-list-tile-content>
              <v-list-tile-title>赞助</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon>favorite_border</v-icon>
            </v-list-tile-action>
          </v-list-tile>

          <v-list-tile :to="{'name': 'DashboardSkinFactory'}">
            <v-list-tile-content>
              <v-list-tile-title>皮肤站</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon>face</v-icon>
            </v-list-tile-action>
          </v-list-tile>

          <v-list-tile :to="{'name': 'SettingsNickname'}">
            <v-list-tile-content>
              <v-list-tile-title>更改昵称</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon>account_box</v-icon>
            </v-list-tile-action>
          </v-list-tile>

        </v-list-group>

      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="indigo" dark fixed app>
      <v-toolbar-side-icon @click.stop="drawerSwitch"></v-toolbar-side-icon>
      <v-toolbar-title>FloatDream</v-toolbar-title>
      <v-spacer></v-spacer>
      <span v-if="this.$store.state.auth.state === 'success'"
            @mouseover="authButtonHovered = true"
            @mouseleave="authButtonHovered = false">
        <transition name="slide-x-reverse-transition" mode="out-in" duration="10">
          <v-btn
            @click="logout"
            v-if="authButtonHovered"
            style="overflow: hidden"
            round
          >
            <v-icon left>logout</v-icon> 退出登录
          </v-btn>
          <v-chip v-else class="mr-2" style="box-shadow: 0 0 0 4px rgba(0, 0, 0, .3)">
            <v-avatar class="deep-purple">{{this.$store.state.auth.username.slice(0, 1) || ''}}</v-avatar>
            {{this.$store.state.auth.username || ''}}
          </v-chip>
        </transition>
      </span>
      <span v-else>
        <v-btn round @click="redirectLogin"><v-icon left>exit_to_app</v-icon> 登录</v-btn>
      </span>
    </v-toolbar>
    <v-content>
      <transition name="slide-fade" mode="out-in">
        <router-view/>
      </transition>
    </v-content>
    <v-footer color="indigo" class="pa-3" app>
      <span class="white--text" v-if="this.$vuetify.breakpoint.smAndUp">
        服务器状态：<v-icon dark
                      small>{{ server.loading ? 'hourglass_full' : (server.operating ? 'done' : 'error') }}</v-icon>
        {{ server.loading ? '获取中...' : (server.operating ? '正常' : '异常') }}
        {{ server.loading ? '' : (server.operating ? `(ping: ${server.latency}ms)` : '') }}
      </span>
      <v-spacer></v-spacer>
      <span class="white--text">&copy; 2015-{{new Date().getFullYear()}} FloatDream</span>
    </v-footer>
  </v-app>
</template>

<script>
  import status from './api/status'

  export default {
    name: 'App',
    components: {},
    beforeMount() {
      status.get()
        .then(({data}) => {
          this.server = {
            loading: false,
            operating: data.operating,
            latency: data.latency
          }
        })
    },
    data() {
      return {
        drawer: false,
        server: {
          loading: true,
          operating: true,
          latency: -1
        },
        authButtonHovered: false
      }
    },
    methods: {
      drawerSwitch() {
        this.drawer = !this.drawer;
      },
      redirectLogin() {
        this.$router.push({name: 'Login'})
      },
      logout() {
        this.authButtonHovered = false;
        this.$store.dispatch('logout');
        this.$router.push({name: 'Login'})
      }
    },
    computed: {}
  }
</script>

<style>
  .font-serif, h1, h2, h3, h4, h5, h6 {
    font-family: 'Noto Serif SC', serif;
  }

  .default-transition-enter-active {
    transition: all 225ms cubic-bezier(0.0, 0.0, 0.2, 1);
  }

  .default-transition-leave-active {
    transition: all 275ms cubic-bezier(0.4, 0.0, 1, 1);
  }

  .default-transition-enter {
    filter: blur(5px);
    opacity: 0;
  }

  .default-transition-leave-to {
    filter: blur(3px);
    opacity: 0;
  }

  .slide-fade-enter-active {
    transition: all 225ms cubic-bezier(0.0, 0.0, 0.2, 1);
  }

  .slide-fade-leave-active {
    transition: all 275ms cubic-bezier(0.4, 0.0, 1, 1);
  }

  .slide-fade-enter {
    transform: translateX(50px) scale(1);
    filter: blur(5px);
    opacity: 0;
  }

  .slide-fade-leave-to {
    transform: scale(0.8);
    filter: blur(5px);
    opacity: 0;
  }

  .drawer-logo {
    height: 128px;
    font-size: 28px;
    line-height: 128px;
    text-align: center;
  }

  html {
    overflow-y: visible;
  }

  #not-found-page .v-progress-circular__overlay {
    transition-duration: 50ms !important;
  }
</style>
