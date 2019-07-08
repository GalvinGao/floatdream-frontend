<template>
  <v-layout justify-center align-center fill-height>
    <v-snackbar v-model="snackbar.enabled" :color="snackbar.color" :timeout="6000">
      {{ snackbar.text }}
      <v-btn
        dark
        flat
        @click="snackbar.enabled = false"
      >
        关闭
      </v-btn>
    </v-snackbar>
    <v-flex xs12 sm10 md10 lg6>
      <v-container>
        <v-stepper v-model="stepNow" class="mx-auto" style="border-radius: 4px;">
          <v-stepper-header>
            <v-stepper-step :editable="stepNow < 3" :complete="stepNow > 1" step="1">充值</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step :complete="stepNow > 2" step="2">确认信息</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step :complete="stepNow > 3" step="3">选择支付方式</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step :complete="stepNow > 4" step="4">支付</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step :complete="stepNow === 5" step="5">结果</v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">
              <h1>充值</h1>
              <v-form ref="form" lazy-validation>
                <v-container>
                  <v-layout column>
                    <v-text-field
                      v-model="price"
                      label="金额"
                      prepend-icon="attach_money"
                      required
                      persistent-hint
                      :hint="getPriceHint()"

                      :loading="itemLoading"

                      :error-messages="priceErrors"
                      @input="$v.price.$touch()"
                      @blur="$v.price.$touch()"

                      @keypress.enter.prevent="isFormValid() ? stepNow = 2 : null"
                    ></v-text-field>
                  </v-layout>
                </v-container>
              </v-form>

              <v-btn
                color="primary"
                class="right mr-1 mt-4"
                :disabled="!isFormValid()"
                @click="stepNow = 2"
              >
                下一步
                <v-icon right>chevron_right</v-icon>
              </v-btn>
              <v-slide-x-reverse-transition>
                <v-card class="ml-1 mt-4 right indigo font-weight-bold white--text" elevation="4" dense
                        v-if="isFormValid()">
                  <v-card-title class="pt-2 pb-2 pl-3 pr-3">
                    总计：RMB {{this.transaction.price.display}}
                  </v-card-title>
                </v-card>
              </v-slide-x-reverse-transition>

            </v-stepper-content>

            <v-stepper-content step="2">
              <h1>订单确认</h1>
              <v-alert
                :value="true"
                type="info"
                class="mt-3 mb-3"
              >
                请在充值前再三确认所有信息。我们将不予受理除系统故障外的其他任何退款申请，敬请谅解
              </v-alert>

              <v-card class="ml-1 mr-1 mt-3" elevation="4">
                <v-card-title>
                  <v-flex xs12 class="ma-2">
                    <h3>请确认您将为以下 FloatDream 账户进行充值</h3>
                  </v-flex>
                  <v-list>
                    <v-list-tile>
                      <v-list-tile-action>
                        <v-icon color="indigo">account_circle</v-icon>
                      </v-list-tile-action>

                      <v-list-tile-content>
                        <v-list-tile-title>{{ this.$store.state.auth.username }}</v-list-tile-title>
                        <v-list-tile-sub-title>游戏 ID</v-list-tile-sub-title>
                      </v-list-tile-content>
                    </v-list-tile>

                  </v-list>
                </v-card-title>
              </v-card>
              <v-card class="ml-1 mr-1 mt-3" elevation="4">
                <v-card-title>
                  <v-flex xs12 class="ma-2">
                    <h3>请确认充值金额</h3>
                  </v-flex>
                  <v-list>
                    <v-list-tile>
                      <v-list-tile-action>
                        <v-icon color="indigo">attach_money</v-icon>
                      </v-list-tile-action>

                      <v-list-tile-content>
                        <v-list-tile-title>RMB {{ this.transaction.price.display }}</v-list-tile-title>
                        <v-list-tile-sub-title>支付金额</v-list-tile-sub-title>

                      </v-list-tile-content>
                    </v-list-tile>
                  </v-list>
                </v-card-title>
              </v-card>

              <v-btn
                color="primary"
                class="right mr-1 mt-4"
                @click="stepNow = 3"
              >
                确认
                <v-icon right>done</v-icon>
              </v-btn>
            </v-stepper-content>

            <v-stepper-content step="3">
              <h1>选择支付方式</h1>

              <v-flex text-xs-center>
                <h1 class="display-2 font-weight-light my-4">RMB {{this.transaction.price.display}}</h1>
              </v-flex>

              <v-divider></v-divider>

              <v-list :two-line="$vuetify.breakpoint.smAndUp" :three-line="$vuetify.breakpoint.xsOnly" class="transparent">
                <v-list-tile avatar ripple v-for="method in this.paymentMethods" :key="method.id" @click="submitOrder(method)" :disabled="isDisabledMethod(method)">
                  <v-list-tile-avatar v-html="method.icon"></v-list-tile-avatar>

                  <v-list-tile-content>
                    <v-list-tile-title>{{ method.name }}</v-list-tile-title>
                    <v-list-tile-sub-title>
                      <span v-if="isDisabledMethod(method)">
                        <v-icon size="medium">close</v-icon> 暂不支持手机端{{method.name}}，请在电脑端操作
                      </span>
                      <span v-else-if="$vuetify.breakpoint.xsOnly">
                        <v-icon size="medium">exit_to_app</v-icon> 跳转 {{method.app}} APP 进行支付
                      </span>
                      <span v-else>
                        <v-icon size="medium">center_focus_weak</v-icon> 扫描二维码进行支付
                      </span>
                    </v-list-tile-sub-title>
                  </v-list-tile-content>

                  <v-list-tile-action>
                    <v-progress-circular indeterminate color="primary"
                                         v-if="isSelectedPaymentMethod(method.id) && payment.submitting"/>
                  </v-list-tile-action>
                </v-list-tile>
              </v-list>

            </v-stepper-content>

            <v-stepper-content step="4">
              <h1>支付</h1>

              <v-layout justify-center class="py-4" style="min-height: 300px">
                <v-flex>
                  <v-dialog v-model="dialog" persistent max-width="290">
                    <v-card>
                      <v-card-title class="headline">
                        <span v-show="$vuetify.breakpoint.smAndUp">扫描二维码以</span>支付</v-card-title>
                      <v-card-text>
                        <v-flex text-xs-center>
                          <qrcode :value="payment.qrContent" tag="img" :options="{ color: { light: '#00000000' } }" />
                          <span v-if="$vuetify.breakpoint.xsOnly && !isDisabledMethod(payment.payMethod)">
                            <v-divider />
                            <v-btn outline class="my-4" @click="jumpAppPayment">跳转至 {{payment.payMethod.app}} App 继续支付</v-btn>
                          </span>
                        </v-flex>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-slide-x-reverse-transition>
                          <v-btn color="red darken-1" flat @click="$router.push({name: 'Dashboard'})"
                                 v-if="!payment.checking">
                            取消
                          </v-btn>
                        </v-slide-x-reverse-transition>
                        <v-btn color="green darken-2" class="white--text" @click="checkOrder"
                               :loading="payment.checking" :disabled="payment.checking">
                          我已支付 <v-icon right>done</v-icon>
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-flex>
              </v-layout>
            </v-stepper-content>

            <v-stepper-content step="5">
              <h1>充值成功</h1>
              <v-layout align-center justify-center row wrap class="my-4">
                <v-flex xs12 sm2 md2 lg2 xl2>
                  <svg id="successAnimation" class="animated" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 70 70" style="max-height: 10vh; text-align: center">
                    <path id="successAnimationResult" fill="#D8D8D8" d="M35,60 C21.1928813,60 10,48.8071187 10,35 C10,21.1928813 21.1928813,10 35,10 C48.8071187,10 60,21.1928813 60,35 C60,48.8071187 48.8071187,60 35,60 Z M23.6332378,33.2260427 L22.3667622,34.7739573 L34.1433655,44.40936 L47.776114,27.6305926 L46.223886,26.3694074 L33.8566345,41.59064 L23.6332378,33.2260427 Z"/>
                    <circle id="successAnimationCircle" cx="35" cy="35" r="24" stroke="#979797" stroke-width="2" stroke-linecap="round" fill="transparent"/>
                    <polyline id="successAnimationCheck" stroke="#979797" stroke-width="2" points="23 34 34 43 47 27" fill="transparent"/>
                  </svg>
                </v-flex>
                <v-flex xs12 sm10 md10 lg10 xl10>
                  <p class="mt-2">款项已收妥，充值物品将很快被充值到对应游戏账户中。感谢你对 FloatDream 的大力支持！</p>
                </v-flex>
              </v-layout>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
  import {validationMixin} from 'vuelidate'
  import {required, integer} from 'vuelidate/lib/validators'
  import topup from '@/api/topup'

  const positive = (value) => value > 0;

  export default {
    name: "TopupHome",
    mixins: [validationMixin],

    validations: {
      price: {
        required,
        integer,
        positive
      }
    },

    data() {
      return {
        stepNow: 1,
        itemLoading: true,
        item: {
          name: null,
          ratio: null // 1 RMB = 1 Coin
        },
        paymentMethods: [
          {
            id: 'alipay',
            name: '支付宝',
            app: '支付宝',
            mobileDisabled: false,
            icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52.36 52.11" style="height:40px"><defs><clipPath id="a"><path fill="none" d="M4.82 4.77h43v43h-43z"/></clipPath><clipPath id="b"><path fill="none" d="M16.73 37.56c-6.2 0-7.17-3.9-6.84-5.51s2.12-3.73 5.56-3.73A25.92 25.92 0 0 1 27.2 31.4c-2.99 3.86-6.66 6.17-10.47 6.17m30.63-3.73V13.1A8.12 8.12 0 0 0 39.21 5H13.15A8.12 8.12 0 0 0 5 13.1V39a8.12 8.12 0 0 0 8.15 8.1H39.2a8.14 8.14 0 0 0 8.02-6.67 600.2 600.2 0 0 1-16.4-7.26c-3.7 4.47-7.6 7.15-13.45 7.15-5.86 0-9.77-3.58-9.3-7.98.3-2.88 2.3-7.59 10.93-6.78 4.55.43 6.64 1.27 10.35 2.49a29.05 29.05 0 0 0 2.36-5.73H15.26v-1.62h8.14V17.8h-9.93V16h9.93v-4.2a.8.8 0 0 1 .83-.66h4.07v4.86h10.59v1.79h-10.6v2.91h8.64a32.94 32.94 0 0 1-3.5 8.75c2.51.9 13.93 4.37 13.93 4.37" clip-rule="evenodd"/></clipPath></defs><g clip-path="url(#b)"><path fill="#00a0e8" d="M0 0h52.36v52.11H0z"/></g></svg>'
          },
          {
            id: 'native',
            name: '微信支付',
            app: '微信',
            mobileDisabled: true,
            icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 86.31 76.15" class="pa-1" style="height:40px"><path fill="#09bb07" d="M31.4 48.17a2.87 2.87 0 0 1-3.81-1.16l-.2-.41-7.85-17.24a1.5 1.5 0 0 1-.14-.61 1.44 1.44 0 0 1 2.3-1.15l9.27 6.6a4.28 4.28 0 0 0 3.84.44l43.6-19.41C70.59 6.02 57.72 0 43.16 0 19.32 0 0 16.1 0 35.96c0 10.84 5.81 20.6 14.91 27.19a2.87 2.87 0 0 1 1.21 2.34 3.42 3.42 0 0 1-.15.92l-1.95 7.25a4.23 4.23 0 0 0-.23 1.05 1.44 1.44 0 0 0 1.44 1.44 1.62 1.62 0 0 0 .83-.26l9.45-5.46a4.52 4.52 0 0 1 2.3-.66 4.33 4.33 0 0 1 1.26.19 51.05 51.05 0 0 0 14.09 1.97c23.83 0 43.15-16.1 43.15-35.97A31.13 31.13 0 0 0 81.4 19.3L31.7 47.99z"/></svg>'
          }
        ],
        price: null,
        payment: {
          payMethod: {app: ''},  // 支付方式，现有 ["alipay", "wechat_pay"]
          submitting: false,  // 选择支付方式后，提交订单的过程
          orderId: null,  // 订单号，在提交订单后得到
          qrContent: null,  // 二维码内容，在提交订单后得到
          checking: false,  // 点击“已支付”后，查询支付成功与否的过程
        },
        snackbar: {
          enabled: false,
          text: '',
          color: ''
        },
        dialog: false
      }
    },

    mounted () {
      this.fetchItem()
    },

    methods: {
      fetchItem() {
        topup.getItem()
          .then(({data}) => {
            this.item.ratio = data.ratio
          })
          .catch(err => {
            this.snackbar = {
              enabled: true,
              text: '拉取充值兑换比率失败：' + err.responseMessage,
              color: 'error'
            }
          })
          .finally(() => {
            this.itemLoading = false;
          })
      },
      submitOrder (method) {
        this.payment.payMethod = method;
        let order = {
          price: this.transaction.price.value,
          payment: this.payment.payMethod.id
        };
        console.log('placing order', order);
        this.payment.submitting = true;

        topup.placeOrder(order)
          .then(({data}) => {
            this.payment.orderId = data.orderId;
            this.payment.qrContent = data.qrContent;

            this.stepNow += 1;
            this.dialog = true;
          })
          .catch((err) => {
            this.snackbar = {
              enabled: true,
              text: "创建订单失败：" + err.responseMessage,
              color: 'error'
            }
          })
          .finally(() => {
            this.payment.submitting = false
          })
        console.log(this)
      },
      checkOrder () {
        this.payment.checking = true;
        topup.checkOrder(this.payment.orderId)
          .then(({data}) => {
            if (data.paid_time) {
              let paidAt = Date.parse(data.paid_time);
              if (paidAt) {
                this.snackbar = {
                  enabled: true,
                  text: `充值成功：已收款 ${data.paid_price} 元`,
                  color: 'success'
                }
              }

              this.dialog = false;
              this.stepNow += 1;
            } else {
              this.snackbar = {
                enabled: true,
                text: '暂未收到付款确认，请稍后重试',
                color: 'warning'
              }
            }
          })
          .catch (err => {
            this.snackbar = {
              enabled: true,
              text: '充值失败：' + err.responseMessage,
              color: 'error'
            }
          })
          .finally(() => {
            this.payment.checking = false;
          })
      },
      getPriceHint() {
        if (this.itemLoading) {
          return '正在获取兑换比率....'
        } else if (this.price) {
          return `RMB ${this.transaction.price.display} 将可兑换 ${this.transaction.estimatedAmount.display} 个 Life 币`
        } else {
          return null
        }
      },
      isFormValid() {
        return !this.$v.$invalid
      },
      addSeparator(n) {
        return parseInt(n).toLocaleString()
      },
      jumpAppPayment() {
        window.open(this.payment.qrContent);
      },
      isSelectedPaymentMethod (methodId) {
        return this.payment.payMethod.id === methodId
      },
      isDisabledMethod(method) {
        return method.mobileDisabled && this.$vuetify.breakpoint.xsOnly
      }
    },
    computed: {
      priceErrors() {
        const errors = [];
        if (!this.$v.price.$dirty) return errors;
        !this.$v.price.required && errors.push('“金额” 为必填项');
        !this.$v.price.integer && errors.push('“金额” 必须为整数');
        !this.$v.price.positive && errors.push('“金额” 必须为非零正整数');
        return errors
      },
      transaction () {
        let estimatedAmount = this.item.ratio ? this.price * this.item.ratio : -1;
        return {
          price: {
            display: this.addSeparator(this.price),
            value: this.price
          },
          estimatedAmount: {
            display: estimatedAmount === -1 ? '加载中' : this.addSeparator(estimatedAmount),
            value: estimatedAmount
          }
        }
      }
    }
  }
</script>

<style scoped>
  .v-stepper {
    background: transparent;
  }

  .v-stepper .v-stepper__header {
    background: rgba(255, 255, 255, .96);
  }

  .v-stepper .v-stepper__items {
    background: rgba(255, 255, 255, .9);
  }

  @-webkit-keyframes scaleAnimation {
    0% {
      opacity: 0;
      -webkit-transform: scale(1.5);
      transform: scale(1.5);
    }
    100% {
      opacity: 1;
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }
  @keyframes scaleAnimation {
    0% {
      opacity: 0;
      -webkit-transform: scale(1.5);
      transform: scale(1.5);
    }
    100% {
      opacity: 1;
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }
  @-webkit-keyframes drawCircle {
    0% {
      stroke-dashoffset: 151px;
    }
    100% {
      stroke-dashoffset: 0;
    }
  }
  @keyframes drawCircle {
    0% {
      stroke-dashoffset: 151px;
    }
    100% {
      stroke-dashoffset: 0;
    }
  }
  @-webkit-keyframes drawCheck {
    0% {
      stroke-dashoffset: 36px;
    }
    100% {
      stroke-dashoffset: 0;
    }
  }
  @keyframes drawCheck {
    0% {
      stroke-dashoffset: 36px;
    }
    100% {
      stroke-dashoffset: 0;
    }
  }
  @-webkit-keyframes fadeOut {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  @keyframes fadeOut {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  @-webkit-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  #successAnimationCircle {
    stroke-dasharray: 151px 151px;
    stroke: #25AE88;
  }
  #successAnimationCheck {
    stroke-dasharray: 36px 36px;
    stroke: #25AE88;
  }
  #successAnimationResult {
    fill: #25AE88;
    opacity: 0;
  }
  #successAnimation.animated {
    -webkit-animation: 1s cubic-bezier(0.77, 0, 0.175, 1) 0s 1 both scaleAnimation;
    animation: 1s cubic-bezier(0.77, 0, 0.175, 1) 0s 1 both scaleAnimation;
  }
  #successAnimation.animated #successAnimationCircle {
    -webkit-animation: 1s cubic-bezier(0.77, 0, 0.175, 1) 0s 1 both drawCircle, 0.3s linear 0.9s 1 both fadeOut;
    animation: 1s cubic-bezier(0.77, 0, 0.175, 1) 0s 1 both drawCircle, 0.3s linear 0.9s 1 both fadeOut;
  }
  #successAnimation.animated #successAnimationCheck {
    -webkit-animation: 1s cubic-bezier(0.77, 0, 0.175, 1) 0s 1 both drawCheck, 0.3s linear 0.9s 1 both fadeOut;
    animation: 1s cubic-bezier(0.77, 0, 0.175, 1) 0s 1 both drawCheck, 0.3s linear 0.9s 1 both fadeOut;
  }
  #successAnimation.animated #successAnimationResult {
    -webkit-animation: 0.3s ease-out 0.7s both fadeIn;
    animation: 0.3s ease-out 0.7s both fadeIn;
  }
</style>
