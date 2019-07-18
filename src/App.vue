<template>
  <v-app id="app-inner">
    <v-snackbar v-model="snackbar.enabled" color="error" :timeout="6000">
      {{ snackbar.text }}
      <v-btn
        dark
        flat
        @click="snackbar.enabled = false"
      >
        关闭
      </v-btn>
    </v-snackbar>
    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <router-link :to="{'name': 'Home'}" style="text-decoration: none">
        <div class="drawer-logo indigo darken-2 white--text font-serif-bold">
          一梦千年
        </div>
      </router-link>

      <v-list>
        <v-list-tile :to="{'name': 'Home'}">
          <v-list-tile-action>
            <v-icon>mdi-home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>首页</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile :to="{'name': 'About'}">
          <v-list-tile-action>
            <v-icon>mdi-account-group</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>关于我们</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile :to="{'name': 'Forum'}">
          <v-list-tile-action>
            <v-icon>mdi-forum</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>论坛 &nbsp;<v-icon small>mdi-open-in-new</v-icon>
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile :to="{'name': 'Download'}">
          <v-list-tile-action>
            <v-icon>mdi-download</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>下载</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-group
          prepend-icon="mdi-account-circle"
        >
          <template v-slot:activator>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>我的账户</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>

          <v-list-tile :to="{'name': 'Dashboard'}">
            <v-list-tile-content>
              <v-list-tile-title>仪表板</v-list-tile-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-icon>mdi-dashboard</v-icon>
            </v-list-tile-action>
          </v-list-tile>

          <v-list-tile :to="{'name': 'DashboardTopup'}">
            <v-list-tile-content>
              <v-list-tile-title>充值</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon>mdi-favorite-border</v-icon>
            </v-list-tile-action>
          </v-list-tile>

          <v-list-tile :to="{'name': 'DashboardSkinFactory'}">
            <v-list-tile-content>
              <v-list-tile-title>皮肤站</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon>mdi-face</v-icon>
            </v-list-tile-action>
          </v-list-tile>

          <v-list-tile :to="{'name': 'SettingsNickname'}">
            <v-list-tile-content>
              <v-list-tile-title>更改昵称</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon>mdi-account-details</v-icon>
            </v-list-tile-action>
          </v-list-tile>

        </v-list-group>

      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="indigo" dark fixed app>
      <v-toolbar-side-icon @click.stop="drawerSwitch"></v-toolbar-side-icon>
      <v-toolbar-title class="font-serif-bold">
        一梦千年
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <span v-if="this.$store.state.auth.state === 'success'"
            @mouseover="authButtonHovered = true"
            @mouseleave="authButtonHovered = false">
        <transition name="slide-x-reverse-transition" mode="out-in" duration="30">
          <v-btn
            @click="logout"
            v-if="authButtonHovered || authButtonLoggingOut"
            :loading="authButtonLoggingOut"
            style="overflow: hidden"
            round
          >
            <v-icon left>mdi-logout</v-icon> 退出登录
          </v-btn>
          <v-chip v-else class="mr-2" style="box-shadow: 0 0 0 4px rgba(0, 0, 0, .3)">
            <v-avatar class="deep-purple">{{this.$store.state.auth.username.slice(0, 1) || ''}}</v-avatar>
            {{this.$store.state.auth.username || ''}}
          </v-chip>
        </transition>
      </span>
      <span v-else>
        <v-btn round @click="redirectLogin"><v-icon left>mdi-exit-to-app</v-icon> 登录</v-btn>
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
                      small>{{ server.loading ? 'mdi-lan-pending' : (server.operating ? 'mdi-lan-connect' : 'mdi-lan-disconnect') }}</v-icon>
        {{ server.loading ? '获取中...' : (server.operating ? '正常' : '无法连接') }}
        <v-icon dark small>{{ server.loading ? '' : (server.operating ? server.icon : '')}}</v-icon>
        {{ server.loading ? '' : (server.operating ? `${server.latency}ms` : '') }}
      </span>
      <v-spacer></v-spacer>
      <span class="white--text">&copy; 2015-{{new Date().getFullYear()}} <span class="font-serif-bold">一梦千年</span></span>
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
          let latency = (data.latency / Math.pow(10, 6)).toPrecision(3);
          let latencyRate = latency > 200 ? 1 : (5 - Math.ceil(latency / 60));
          this.server = {
            loading: false,
            operating: data.operating,
            latency: latency,
            icon: `mdi-network-strength-${latencyRate}`
          }
        })
        .catch(() => {
          this.server = {
            loading: false,
            operating: false,
            latency: null,
            icon: null
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
        authButtonHovered: false,
        authButtonLoggingOut: false,
        snackbar: {
          enabled: false,
          text: false
        }
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
        this.authButtonLoggingOut = true;
        this.$store.dispatch('logout')
          .catch(err => {
            this.snackbar = {
              enabled: true,
              text: "登出请求失败：" + err
            }
          })
          .finally(() => {
            this.$router.push({name: 'Login'});
            this.authButtonLoggingOut = false;
          })
      }
    },
    computed: {}
  }
</script>

<style>
  .font-serif, h1, h2, h3, h4, h5, h6 {
    font-family: 'ZCOOL XiaoWei', cursive;
  }

  .font-serif-bold {
    font-family: 'ZCOOL XiaoWei', cursive;
    font-weight: 600;
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
    transition: all 225ms cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  .slide-fade-leave-active {
    transition: all 175ms cubic-bezier(0.895, 0.03, 0.685, 0.22);
  }

  .slide-fade-enter {
    transform: translateX(40px) scale(1);
    filter: blur(5px);
    opacity: 0;
  }

  .slide-fade-leave-to {
    transform: scale(0.9);
    filter: blur(10px) saturate(0);
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
