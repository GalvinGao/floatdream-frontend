<template>
  <v-layout justify-center align-center fill-height>
    <v-flex xs12 sm10 md10 lg8 class="elevation-1 my-md-5 my-lg-5 my-xl-5">
      <v-toolbar color="white">
        <v-toolbar-title>订单列表</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn @click="update" flat><v-icon left>mdi-refresh</v-icon> 刷新</v-btn>
        <v-btn :to="{'name': 'DashboardTopup'}" color="primary"><v-icon left>mdi-plus</v-icon> 新建订单</v-btn>
      </v-toolbar>
      <v-data-table
          :headers="headers"
          :items="order.orders"
          :pagination.sync="pagination"
          :total-items="order.total"
          :loading="loading"

          item-key="order_id"
          must-sort
          :rows-per-page-items="[5, 10, 25]"
      >
        <template slot="headerCell" slot-scope="props">
          <v-tooltip bottom v-if="props.header.details">
            <template v-slot:activator="{ on }">
              <span v-on="on">
                {{ props.header.text }}
              </span>
            </template>
            <span>
              {{ props.header.details }}
            </span>
          </v-tooltip>
          <span v-else>
            {{ props.header.text }}
          </span>
        </template>

        <template v-slot:items="props">
          <tr @click="props.expanded = !props.expanded">
            <td>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <span v-on="on">{{ $moment(props.item.created_at).fromNow() }}</span>
                </template>
                <span>{{ timeDateFormat(props.item.created_at) }}</span>
              </v-tooltip>
            </td>
            <td>
              <v-chip>
                <v-avatar v-html="getPaymentInfo(props.item.pay_type).icon"></v-avatar>
                {{ getPaymentInfo(props.item.pay_type).name }}
              </v-chip>
              <v-chip v-if="props.item.pay.name">
                <v-avatar>
                  <v-img style="transform: scale(.7)" v-if="props.item.pay.icon.image" :src="getBankIconUrl(props.item.pay.icon.value)"></v-img>
                  <v-icon small v-else :color="props.item.pay.icon.color">{{ props.item.pay.icon.value }}</v-icon>
                </v-avatar>
                {{ props.item.pay.name }}
              </v-chip>
            </td>
            <td>¥ {{ parseInt(props.item.paid_price).toFixed(2) }}</td>
            <td>
              <v-tooltip top v-if="props.item.status.details">
                <template v-slot:activator="{ on }">
                  <span v-on="on">
                    <v-chip :color="props.item.status.color" text-color="white">
                      <v-avatar>
                        <v-icon>{{ props.item.status.icon }}</v-icon>
                      </v-avatar>
                      {{ props.item.status.text }}
                    </v-chip>
                  </span>
                </template>
                <span>{{ props.item.status.details }}</span>
              </v-tooltip>

              <v-chip :color="props.item.status.color" text-color="white" v-else>
                <v-avatar>
                  <v-icon>{{ props.item.status.icon }}</v-icon>
                </v-avatar>
                {{ props.item.status.text }}
              </v-chip>

            </td>
            <td>actions</td>
          </tr>
        </template>

        <template v-slot:no-data>
          <v-alert :value="true" color="info" icon="warning">
            暂无订单 <v-btn :to="{'name': 'DashboardTopup'}"><v-icon left>mdi-add</v-icon> 去充值</v-btn>
          </v-alert>
        </template>

        <template v-slot:expand="props">
          <v-card flat class="px-4 py-2">
            <v-card-title class="display-1">{{ $moment(props.item.created_at).fromNow() }}的订单</v-card-title>
            <v-card-text>
              <v-layout justify-space-between v-bind="expandRowBreakpoint">
                <v-flex xs12 sm12 md6 lg6>
                  <v-list two-line>
                    <v-list-tile>
                      <v-list-tile-action>
                        <v-icon color="indigo">mdi-numeric</v-icon>
                      </v-list-tile-action>

                      <v-list-tile-content>
                        <v-list-tile-title><code>{{ props.item.order_id }}</code></v-list-tile-title>
                        <v-list-tile-sub-title>订单号</v-list-tile-sub-title>
                      </v-list-tile-content>
                    </v-list-tile>

                    <v-list-tile>
                      <v-list-tile-action>
                        <v-icon color="indigo">mdi-calendar-clock</v-icon>
                      </v-list-tile-action>

                      <v-list-tile-content>
                        <v-list-tile-title>{{ $moment(props.item.created_at).fromNow() }} ({{ timeDateFormat(props.item.created_at) }})</v-list-tile-title>
                        <v-list-tile-sub-title>创建时间</v-list-tile-sub-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </v-list>
                </v-flex>
                <v-flex xs12 sm12 md6 lg6>
                  <v-timeline dense>
                    <v-timeline-item
                        v-for="(item, i) in props.item.timeline"
                        :key="i"
                        :color="item.color"
                        :icon="item.icon"
                        fill-dot
                        small
                    >
                      <v-layout justify-space-between>
                        <v-flex xs7>
                          <v-chip
                              class="white--text ml-0"
                              :color="item.tag.color"
                              label
                              small
                              v-if="item.tag"
                          >
                            {{ item.tag.name }}
                          </v-chip>
                          {{ item.text }}
                        </v-flex>
                        <v-flex xs5 text-xs-right>{{ item.time }}</v-flex>
                      </v-layout>
                    </v-timeline-item>
                  </v-timeline>
                </v-flex>
              </v-layout>

            </v-card-text>
          </v-card>
        </template>

      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<script>
  import topup from '@/api/topup'
  import banks from '@/utils/banks'

  export default {
    name: "TopupOrderList",
    data () {
      return {
        loading: false,
        order: {
          total: 0,
          orders: []
        },
        pagination: {
          sortBy: "created_at",
          descending: true
        },
        headers: [
          { text: '创建时间', value: 'created_at' },
          { text: '支付方式', value: 'pay_type', sortable: false },
          { text: '订单金额', value: 'paid_price'},
          { text: '状态', value: 'status', sortable: false },
          { text: '操作', details: '对订单信息做修改、删除等操作', value: 'actions', sortable: false },
        ],
        paymentMethods: [
          {
            id: 'alipay',
            name: '支付宝',
            app: '支付宝',
            color: '#449fe2',
            mobileDisabled: false,
            icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52.36 52.11" class="pa-2" style="height:40px"><defs><clipPath id="a"><path fill="none" d="M4.82 4.77h43v43h-43z"/></clipPath><clipPath id="b"><path fill="none" d="M16.73 37.56c-6.2 0-7.17-3.9-6.84-5.51s2.12-3.73 5.56-3.73A25.92 25.92 0 0 1 27.2 31.4c-2.99 3.86-6.66 6.17-10.47 6.17m30.63-3.73V13.1A8.12 8.12 0 0 0 39.21 5H13.15A8.12 8.12 0 0 0 5 13.1V39a8.12 8.12 0 0 0 8.15 8.1H39.2a8.14 8.14 0 0 0 8.02-6.67 600.2 600.2 0 0 1-16.4-7.26c-3.7 4.47-7.6 7.15-13.45 7.15-5.86 0-9.77-3.58-9.3-7.98.3-2.88 2.3-7.59 10.93-6.78 4.55.43 6.64 1.27 10.35 2.49a29.05 29.05 0 0 0 2.36-5.73H15.26v-1.62h8.14V17.8h-9.93V16h9.93v-4.2a.8.8 0 0 1 .83-.66h4.07v4.86h10.59v1.79h-10.6v2.91h8.64a32.94 32.94 0 0 1-3.5 8.75c2.51.9 13.93 4.37 13.93 4.37" clip-rule="evenodd"/></clipPath></defs><g clip-path="url(#b)"><path fill="#00a0e8" d="M0 0h52.36v52.11H0z"/></g></svg>'
          },
          {
            id: 'native',
            name: '微信支付',
            app: '微信',
            color: '#55b737',
            mobileDisabled: true,
            icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 86.31 76.15" class="pa-2" style="height:40px"><path fill="#09bb07" d="M31.4 48.17a2.87 2.87 0 0 1-3.81-1.16l-.2-.41-7.85-17.24a1.5 1.5 0 0 1-.14-.61 1.44 1.44 0 0 1 2.3-1.15l9.27 6.6a4.28 4.28 0 0 0 3.84.44l43.6-19.41C70.59 6.02 57.72 0 43.16 0 19.32 0 0 16.1 0 35.96c0 10.84 5.81 20.6 14.91 27.19a2.87 2.87 0 0 1 1.21 2.34 3.42 3.42 0 0 1-.15.92l-1.95 7.25a4.23 4.23 0 0 0-.23 1.05 1.44 1.44 0 0 0 1.44 1.44 1.62 1.62 0 0 0 .83-.26l9.45-5.46a4.52 4.52 0 0 1 2.3-.66 4.33 4.33 0 0 1 1.26.19 51.05 51.05 0 0 0 14.09 1.97c23.83 0 43.15-16.1 43.15-35.97A31.13 31.13 0 0 0 81.4 19.3L31.7 47.99z"/></svg>'
          }
        ],
      }
    },
    watch: {
      pagination: {
        handler () {
          this.update()
        },
        deep: true,
      }
    },
    methods: {
      update() {
        let pagination = this.pagination;
        let sorting = {
          sort_key: pagination.sortBy,
          sort_order: pagination.descending ? "desc" : "asc"
        };
        let paginating = {
          page: pagination.page,
          limit: pagination.rowsPerPage
        };

        this.loading = true
        topup.listOrder({...sorting, ...paginating})
          .then(({data}) => {
            this.order.orders = this.processRecords(data.records);
            this.order.total = data.total_record;

            console.log(data)
          })
          .catch((err) => {
            console.error(err)
          })
          .finally(() => {
            this.loading = false
          })
      },
      getPaymentInfo(paymentId) {
        return this.paymentMethods.find(v => v.id === paymentId)
      },
      getBankIconUrl(bankId) {
        return require(`../../../assets/bankLogos/${bankId}.svg`)
      },
      timeDateFormat(time) {
        let t = this.$moment(time);
        if (t.isSame(new Date(), 'day')) {
          return t.format("今天 H:mm:ss")
        }
        return t.format("lll")
      },
      processRecords(records) {
        let newRecords = [];
        for (let obj of records) {
          // mark up outdated orders
          if (this.$moment(obj.created_at).add(2, 'hours').isBefore(new Date()) && obj.paid === false) {
            obj.status = {
              color: 'grey',
              icon: 'close',
              text: "交易已关闭",
              details: "由于长时间未支付，交易已被系统自动关闭。若需重新充值，请重新填写信息并尽快支付。"
            };
            obj.closed = true;
          } else {
            obj.status = {
              color: obj.paid ? obj.processed ? "success" : "warning" : "secondary",
              icon: obj.paid ? obj.processed ? "mdi-check" : "mdi-dots-horizontal" : "mdi-progress-clock",
              text: obj.paid ? obj.processed ? "已充值" : "正在充值" : "等待付款",
              details: obj.paid ? obj.processed ? "款项已成功充值到对应账户，请查收" : "已收到付款信息，系统正在处理" : `暂未付款；订单将于${this.$moment(obj.created_at).add(2, 'hours').fromNow()}关闭`,
            };
            obj.closed = false;
          }

          // parse bank info
          if (obj.pay_type === "native" && obj.transaction_type.indexOf("_") > -1) {
            let [card, type] = obj.transaction_type.split("_");
            console.log({card, type})
            let bank = banks.banks.find(v => v.id === card);
            let name = `${bank.name} (${banks.types[type]})`;

            obj.pay = {
              name,
              icon: {
                image: bank.icon,
                value: bank.icon ? bank.id : "mdi-cash"
              }
            }
          } else if (obj.pay_type === "native" && obj.paid) {
            let bank = banks.banks.find(v => v.id === obj.transaction_type);

            obj.pay = {
              name: bank.name,
              icon: {
                image: bank.icon,
                value: bank.icon ? bank.id : ((bank.id === "CFT") ? "mdi-coin" : "mdi-cash"),
                color: bank.icon ? bank.id : ((bank.id === "CFT") ? "yellow darken-3" : "indigo")
              }
            }
          } else {
            obj.pay = {
              name: "",
              icon: {
                image: false,
                value: "close"
              }
            }
          }

          // parse timeline
          obj.timeline = [{
            color: 'secondary',
            icon: "mdi-plus-circle",
            text: "订单已创建",
            time: this.timeDateFormat(obj.created_at)
          }];
          if (obj.paid) obj.timeline.push({color: 'success', icon: "mdi-cash", text: "付款成功", time: this.timeDateFormat(obj.paid_at), tag: this.getPaymentInfo(obj.pay_type)});
          if (obj.closed) obj.timeline.push({color: 'error', icon: "mdi-minus-circle", text: "交易关闭", time: this.timeDateFormat(this.$moment(obj.created_at).add(2, 'hours'))});
          if (!obj.paid && !obj.closed) obj.timeline.push({color: 'warning', icon: "mdi-progress-clock", text: "等待付款", time: "..."});
          if (obj.processed) obj.timeline.push({color: 'success', icon: "mdi-check-circle", text: "充值成功", time: this.timeDateFormat(obj.processed_at)});
          if (obj.paid && !obj.processed) obj.timeline.push({color: 'warning', icon: "mdi-dots-horizontal", text: "正在充值", time: "..."});
          obj.timeline.reverse();

          newRecords.push(obj)
        }
        console.log(newRecords);
        return newRecords
      }
    },
    computed: {
      expandRowBreakpoint () {
        const binding = {};

        if (this.$vuetify.breakpoint.smAndDown) binding.column = true

        return binding
      }
    }
  }
</script>

<style scoped>

</style>