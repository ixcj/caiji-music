<template>
  <div
    style="position: relative"
    v-click-outside="onClickOutside"
    :style="{
      '--top': y + 'px',
      '--left': x + 'px',
      '--playHistoryItemHeight': playHistoryItemHeight + 'px',
    }"
  >
    <v-btn
      class="playlist-but"
      fab
      small
      :color="
        fullPlayer ? 'rgba(255, 255, 255, 0.1)' : $store.getters.mainColor
      "
      @click="showPlayHistory = !showPlayHistory"
    >
      <v-icon dark>mdi-playlist-music</v-icon>
    </v-btn>
    <v-scale-transition mode="out-in" origin="right bottom">
      <div class="play-history elevation-12 rounded" v-show="showPlayHistory">
        <div class="top">
          <h1 class="title">
            当前播放
            <v-icon
              right
              class="close-icon"
              @click.stop="showPlayHistory = false"
            >mdi-chevron-down</v-icon>
          </h1>
          <div class="info-box">
            <span>共{{ waitingPlayList.length }}首</span>
            <span
              class="but"
              @click="dialog = true"
              v-show="waitingPlayList.length"
              >清空全部</span
            >
          </div>
        </div>

        <v-virtual-scroll
          bench="15"
          class="play-history-box scrollbar-y"
          :items="waitingPlayList"
          :item-height="playHistoryItemHeight"
          height="420"
        >
          <template v-slot="{ item }">
            <li
              class="play-history-item"
              :key="item.id"
              :class="{
                active: item.id == currentSongInfo.id,
                'select-item': item.id == selectId,
              }"
              @click="clickPlayHistoryItem(item)"
              @dblclick="dblclickPlayHistoryItem(item)"
              @contextmenu="(e) => show(e, item.id)"
            >
              <transition name="scale-transition" mode="out-in">
                <v-icon
                  class="play-icon"
                  v-if="item.id == currentSongInfo.id"
                  :color="$store.getters.mainColor"
                  >mdi-play</v-icon
                >
              </transition>
              <div class="song-info text-overflow">
                <span class="name">{{ item.name }}</span>
                <span v-if="item.ar.length"> - </span>
                <div
                  class="artist-item"
                  v-for="artist in item.ar"
                  :key="artist.id"
                >
                  <span>{{ artist.name }}</span>
                </div>
              </div>
              <div class="time">{{ item.dt | timestampToMinute }}</div>
            </li>
          </template>
        </v-virtual-scroll>

        <transition name="fade-transition" mode="out-in">
          <div class="dialog-box" v-show="dialog">
            <div class="bg" @click.stop="closeDialog"></div>
            <transition name="scale-transition" mode="out-in">
              <v-card class="dialog" v-show="dialog">
                <v-card-title class="card-title"
                  >清空列表会影响单曲正在播放的歌曲，确定清空列表?</v-card-title
                >
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="green darken-1" text @click="closeDialog()">
                    取消
                  </v-btn>
                  <v-btn color="red darken-1" text @click="deleteAll()">
                    确定
                  </v-btn>
                </v-card-actions>
              </v-card>
            </transition>
          </div>
        </transition>
      </div>
    </v-scale-transition>
    <v-menu
      v-model="showMenu"
      :position-x="x"
      :position-y="y"
      absolute
      offset-y
      :style="{ top: x + 'px' }"
      attach=".play-history-box"
    >
      <v-list>
        <v-list-item @click="deleteItem">
          <v-list-item-title>删除</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import { isTouchDevice } from '@/utils'
import { mapState, mapMutations } from "vuex";

export default {
  name: "PlayHistory",
  props: {
    fullPlayer: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectId: 0,
      dialog: false,
      showPlayHistory: false,
      playHistoryItemHeight: 40,
      showMenu: false,
      x: 0,
      y: 0,
    };
  },
  computed: {
    ...mapState("song", ["waitingPlayList", "currentSongInfo"]),
  },
  methods: {
    ...mapMutations("song", ["setWaitingPlayList", "setCurrentSongInfo"]),
    show(e, id) {
      e.preventDefault();

      if (id == this.currentSongInfo.id) {
        return;
      }

      const index = this.waitingPlayList.findIndex((item) => item.id === id);

      this.showMenu = false;
      this.x = e.layerX;
      this.y = e.layerY + index * this.playHistoryItemHeight;

      const parentWidth = e.target.parentNode.parentNode.scrollWidth;
      const parentHeight = e.target.parentNode.parentNode.scrollHeight;

      parentWidth - this.x < 80 && (this.x = parentWidth - 80);
      parentHeight - this.y < 72 && (this.y = parentHeight - 72);

      this.$nextTick(() => {
        (this.showMenu = true), (this.selectId = id);
      });
    },
    onClickOutside() {
      this.showPlayHistory = false;
    },
    clickPlayHistoryItem(item) {
      if(!this.$vuetify.breakpoint.mobile && !isTouchDevice) return

      this.$playMusic(item.id)
      this.showPlayHistory = false
    },
    dblclickPlayHistoryItem(item) {
      if(this.$vuetify.breakpoint.mobile) return

      this.$playMusic(item.id)
    },
    deleteAll() {
      this.$PauseMusic();
      this.setWaitingPlayList([]);
      this.setCurrentSongInfo({});
      this.dialog = false;
      this.showPlayHistory = false;
    },
    deleteItem() {
      if (this.selectId) {
        const waitingPlayList = [...this.waitingPlayList];
        waitingPlayList.splice(
          waitingPlayList.findIndex((item) => item.id == this.selectId),
          1
        );
        this.setWaitingPlayList(waitingPlayList);
      }
    },
    closeDialog() {
      this.dialog = false;
    },
  },
  watch: {
    showPlayHistory(val) {
      !this.fullPlayer && this.$lock(val);
    },
    showMenu(val) {
      if (!val) {
        this.selectId = 0;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.play-history {
  position: absolute;
  bottom: 120%;
  right: 0;
  background-color: #fff;
  height: 500px;
  width: 400px;
  max-width: 90vw;
  z-index: 99;
  color: #000 !important;
  .top {
    padding: 8px 8px 0;
    height: 80px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .title {
      font-size: 24px !important;
      position: relative;
      .close-icon {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .info-box {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      font-size: 16px;
      line-height: 32px;
      border-bottom: 1px solid #eee;
      ::v-deep .v-btn__content {
        vertical-align: text-top;
      }
      .but {
        cursor: pointer;
        color: var(--mainColor);
      }
    }
  }
  .play-history-box {
    list-style-type: none;
    padding: 0;
    height: calc(100% - 80px);
    overflow-y: auto;
    position: relative;
    .play-history-item {
      padding: 0 8px;
      height: var(--playHistoryItemHeight);
      line-height: var(--playHistoryItemHeight);
      cursor: pointer;
      transition: var(--animationTime);
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-left: 25px;
      font-size: 1rem;
      & > * {
        pointer-events: none;
      }
      &:hover {
        background-color: rgba($color: #000000, $alpha: 0.05);
      }
      &.active {
        color: var(--mainColor);
      }
      &.select-item {
        color: var(--textColor);
        background-color: var(--mainColor);
      }
      .play-icon {
        vertical-align: middle;
        position: absolute;
        left: 0;
      }
      .song-info {
        .artist-item {
          font-size: 0.8em;
          display: inline-block;
          cursor: pointer;
          // color: #666;
          opacity: 0.7;
          &::after {
            content: "/";
            padding: 0 5px;
            cursor: default;
          }
          &:last-of-type {
            &::after {
              content: "";
            }
          }
        }
      }
    }
  }

  .dialog-box {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    .bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba($color: #000000, $alpha: 0.46);
    }
    .dialog {
      width: 300px;
      .card-title {
        font-size: 1rem;
      }
    }
  }
}

.playlist-but {
  transition: var(--animationTime);
  color: var(--textColor);
}

::v-deep .v-menu__content {
  position: absolute;
  top: var(--top) !important;
  left: var(--left) !important;
}
</style>