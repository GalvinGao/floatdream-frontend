<template>
  <v-container grid-list-xl>
    <v-dialog
        v-model="loading.show"
        :persistent="loading.progress"
        width="300"
    >
      <v-card
          :color="loading.error ? 'error' : 'primary'"
          dark
      >
        <v-card-text>
          {{ loading.error ? loading.error : '正在获取用户信息...' }}
          <v-progress-linear
              :indeterminate="!loading.error"
              v-if="!loading.error"
              color="white"
              class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-layout align-center justify-center wrap fill-height>
      <v-flex
          xs12
          sm6
          md6
          lg4
          xl3
      >
        <stats-card
            :color="status.online ? 'green' : 'grey darken-3'"
            icon="mdi-calendar-clock"
            title="登录状态"
            :value="status.online ? '在线' : '离线'"

            sub-icon="mdi-calendar"
            :sub-text="'最后登录：' + formatTime(status.lastLogin)"
        />
      </v-flex>
      <v-flex
          xs12
          sm6
          md6
          lg4
          xl3
      >
        <stats-card
            color="orange"
            icon="account_balance"
            title="Life 币"
            :value="balance.current ? balance.current.toString() : '加载中...'"
            small-value="LB"

            sub-icon="mdi-calendar"
            :sub-text="'最后充值：' + (balance.lastTopup ? formatTime(balance.lastTopup) : '从未')"

            action-text="充值"
            :action-to="{name: 'DashboardTopup'}"
            action-icon="favorite_border"
        >
        </stats-card>
      </v-flex>

      <!--      <v-flex-->
      <!--        md12-->
      <!--        lg6-->
      <!--      >-->
      <!--        <material-card-->
      <!--          color="orange"-->
      <!--          title="Employee Stats"-->
      <!--          text="New employees on 15th September, 2016"-->
      <!--        >-->
      <!--          <v-data-table-->
      <!--            :headers="headers"-->
      <!--            :items="items"-->
      <!--            hide-actions-->
      <!--          >-->
      <!--            <template-->
      <!--              slot="headerCell"-->
      <!--              slot-scope="{ header }"-->
      <!--            >-->
      <!--              <span-->
      <!--                class="font-weight-light text-warning text&#45;&#45;darken-3"-->
      <!--                v-text="header.text"-->
      <!--              />-->
      <!--            </template>-->
      <!--            <template-->
      <!--              slot="items"-->
      <!--              slot-scope="{ index, item }"-->
      <!--            >-->
      <!--              <td>{{ index + 1 }}</td>-->
      <!--              <td>{{ item.name }}</td>-->
      <!--              <td class="text-xs-right">{{ item.salary }}</td>-->
      <!--              <td class="text-xs-right">{{ item.country }}</td>-->
      <!--              <td class="text-xs-right">{{ item.city }}</td>-->
      <!--            </template>-->
      <!--          </v-data-table>-->
      <!--        </material-card>-->
      <!--      </v-flex>-->
    </v-layout>
  </v-container>
</template>

<script>
  import user from "@/api/user";

  export default {
    name: "DashboardHome",
    data() {
      return {
        loading: {
          show: false,
          progress: false,
          error: null
        },
        status: {
          online: false,
          lastLogin: null,
        },
        balance: {
          current: null,
          lastTopup: null
        }
      }
    },
    props: {
      refreshProfile: Boolean
    },
    mounted() {
      this.present()
    },
    methods: {
      present() {
        this.loading = {
          show: true,
          progress: true,
          error: null
        };
        user.inspect()
          .then(({data}) => {
            this.status.online = data.status_online;
            this.status.lastLogin = data.status_last_login;
            this.balance.current = data.balance_current;
            this.balance.lastTopup = data.balance_last_topup;

            this.loading = {
              show: false,
              progress: false,
              error: null
            }
          })
          .catch(err => {
            this.loading = {
              show: true,
              progress: false,
              error: `获取用户信息失败：${err.responseMessage}`
            }
          })
      },
      formatTime(time) {
        let t = this.$moment(time);
        let formatted;
        if (t.isSame(new Date(), "year") || t.isSame(new Date(), "month")) {
          formatted = t.format("M.D H:mm")
        } else if (t.isSame(new Date(), "day")) {
          formatted = t.format("今天 H:mm")
        } else {
          formatted = t.format("Y.M.D H:mm")
        }
        return `${t.fromNow()} (${formatted})`
      }
    }
  }
</script>

<style scoped>

</style>
