<template>
  <v-form
    v-model="value"
    class="account"
    ref="form"
  >
    <v-text-field
      v-model="account"
      :rules="rules.account"
      label="输入手机号/邮箱"
      outlined
      required
      @keyup.enter="handleLogin"
    ></v-text-field>
    <v-text-field
      name="password"
      v-model="password"
      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
      :rules="rules.password"
      :type="showPassword ? 'text' : 'password'"
      label="输入密码"
      outlined
      @click:append="showPassword = !showPassword"
      @keyup.enter="handleLogin"
    ></v-text-field>
    <v-btn
      style="width: 100%;"
      x-large
      color="primary"
      :loading="loading"
      @click="handleLogin"
    >登录</v-btn>
  </v-form>
</template>

<script>
import md5 from '@/utils/md5'
import { validateTel, validateEmail } from '@/utils/validate'

export default {
  name: 'Account',
  data() {
    return {
      value: false,
      showPassword: false,
      loading: false,
      account: '',
      password: '',
      rules: {
        account: [
          v => !!v || '手机号/邮箱不能为空',
          v => validateTel(v) || validateEmail(v) || '手机号/邮箱格式错误'
        ],
        password: [
          v => !!v || '密码不能为空'
        ]
      }
    };
  },
  methods: {
    handleLogin() {
      if(this.$refs.form.validate()) {
        this.login()
      }
    },
    login() {
      const md5_password = md5(this.password)
      this.loading = true
      if(validateTel(this.account)) {
        this.$api.login.phoneLogin({
          phone: this.account,
          md5_password
        }).then(res => loginThen(res)).finally(() => { this.loading = false })
      } else if(validateEmail(this.account)) {
        this.$api.login.emailLogin({
          email: this.account,
          md5_password
        }).then(res => loginThen(res)).finally(() => { this.loading = false })
      }

      const that = this
      function loginThen(res) {
        if(res.code == 200) {
          that.$emit('login', res)
        }
      }
    }
  },
};
</script>

<style scoped lang="scss">
.account {
}
</style>