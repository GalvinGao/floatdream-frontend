<template>
  <v-container
    fluid
    fill-height
    grid-list-xl
    id="background"
  >
    <v-layout wrap>
      <v-flex
        sm6
        xs12
        md6
        lg3
      >
        <stats-card
          color="green"
          icon="mdi-calendar-clock"
          title="登录状态"
          value="在线"

          sub-icon="mdi-calendar"
          sub-text="最后登录：3 小时前"

          action-text="修改密码"
          :action-to="{name: 'DashboardSponsor'}"
          action-icon="mdi-lock-reset"
        />
      </v-flex>
      <v-flex
        sm6
        xs12
        md6
        lg3
      >
        <stats-card
          color="orange"
          icon="account_balance"
          title="Life 币"
          value="300"
          small-value="LB"

          sub-icon="mdi-calendar"
          sub-text="最后赞助：2019/6/26"

          action-text="赞助"
          :action-to="{name: 'DashboardSponsor'}"
          action-icon="favorite_border"
        >
        </stats-card>
      </v-flex>
      <v-flex
        sm6
        xs12
        md6
        lg3
      >
        <stats-card
          color="red"
          icon="mdi-tag"
          title="玩家等级"
          value="75"

          sub-icon="mdi-calendar"
          sub-text="最后更新：刚刚">
        </stats-card>
      </v-flex>
      <v-flex
        sm6
        xs12
        md6
        lg3
      >
        <stats-card
          color="blue"
          icon="mdi-shape"
          title="玩家类型"
          value="SVIP+"

          sub-icon="mdi-clock-outline"
          sub-text="截止日期：25 天后"
        />
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
  export default {
    name: "DashboardHome",
    props: {
      refreshProfile: Boolean
    }
  }
</script>

<style scoped>
#background {
  background: radial-gradient(ellipse at center, #5989df 0%, #1c1c36 100%);
  background: url('../../assets/background/3.png') 0 0 / cover fixed;
  -webkit-background-size: auto 100%;
  background-size: auto 100%;
}
</style>
