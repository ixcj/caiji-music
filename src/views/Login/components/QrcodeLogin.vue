<template>
  <form lazy-validation class="qrcode">
    <div class="qrimg-box">
      <v-img
        :src="qrImg"
        aspect-ratio="1"
        class="grey lighten-2"
        width="100%"
        height="100%"
      >
        <template v-if="!qrImg">
          <v-row
            class="fill-height ma-0"
            align="center"
            justify="center"
          >
            <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
          </v-row>
        </template>
      </v-img>
      <transition name="fade-transition">
        <div
          class="qrimg-hint"
          v-if="[800, 802, 803].includes(qrCode)"
        >
          <div class="hint-content">
            <template v-if="qrCode == 800">
              <v-icon
                class="img"
                x-large
                color="#fff"
                @click="refreshQr"
              >mdi-refresh</v-icon>
              <span>二维码已过期，请重新获取</span>
            </template>
            <template v-if="qrCode == 802">
              <v-img
                :src="avatarUrl"
                aspect-ratio="1"
                class="grey lighten-4 rounded-circle img"
                width="100px"
                height="100px"
              >
                <template v-slot:placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
              <span class="nickname">{{ nickname }}</span>
              <span>请在手机上确认</span>
            </template>
            <template v-if="qrCode == 803">
              <v-icon x-large color="#fff">mdi-check</v-icon>
              <span>已确认，正在登录中~</span>
            </template>
          </div>
        </div>
      </transition>
    </div>
  </form>
</template>

<script>
export default {
  name: 'qrcode',
  data() {
    return {
      qrKey: '',
      qrImg: '',
      qrCode: 0,
      getKeyLoading: false,
      getQrStatusLoading: false,
      getImgLoading: false,
      avatarUrl: '',
      nickname: '',
      isShow: false
    }
  },
  methods: {
    initQrImg() {
      if (this.qrKey || this.getKeyLoading) return

      this.getKeyLoading = true
      this.$api.login.qrKey().then(res => {
        this.qrKey = res.data.unikey
        this.getQrImg()
      }).finally(() => { this.getKeyLoading = false })
    },
    getQrImg() {
      if (this.getImgLoading) return

      this.getImgLoading = true
      this.$api.login.qrCreate({
        key: this.qrKey,
        qrimg: true
      }).then(res => {
        this.qrImg = res.data.qrimg
        this.getQrStatus()
      }).finally(() => { this.getImgLoading = false })
    },
    getQrStatus() {
      if (this.getQrStatusLoading) return

      this.getQrStatusLoading = true
      this.$api.login.qrCheck({
        key: this.qrKey
      }).then(res => {
        this.qrCode = res.code
        if(res.code == 802) {
          if(res.avatarUrl.split('music.126.net')[1] != this.avatarUrl.split('music.126.net')[1]) {
            this.avatarUrl = res.avatarUrl
          }
          this.nickname = res.nickname
        }
        switch (this.qrCode) {
          case 801:
          case 802:
            this.isShow && setTimeout(() => {
              this.getQrStatus()
            }, 1000)
            break;            
          case 803:
            const cookie = res.cookie
            this.$api.user.userAccount({ cookie }).then(res => {
              setTimeout(() => {
                this.$emit('login', { ...res, cookie })
              }, 1000)
            })
            break;
        }
      }).finally(() => { this.getQrStatusLoading = false })
    },
    refreshQr() {
      this.qrImg = ''
      this.qrCode = 0
      this.initQrImg()
    }
  },
  activated() {
    this.isShow = true
    if(!this.qrKey) {
      this.initQrImg()
    } else {
      this.getQrStatus()
    }
  },
  deactivated() {
    this.isShow = false
  }
};
</script>

<style scoped lang="scss">
.qrcode {
  .qrimg-box {
    margin: 0 auto;
    width: 300px;
    height: 300px;
    position: relative;
    .qrimg-hint {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba($color: #000000, $alpha: 0.75);
      .hint-content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;
        .img {
          margin: 0 auto;
        }
        .nickname {
          font-size: 24px;
          text-align: center;
          margin-bottom: 10px;
        }
        span {
          font-size: 16px;
        }
      }
    }
  }
}
</style>
