<template>
  <v-layout justify-center align-center fill-height style="overflow: hidden">
    <div id="login-page--background"></div>
    <v-flex xs12 sm10 md8 lg6>
      <v-card class="transparent pa-3" id="login-page--card" elevation="12">
        <v-alert
          :value="this.reasonMessage"
          type="info"
          class="mb-3"
        >
          {{ this.reasonMessage }}
        </v-alert>

        <v-form ref="form" lazy-validation @keyup.native.enter="submit" class="form">
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
            <v-btn large color="primary" @click="submit"
                   :loading="this.$store.state.auth.state === 'loading'"
                   :disabled="this.$v.$invalid || this.$store.state.auth.state === 'success' ||
                   this.$store.state.auth.state === 'loading'">提交
            </v-btn>
          </v-layout>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import {validationMixin} from 'vuelidate'
  import {required, helpers, minLength, maxLength} from 'vuelidate/lib/validators'

  export default {
    name: "Login",

    mixins: [validationMixin],

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
      password: ''
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
        }
        return ""
      }
    },

    methods: {
      submit() {
        this.$v.$touch();
        if (!this.$v.$invalid) {
          this.$store.dispatch('login', {
            username: this.username,
            password: this.password
          })
            .then(() => {
              if (this.$route.query.redirect) {
                this.$router.push(this.$route.query.redirect);
              } else {
                this.$router.push({name: 'Dashboard'})
              }
            })
            .catch((error) => {
              console.error('error with', error)
            })
        }
      }
    }

  }
</script>

<style scoped>
  #login-page--background {
    background: radial-gradient(ellipse at center, #5989df 0%, #1c1c36 100%);
    background: url('../assets/background/2.png') 0 0 / cover fixed;
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
    background: url('../assets/background/2.png') 0 0 / cover fixed;
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
