<template>
  <div class="account">
    <div class="main">
      <div class="form-container" :class="loginMode">
        <div class="form-item-box">
          <v-form
            v-model="value"
            ref="accountForm"
            @keyup.enter.native="handleAccountLogin"
          >
            <v-text-field
              v-model="account"
              :rules="rules.account"
              label="输入手机号/邮箱"
              outlined
              required
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
            ></v-text-field>
            <v-btn
              style="width: 100%;"
              x-large
              color="primary"
              :loading="loading"
              @click="handleAccountLogin"
            >密码登录</v-btn>
          </v-form>
        </div>
        <div class="form-item-box">
          <v-form
            v-model="value"
            ref="codeForm"
            @keyup.enter.native="handleCodeLogin"
          >
            <v-text-field
              v-model="account"
              :rules="rules.account"
              label="输入手机号/邮箱"
              outlined
              required
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
            ></v-text-field>
            <v-btn
              style="width: 100%;"
              x-large
              color="primary"
              :loading="loading"
              @click="handleCodeLogin"
            >验证码登录</v-btn>
          </v-form>
        </div>
      </div>
      <v-btn
        class="switch"
        :class="loginMode"
        @click="switchLoginMode"
      >{{ loginModeEnum[loginMode] }}</v-btn>
    </div>
  </div>
</template>

<script>
import md5 from '@/utils/md5'
import { validateTel, validateEmail } from '@/utils/validate'

export default {
  name: 'Account',
  data() {
    return {
      loginMode: 'password', // password(密码登录) 或 code(验证码登录)
      loginModeEnum: {
        password: '切换验证码登录',
        code: '切换密码登录'
      },
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
    handleAccountLogin() {
      if (this.loading) return

      if(this.$refs.accountForm.validate()) {
        const md5_password = md5(this.password)
        const that = this
        
        this.loading = true

        if(validateTel(this.account)) {
          this.$api.login.phoneLogin({
            phone: this.account,
            md5_password
          }).then(res => {
            if(res.code == 200) {
              that.$emit('login', res)
            }
          }).finally(() => { this.loading = false })
        } else if(validateEmail(this.account)) {
          this.$api.login.emailLogin({
            email: this.account,
            md5_password
          }).then(res => {
            if(res.code == 200) {
              that.$emit('login', res)
            }
          }).finally(() => { this.loading = false })
        }
      }
    },
    handleCodeLogin() {
      console.log('验证码登录')
    },
    switchLoginMode() {
      this.loginMode === 'password'
        ? this.loginMode = 'code'
        : this.loginMode = 'password'
    }
  },
};
</script>

<style scoped lang="scss">
.account {
  position: relative;
  .main {
    width: 100%;
    padding: 10px;
    overflow: hidden;
    .form-container {
      display: flex;
      width: calc(200% + 30px);
      left: 0;
      transition: 0.35s;
      &.code {
        transform: translateX(calc(-50% - 15px));
      }
      .form-item-box {
        width: calc(50% - 15px);
        &:first-child {
          margin-right: 30px;
        }
      }
    }
    .switch {
      width: 150px;
      margin-top: 30px;
      transition: 0.3s;
      position: absolute;
      left: 10px;
      &.password {
        left: calc(100% - 160px);
      }
    }
  }
}
</style>