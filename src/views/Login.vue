<template>
  <v-layout justify-center align-center fill-height>
    <div id="login-page--background"></div>
    <v-flex xs12 sm10 md8 lg6>
      <v-card class="transparent pa-3" id="login-page--card" elevation="12">
        <v-form ref="form" lazy-validation @keyup.native.enter="submit">
          <v-container>
            <v-layout column>
              <h1 style="z-index: 2" class="mb-3">登录</h1>
              <v-text-field
                v-model="username"
                :error-messages="usernameErrors"
                label="服务器内 ID"
                required
                clearable
                @input="$v.username.$touch()"
                @blur="$v.username.$touch()"
              ></v-text-field>

              <v-text-field
                v-model="password"
                type="password"
                :error-messages="passwordErrors"
                label="服务器内登录密码"
                required
                clearable
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
                   this.$store.state.auth.state === 'loading'">提交</v-btn>
          </v-layout>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import {validationMixin} from 'vuelidate'
  import {required} from 'vuelidate/lib/validators'

  export default {
    name: "Login",

    mixins: [validationMixin],

    validations: {
      username: {required},
      password: {required}
    },

    data: () => ({
      username: '',
      password: ''
    }),

    computed: {
      usernameErrors() {
        const errors = [];
        if (!this.$v.username.$dirty) return errors;
        !this.$v.username.required && errors.push('“服务器内 ID” 为必填项');
        return errors
      },
      passwordErrors() {
        const errors = [];
        if (!this.$v.password.$dirty) return errors;
        !this.$v.password.required && errors.push('“服务器内登录密码” 为必填项');
        return errors
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
            .then((data) => {
              if (this.$route.query.redirect) {
                this.$router.push(this.$route.query.redirect);
              } else {
                this.$router.push({name: 'Dashboard'})
              }

              console.log('success with', data)
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
  background: url('../assets/background/1.png')  0 0 / cover fixed;
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
    background: url('../assets/background/1.png') 0 0 / cover fixed;
    content: '';
    margin: 0px;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    filter: blur(10px);
    z-index: 0;
  }
</style>
