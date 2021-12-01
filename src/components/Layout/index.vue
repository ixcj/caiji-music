<template>
  <v-app
    id="inspire"
    :class="{ mobile: $vuetify.breakpoint.mobile }"
  >
    <!-- 菜单 -->
    <v-navigation-drawer
      class="drawer"
      :value="drawer || isBigScreen"
      @input="setDrawer"
      app
      clipped
      floating
      touchless
      :temporary="!isBigScreen"
      :mobile-breakpoint="$vuetify.breakpoint.mobileBreakpoint"
      :mini-variant="!drawer && isBigScreen"
    >
      <Avatar :drawer="drawer" :userInfo="userInfo" />
      <v-divider></v-divider>
      <NavigationDrawerList :drawer="drawer" />
      <template v-slot:img>
        <v-img class="bg-img" v-if="userBg" :src="userBg"></v-img>
      </template>
    </v-navigation-drawer>

    <!-- 头部 -->
    <v-app-bar
      class="header-box"
      app
      clipped-left
      elevation="0"
      :color="$store.getters.mainColor"
    >
      <v-app-bar-nav-icon :color="$store.getters.textColor" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <div class="logo-box" @click.stop="logoClick">
        <LogoBox auto-border />
        <span class="logo-title text-animation-time">{{ title }}</span>
      </div>
      <LayoutSearch />
    </v-app-bar>

    <!-- 内容区域 -->
    <v-main :style="{backgroundColor: $store.getters.bgColor}">
      <transition :name="$store.getters.pageAnimation" mode="out-in">
        <keep-alive :exclude="exclude">
          <router-view id="main-view" />
        </keep-alive>
      </transition>
    </v-main>

    <!-- 底部 -->
    <v-footer
      app
      height="70"
      color="#fff"
      class="footer-box"
      @touchmove.prevent
    >
      <BottomPlayer ref="bottomPlayer" />
    </v-footer>

    <!-- 登录失效对话框 -->
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">提示</v-card-title>
        <v-card-text>登录已失效，请重新登录！</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="handleDialog(false)">关闭</v-btn>
          <v-btn color="green darken-1" text @click="handleDialog(true)">去登录</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 全局message组件 -->
    <Message />
    <!-- 新版本提示盒子 -->
    <NewVersionBox />
  </v-app>
</template>

<script>
import Vue from 'vue'
import { mapState, mapActions } from 'vuex'
import { isTouchDevice } from '@/utils'
import NavigationDrawerList from './NavigationDrawerList'
import LogoBox from './LogoBox'
import LayoutSearch from './Search'
import Avatar from './Avatar'
import BottomPlayer from './BottomPlayer'
import Message from './Message'
import NewVersionBox from './NewVersionBox'
import { title } from '@/config'

export default {
  name: 'Layout',
  components: {
    NavigationDrawerList,
    LogoBox,
    LayoutSearch,
    Avatar,
    BottomPlayer,
    Message,
    NewVersionBox
  },
  data() {
    return {
      isTouchDevice,
      drawer: false,
      title,
      dialog: false,
      scrollBarWidth: window.innerWidth - document.body.clientWidth
    };
  },
  computed: {
    ...mapState('user', ['userInfo']),
    ...mapState('setting', ['theme']),
    ...mapState('layout', ['exclude']),
    userBg() {
      return this.userInfo?.backgroundUrl ? this.userInfo.backgroundUrl.replace('http://', '//') : ''
    },
    themeVariables() {
      const theme = {
        '--mainColor': this.theme.mainColor,
        '--textColor': this.theme.textColor,
        '--bgColor': this.theme.bgColor,
        '--animationTime': (this.theme.animationTime / 1000) + 's',
        '--scrollBarWidth': this.scrollBarWidth + 'px'
      }
      return theme
    },
    isBigScreen() {
      return this.$vuetify.breakpoint.xl
    }
  },
  methods: {
    ...mapActions('song', [
      'getSongInfoAndUrl'
    ]),
    setDrawer(val) {
      this.drawer = val

      if((this.drawer || this.isBigScreen) && !this.isBigScreen) {
        this.lock(true)
      }
    },
    logoClick() {
      this.$router.push({
        name: 'Home'
      })
    },
    handleDialog(isGoLogin) {
      this.$store.commit('user/setUserInfo', {})
      this.dialog = false
      if(isGoLogin) {
        this.$router.push({ name: 'Login' })
      }
    },

    lock(isLock = true, mobileHiddenFooter = false) {
      const $html = document.documentElement
      const isMobile = this.$vuetify.breakpoint.mobile
      const footer = document.querySelector('footer')

      if (isLock) {
        this.scrollBarWidth = window.innerWidth - document.body.clientWidth
        
        $html.classList.add('overflow-y-hidden')
        if(isMobile && mobileHiddenFooter) {
          footer.style.bottom = '-76px'
        }
      } else {
        $html.classList.remove('overflow-y-hidden')
        if(mobileHiddenFooter) {
          footer.style.bottom = '0'
        }
      }
    }
  },
  watch: {
    isBigScreen(val) {
      this.drawer = val
    },
    '$vuetify.breakpoint.mobile'(val) {
      this.$nextTick(() => {
        this.scrollBarWidth = window.innerWidth - document.body.clientWidth
      })
    },
    themeVariables(val) {
      const $html = document.documentElement
      Object.keys(val).map(key => {
        $html.style.setProperty(key, this.themeVariables[key])
      })
    }
  },
  created() {
    // 锁定浏览器滚动条，防止滚动穿透
    Vue.prototype.$lock = this.lock

    // 设置主题
    const $html = document.documentElement
    Object.keys(this.themeVariables).map(key => {
      $html.style.setProperty(key, this.themeVariables[key])
    })

    // 设置左侧抽屉菜单
    if(this.$vuetify.breakpoint.xl) {
      this.drawer = true
    } else if (this.$vuetify.breakpoint.mobile) {
      this.drawer = false
    }

    // 如果cookie存在，则刷新登录状态
    if(this.$store.getters.cookie) {
      this.$api.login.refreshLogin().then(res => {
        if(res.code != 200) {
          this.dialog = true
        }
      })
    }
  },
  mounted() {
    // 全局播放音乐方法
    Vue.prototype.$playMusic = songInfo => {
      if(this.$refs.bottomPlayer.loading) {
        this.$message({
          content: '歌曲信息加载中，请等待加载完成',
          color: 'warning'
        })
        return
      }

      this.getSongInfoAndUrl({
        songInfo,
        bottomPlayer: this.$refs.bottomPlayer
      })
    }

    // 暂停播放
    Vue.prototype.$PauseMusic = this.$refs.bottomPlayer.musicPause

    // 播放器
    Vue.prototype.$bottomPlayer = this.$refs.bottomPlayer
  }
};
</script>

<style scoped lang="scss">
#inspire {
  ::selection {
    color: var(--textColor);
    background-color: var(--mainColor);
  }
}
#main-view {
  max-width: 1280px;
  margin: 0 auto;
  padding: 12px;
  box-sizing: border-box;
}
.drawer {
  ::v-deep .v-navigation-drawer__content {
    background-color: rgba($color: #fff, $alpha: .5);
  }
  ::v-deep &.v-navigation-drawer--clipped:not(.v-navigation-drawer--temporary):not(.v-navigation-drawer--is-mobile) {
    z-index: 3;
  }
}
.bg-img {
  height: 50%;
  position: absolute;
  bottom: 0;
  mask-image: linear-gradient(0deg, #000 0%,  #000 30%, transparent 100%);
}
.header-box {
  :root.overflow-y-hidden &{
    margin-right: var(--scrollBarWidth);
  }
  .logo-box {
    display: flex;
    align-items: center;
    margin-left: 3px;
    cursor: pointer;
    .logo-title {
      color: var(--textColor);
      margin-left: 5px;
      font-size: 24px;
    }
  }
}
.footer-box {
  padding: 0;
  z-index: 5;
  :root.overflow-y-hidden &{
    margin-right: var(--scrollBarWidth);
  }
  .mobile & {
    transition: bottom var(--animationTime);
  }
}
</style>