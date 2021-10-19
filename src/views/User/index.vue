<template>
  <div class="personal-center">
    <v-dialog
      v-model="dialog"
      persistent
      width="300"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="red lighten-2"
          dark
          v-bind="attrs"
          v-on="on"
        >
          退出登录
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="headline">提示</v-card-title>

        <v-card-text style="font-size: 1rem;">
          确定要退出登录吗？
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :color="'#333'"
            text
            @click="!loading && (dialog = false)"
          >
            取消
          </v-btn>
          <v-btn
            :color="$store.getters.mainColor"
            :loading="loading"
            text
            @click="logout"
          >
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'My',
  data() {
    return {
      dialog: false,
      loading: false
    };
  },
  methods: {
    logout() {
      this.loading = true
      this.$api.login.logout().then(res => {
        if(res.code == 200) {
          this.dialog = false
          this.$store.commit('user/setUserInfo', {})
          this.$router.replace({
            name: 'Home'
          })
          location.reload()
        }
      }).finally(() => {
        this.loading = false
      })
    }
  }
};
</script>

<style scoped lang="scss">
.personal-center {
  
}
</style>