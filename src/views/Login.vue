<template>
  <v-layout justify-center align-center fill-height style="overflow: hidden">
    <div id="login-page--background"></div>
    <v-snackbar v-model="snackbar.enabled" :color="snackbar.color" :timeout="10000">
      {{ snackbar.text }}
      <v-btn
          dark
          flat
          @click="snackbar.enabled = false"
      >
        关闭
      </v-btn>
    </v-snackbar>
    <v-flex xs12 sm10 md8 lg6>
      <v-card class="transparent pa-3" id="login-page--card" elevation="12">
        <v-alert
          :value="this.reasonMessage"
          type="info"
          class="mb-3"
        >
          {{ this.reasonMessage }}
        </v-alert>

        <v-form ref="form" lazy-validation @keyup.native.enter="executeCaptcha" class="form">
          <v-container>
            <v-layout column>
              <h1 style="z-index: 2" class="mb-5 white--text">登录</h1>
              <v-text-field
                v-model.trim="username"
                :error-messages="usernameErrors"
                label="玩家名"
                required
                clearable
                box
                dark

                browser-autocomplete="username"

                @input="$v.username.$touch()"
                @blur="$v.username.$touch()"
              ></v-text-field>

              <v-text-field
                v-model="password"
                type="password"
                :error-messages="passwordErrors"
                label="游戏密码"
                required
                clearable
                box
                dark

                browser-autocomplete="current-password"

                @input="$v.password.$touch()"
                @blur="$v.password.$touch()"
              ></v-text-field>
            </v-layout>
          </v-container>
        </v-form>
        <v-card-actions>
          <v-layout justify-end>
            <vue-recaptcha sitekey="6Lceo6wUAAAAAMJaTYmEXnjyicUcuUu3a2xMtAYr"
                           :loadRecaptchaScript="true"
                           recaptchaHost="www.recaptcha.net"
                           ref="recaptcha"

                           @verify="onVerify">
              <v-btn large
                     color="primary"
                     @click="solvingCaptcha = true"
                     :loading="this.$store.state.auth.state === 'loading' || solvingCaptcha"
                     :disabled="this.$v.$invalid || this.$store.state.auth.state === 'success' ||
                   this.$store.state.auth.state === 'loading' || solvingCaptcha">提交
              </v-btn>
            </vue-recaptcha>
          </v-layout>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import VueRecaptcha from 'vue-recaptcha';
  import {validationMixin} from 'vuelidate'
  import {required, helpers, minLength, maxLength} from 'vuelidate/lib/validators'

  export default {
    name: "Login",

    mixins: [validationMixin],

    components: {
      VueRecaptcha
    },

    validations: {
      username: {
        required,
        isValidCharacters: helpers.regex('isValidCharacters', /^(?![_])([a-zA-Z0-9_]|[\u00ff-\uffff])+([^_])$/),
        isValidMinLength: minLength(2),
        isValidMaxLength: maxLength(20)
      },
      password: {
        required,
        isValidMinLength: minLength(2),
        isValidMaxLength: maxLength(20)
      }
    },

    data: () => ({
      username: '',
      password: '',
      snackbar: {
        enabled: false,
        text: '',
        color: ''
      },
      solvingCaptcha: false
    }),

    computed: {
      usernameErrors() {
        const errors = [];
        if (!this.$v.username.$dirty) return errors;
        !this.$v.username.required && errors.push('“玩家名” 为必填项');
        !this.$v.username.isValidCharacters && errors.push('“玩家名” 仅支持大小写字母、数字、所有中文字符及下划线（_）');
        (!this.$v.username.isValidMinLength || !this.$v.username.isValidMaxLength) && errors.push('“玩家名” 须为 2-20 位英文字符或 2-6 位中文字符');
        return errors
      },
      passwordErrors() {
        const errors = [];
        if (!this.$v.password.$dirty) return errors;
        !this.$v.password.required && errors.push('“游戏密码” 为必填项');
        (!this.$v.password.isValidMinLength || !this.$v.password.isValidMaxLength) && errors.push('“游戏密码” 须为 2-20 位字符');
        return errors
      },
      reasonMessage() {
        if (this.$route.query.reason === "sessionExpired") {
          return "登录信息已过期。为了您的账户安全，请重新登录"
        } else if (this.$route.query.reason === "authorizationFailed") {
          return "鉴权失败。为了您的账户安全，请重新登录"
        }
        return ""
      }
    },

    methods: {
      executeCaptcha() {
        this.$v.$touch();
        if (!this.$v.$invalid) {
          this.solvingCaptcha = true
          this.$refs.recaptcha.execute()
        }
      },
      onVerify(recaptchaResponse) {
        this.$v.$touch();
        if (!this.$v.$invalid) {
          this.$store.dispatch('login', {
            username: this.username,
            password: this.password,
            recaptcha: recaptchaResponse
          })
            .then(() => {
              if (this.$route.query.redirect) {
                this.$router.push(this.$route.query.redirect);
              } else {
                this.$router.push({name: 'Dashboard'})
              }

              this.snackbar = {
                enabled: true,
                text: `登录成功：欢迎回来，${this.username}`,
                color: 'success'
              }
            })
            .catch((error) => {
              this.snackbar = {
                enabled: true,
                text: `登录失败：${error.responseMessage}`,
                color: 'error'
              };
              this.$refs.recaptcha.reset()
            })
            .finally(() => {
              this.solvingCaptcha = false;
            })
        }
      }
    }

  }
</script>

<style scoped>
  #login-page--background {
    background: radial-gradient(ellipse at center, #5989df 0%, #1c1c36 100%);
    background: url('../assets/background/2.jpg') 0 0 / cover fixed;
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

  #login-page--card::before {
    background: url('../assets/background/2.jpg') 0 0 / cover fixed;
    content: '';
    margin: 0px;
    position: absolute;
    top: -48px;
    right: -48px;
    bottom: -48px;
    left: -48px;
    filter: blur(20px) saturate(.75);
    z-index: 0;
  }

  .form {
    text-shadow: 1px 1px 2px rgba(0, 0, 0, .3);
  }
</style>

<style>
  .grecaptcha-badge {
    bottom: 45px !important;
  }
</style>
