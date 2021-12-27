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
              :rules="rules.accountAndEmail"
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
            ref="captchaForm"
            @keyup.enter.native="handleCodeLogin"
          >
            <v-text-field
              v-model="phone"
              :rules="rules.phone"
              ref="captchaFormPhone"
              label="输入手机号"
              outlined
              required
            ></v-text-field>
            <v-row>
              <v-col cols="7">
                <v-text-field
                  v-model="captcha"
                  :rules="rules.captcha"
                  label="输入验证码"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="5">
                <v-btn
                  x-large
                  class="get-captcha-btn"
                  :loading="getCaptchaLoading"
                  :disabled="Boolean(getCaptchaTimeout)"
                  @click="getCaptcha"
                >{{ getCaptchaTimeout > 0 ? `${getCaptchaTimeout}秒` : '获取验证码' }}</v-btn>
              </v-col>
            </v-row>
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
        rounded
        class="switch"
        :class="loginMode"
        @click="switchLoginMode"
      >
        {{ loginModeEnum[loginMode].left }}
        {{ loginModeEnum[loginMode].text }}
        {{ loginModeEnum[loginMode].right }}
      </v-btn>
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
        password: {
          text: '切换验证码登录',
          left: '',
          right: '→'
        },
        code: {
          text: '切换密码登录',
          left: '←',
          right: ''
        }
      },
      value: false,
      showPassword: false,
      loading: false,
      getCaptchaLoading: false,
      getCaptchaTimeout: 0,
      getCaptchaTimer: null,
      account: '',
      phone: '',
      password: '',
      captcha: '',
      isGetCaptcha: true,
      rules: {
        accountAndEmail: [
          v => !!v || '手机号/邮箱不能为空',
          v => validateTel(v) || validateEmail(v) || '手机号/邮箱格式错误'
        ],
        phone: [
          v => !!v || '手机号不能为空',
          v => validateTel(v) || '手机号格式错误'
        ],
        password: [
          v => !!v || '密码不能为空'
        ],
        captcha: [
          v => this.isGetCaptcha || !!v || '验证码不能为空'
        ]
      }
    };
  },
  methods: {
    handleAccountLogin() {
      if (this.loading) return

      if(this.$refs.accountForm.validate()) {
        const md5_password = md5(this.password)
        
        this.loading = true

        if(validateTel(this.account)) {
          this.$api.login.phoneLogin({
            phone: this.account,
            md5_password
          }).then(res => {
            if(res.code == 200) {
              this.$emit('login', res)
            }
          }).finally(() => { this.loading = false })
        } else if(validateEmail(this.account)) {
          this.$api.login.emailLogin({
            email: this.account,
            md5_password
          }).then(res => {
            if(res.code == 200) {
              this.$emit('login', res)
            }
          }).finally(() => { this.loading = false })
        }
      }
    },
    getCaptcha() {
      if (this.getCaptchaLoading || this.getCaptchaTimeout) return

      this.isGetCaptcha = true
      if (this.$refs.captchaForm.validate()) {
        this.getCaptchaLoading = true
        this.$api.login.captchaSent({
          phone: this.phone
        }).then(res => {
          if(res.code == 200) {
            this.getCaptchaTimeout = 120
            this.getCaptchaTimer = setInterval(() => {
              if (--this.getCaptchaTimeout <= 0) {
                clearInterval(this.getCaptchaTimer)
                this.getCaptchaTimeout = 0
              }
            }, 1000)
            this.$message({
              content: '验证码发送成功，请注意查收！',
            })
          }
        }).finally(() => { this.getCaptchaLoading = false })
      }
    },
    handleCodeLogin() {
      if (this.loading) return

      this.isGetCaptcha = false
      if(this.$refs.captchaForm.validate()) {
        this.loading = true
        const { phone, captcha } = this
        this.$api.login.phoneLogin({
          phone,
          captcha
        }).then(res => {
          if(res.code == 200) {
            this.$emit('login', res)
          }
        }).finally(() => { this.loading = false })
      }
    },
    switchLoginMode() {
      this.loginMode === 'password'
        ? this.loginMode = 'code'
        : this.loginMode = 'password'
      this.$refs.accountForm.resetValidation()
      this.$refs.captchaForm.resetValidation()
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
      transition: 0.3s;
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
  .get-captcha-btn {
    width: 100%;
    height: 56px;
  }
  ::v-deep {
    .col {
      padding-top: 0;
      padding-bottom: 0;
    }
  }
}
</style>