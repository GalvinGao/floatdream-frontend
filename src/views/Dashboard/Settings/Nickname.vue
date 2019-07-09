<template>
  <v-layout justify-center align-center fill-height>
    <v-snackbar v-model="snackbar.enabled" :color="snackbar.success" :timeout="6000">
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
        <v-form ref="form" lazy-validation @keyup.native.enter="submit" class="form">
          <v-container>
            <v-layout column>
              <h1 style="z-index: 2" class="mb-5 black--text">更改昵称</h1>
              <v-text-field
                v-model="nickname"
                type="text"
                :error-messages="nicknameErrors"
                label="昵称"
                required
                clearable
                box
                dark

                @input="$v.nickname.$touch()"
                @blur="$v.nickname.$touch()"
              ></v-text-field>
            </v-layout>
          </v-container>
        </v-form>
        <v-card-actions>
          <v-layout justify-end>
            <v-btn large color="primary" @click="submit" :disabled="this.$v.$invalid || loading"
            :loading="loading">提交</v-btn>
          </v-layout>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import {validationMixin} from 'vuelidate'
  import {required, helpers, minLength, maxLength} from 'vuelidate/lib/validators'
  import settings from '@/api/settings'

  const checkDuplication = (v, vm) => vm.$store.state.account.nickname !== v;

  export default {
    name: "SettingsNickname",

    mixins: [validationMixin],

    validations: {
      nickname: {
        required,
        isValidCharacters: helpers.regex('isValidCharacters', /^(?![_])([a-zA-Z0-9_]|[\u00ff-\uffff])+([^_])$/),
        isValidMinLength: minLength(2),
        isValidMaxLength: maxLength(20),
        isNotDuplicated: checkDuplication
      }
    },

    data: () => ({
      nickname: '',
      snackbar: {
        enabled: false,
        text: '',
        color: ''
      },
      loading: false,
      ajaxError: ''
    }),

    computed: {
      nicknameErrors() {
        const errors = [];
        if (!this.$v.nickname.$dirty) return errors;
        !this.$v.nickname.required && errors.push('“昵称” 为必填项');
        !this.$v.nickname.isValidCharacters && errors.push('“昵称” 不能以下划线（_）作为开头或结尾');
        (!this.$v.nickname.isValidMinLength || !this.$v.nickname.isValidMaxLength) && errors.push('“昵称” 须为 2-20 位英文字符或 2-6 位中文字符');
        !this.$v.nickname.isNotDuplicated && errors.push('“昵称” 不能与上一次设置的昵称一致');
        this.ajaxError && errors.push(this.ajaxError);
        return errors
      }
    },
    methods: {
      submit() {
        this.$v.$touch();
        if (!this.$v.$invalid) {
          this.loading = true;
          settings.updateNickname({nickname: this.nickname})
            .then(() => {
              this.$store.commit('nickname_changed', this.nickname);
              this.snackbar = {
                enabled: true,
                text: '昵称修改成功',
                color: 'success'
              };
              this.$v.nickname.$reset()
            })
            .catch((err) => {
              this.snackbar = {
                enabled: true,
                text: `昵称修改失败：${err.responseMessage}`,
                color: 'error'
              };
              this.ajaxError = err
            })
            .finally(() => {
              this.loading = false
            })
        }
      }
    }

  }
</script>

<style scoped>
  #login-page--card::before {
    background: url('../../../assets/background/1.png') 0 0 / cover fixed;
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
