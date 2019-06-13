<template>
  <v-layout justify-center align-center fill-height id="sponsor-page">
    <v-container>
      <v-stepper v-model="stepNow" class="mx-auto">
        <v-stepper-header>
          <v-stepper-step :editable="stepNow < 3" :complete="stepNow > 1" step="1">信息</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step :complete="stepNow > 2" step="2">确认</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step :complete="stepNow > 3" step="3">支付</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step :complete="stepNow === 4" step="4">完成</v-stepper-step>
        </v-stepper-header>


        <v-stepper-items>
          <v-stepper-content step="1">
            <h1>赞助</h1>
            <v-form ref="form" lazy-validation @keyup.native.enter="submit">
              <v-container>
                <v-layout column>
                  <v-select
                    v-model="category"
                    label="赞助项"
                    prepend-icon="list"
                    required
                    persistent-hint
                    :hint="getCategoryHint()"

                    :items="plainCategories"

                    :error-messages="categoryErrors"
                    @input="$v.category.$touch()"
                    @blur="$v.category.$touch()"
                  ></v-select>

                  <v-text-field
                    v-model="amount"
                    label="数量"
                    prepend-icon="add_box"
                    required
                    persistent-hint
                    :hint="getAmountHint()"

                    :error-messages="amountErrors"
                    @input="$v.amount.$touch()"
                    @blur="$v.amount.$touch()"
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
            <v-card class="ml-1 mt-4 right indigo font-weight-bold white--text" elevation="4" dense
                    v-if="isFormValid()">
              <v-card-title class="pt-2 pb-2 pl-3 pr-3">
                总计：RMB {{this.transaction.price.display}}
              </v-card-title>
            </v-card>
          </v-stepper-content>

          <v-stepper-content step="2">
            <h1>订单确认</h1>
            <v-alert
              :value="true"
              type="info"
              class="mt-3 mb-3"
            >
              请在赞助前再三确认所有信息。我们将不予受理除系统故障外的其他任何退款申请，敬请谅解
            </v-alert>

            <v-card class="ml-1 mr-1 mt-3" elevation="4">
              <v-card-title>
                <v-flex xs12 class="ma-2">
                  <h3>请确认您将为以下 FloatDream 账户进行赞助</h3>
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
                  <h3>请确认您将赞助以下项目</h3>
                </v-flex>
                <v-list>
                  <v-list-tile>
                    <v-list-tile-action>
                      <v-icon color="indigo">shopping_cart</v-icon>
                    </v-list-tile-action>

                    <v-list-tile-content>
                      <v-list-tile-title>{{ this.transaction.category.name }}</v-list-tile-title>
                      <v-list-tile-sub-title>赞助项</v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>

                  <v-list-tile>
                    <v-list-tile-action>
                    </v-list-tile-action>

                    <v-list-tile-content>
                      <v-list-tile-title>{{ this.transaction.amount.display }} 个</v-list-tile-title>
                      <v-list-tile-sub-title>数量</v-list-tile-sub-title>

                    </v-list-tile-content>
                  </v-list-tile>
                </v-list>
              </v-card-title>
            </v-card>

            <v-card class="ml-1 mr-1 mt-3" elevation="4">
              <v-card-title>
                <v-flex xs12 class="ma-2">
                  <h3>请确认支付金额</h3>
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
            <h1>支付</h1>

            <v-card
              class="mb-5"
              color="grey lighten-1"
              height="300px"
            ></v-card>

            <v-btn
              color="primary"
              class="right mr-1 mt-4"
              @click="stepNow = 4"
            >
              下一步
              <v-icon right>chevron_right</v-icon>
            </v-btn>
          </v-stepper-content>

          <v-stepper-content step="4">
            <h1>完成</h1>
            <p>感谢你对 FloatDream 的大力支持！</p>

            <v-btn
              color="primary"
              class="right mr-1 mt-4"
              @click="redirectDashboard"
            >
              完成
              <v-icon right>done</v-icon>
            </v-btn>
          </v-stepper-content>
        </v-stepper-items>

      </v-stepper>
    </v-container>
  </v-layout>
</template>

<script>
  import {validationMixin} from 'vuelidate'
  import {required} from 'vuelidate/lib/validators'

  function isInt(value) {
    return !isNaN(value) &&
      parseInt(Number(value)) == value &&
      !isNaN(parseInt(value, 10));
  }

  const isNaturalNumber = (value) => value > 0 && isInt(value);

  export default {
    name: "SponsorHome",
    mixins: [validationMixin],

    validations: {
      category: {
        required
      },
      amount: {
        required,
        isNaturalNumber
      }
    },

    data() {
      return {
        stepNow: 1,
        categories: [{
          id: 'coin_a',
          name: 'A 币',
          description: '仅能在服务器 A 中使用，无法跨服使用',
          ratio: 100 // 1 RMB = 100 Coins
        }, {
          id: 'coin_b',
          name: 'B 币',
          description: '仅能在服务器 B 中使用，无法跨服使用',
          ratio: 10 // 1 RMB = 10 Coins
        }, {
          id: 'coin_c',
          name: 'C 币',
          description: '仅能在服务器 C 中使用，无法跨服使用',
          ratio: 1 // 1 RMB = 1 Coins
        }, {
          id: 'coin_d',
          name: 'D 币',
          description: '仅能在服务器 D 中使用，无法跨服使用',
          ratio: 10000 // 1 RMB = 10000 Coins
        }],
        amount: null,
        category: null
      }
    },
    methods: {
      submit() {
        let amount = parseInt(amount);
        let category = this.getCurrentSelectedCategory().id;

      },
      getCurrentSelectedCategory() {
        return this.categories.filter(category => category.name === this.category)[0] || {}
      },
      getCategoryHint() {
        if (this.category) {
          // return `${category.description}；兑换比率 RMB 1 = ${category.ratio} ${category.name}`
          return this.transaction.category.description
        }
        return ''
      },
      getAmountHint() {
        if (this.amount && !this.category) {
          return '选择赞助项以查看兑换比率'
        }
        if (this.amount && this.category) {
          return `RMB ${this.transaction.price.display} 将可兑换 ${this.transaction.amount.display} 个 ${this.transaction.category.name}`
        }
      },
      isFormValid() {
        return !this.$v.$invalid
      },
      addSeparator(n) {
        return parseInt(n).toLocaleString()
      },
      redirectDashboard() {
        this.$router.push({name: 'Dashboard', props: {refreshProfile: true}})
      }
    },
    computed: {
      plainCategories() {
        let tempArray = [];
        for (let category of this.categories) {
          tempArray.push(category.name)
        }
        return tempArray
      },
      categoryErrors() {
        const errors = [];
        if (!this.$v.category.$dirty) return errors;
        !this.$v.category.required && errors.push('“赞助项” 为必填项');
        return errors
      },
      amountErrors() {
        const errors = [];
        if (!this.$v.amount.$dirty) return errors;
        !this.$v.amount.required && errors.push('“金额” 为必填项');
        !this.$v.amount.isNaturalNumber && errors.push('“金额” 必须为正整数');
        return errors
      },
      transaction () {
        let selectedCategory = this.getCurrentSelectedCategory();
        let price = parseInt(this.amount);
        let amount = price * selectedCategory.ratio;
        return {
          category: selectedCategory,
          amount: {
            display: this.addSeparator(amount),
            value: amount
          },
          price: {
            display: parseFloat(this.amount).toFixed(2),
            value: price
          }
        }
      }
    }
  }
</script>

<style scoped>
  #sponsor-page {
    background: radial-gradient(ellipse at center, #5989df 0%, #1c1c36 100%);
    background: url('../../../assets/background/1.png') 0 0 / cover fixed;
    -webkit-background-size: auto 100%;
    background-size: auto 100%;
  }
</style>
