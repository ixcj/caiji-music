<template>
  <div class="full-player" v-resize="onResize">
    <!-- 背景 -->
    <div class="bg-box" :style="{ backgroundImage: `url(${ imgUrl })` }">
      <!-- 遮罩层 -->
      <div class="mask-layer"></div>
    </div>
    <!-- 内容 -->
    <div class="content">
      <div class="top">
        <span class="icon left" @click="close"><v-icon x-large color="#fff">mdi-chevron-down</v-icon></span>
        <div class="song-info">
          <span class="name text-overflow">{{ currentSongInfo.name }}</span>
          <ul class="artists text-overflow">
            <li
              class="artist-item"
              v-for="artist in currentSongInfo.ar"
              :key="artist.id"
            >
              <span @click="goArtist(artist.id)">{{ artist.name }}</span>
            </li>
          </ul>
        </div>
        <span class="icon right"></span>
      </div>

      <div
        class="main"
        :class="{ 'sm-and-down': isSmAndDown }"
        v-touch="{
          left: () => showCover && $emit('handleNext'),
          right: () => showCover && $emit('handlePrev'),
        }"
      >
        <transition name="fade-transition" mode="out-in">
          <div class="cover"
            :style="{ paddingBottom: $vuetify.breakpoint.mobile ? '20%' : '' }"
            v-show="!isSmAndDown || showCover"
            @click="switchCover"
          >
            <div class="cover-img-box">
              <canvas class="cover-background" id="background"></canvas>
              <img class="cover-img" :class="{ paused: !playStatus }" :src="imgUrl" :key="imgUrl" alt="" draggable>
              <v-progress-circular
                v-if="loading"
                class="loading"
                size="80"
                width="6"
                indeterminate
                :color="$store.getters.textColor"
              ></v-progress-circular>
            </div>
          </div>
        </transition>
        <transition name="fade-transition" mode="out-in">
          <div class="lyric-box" v-show="!isSmAndDown || !showCover">
            <Lyric
              :id="currentSongInfo.id"
              :show="show && (!isSmAndDown || !showCover)"
              :playStatus="playStatus"
              :currentTimeMillisecond="currentTimeMillisecond"
              @setCurrentTime="currentTime => setCurrentTime(currentTime, true)"
              @switchCover="switchCover"
            />
          </div>
        </transition>
      </div>

      <div class="bottom">
        <div class="content">
          <ProgressBar
            fullPlayer
            class="progress-bar"
            :currentTime="currentTimeSubstitute"
            :endTime="endTime"
            @update:currentTime="val => this.currentTimeSubstitute = val"
            @setCurrentTime="setCurrentTime"
            @noUpdateCurrentTime="noUpdateCurrentTime = true"
          />
          <PlayType fullPlayer />
          <div>
            <v-btn
              fab
              small
              color="rgba(255, 255, 255, 0.1)"
              @click="$emit('handlePrev')"
            >
              <v-icon dark>mdi-skip-previous</v-icon>
            </v-btn>
            <v-btn
              fab
              class="mx-4 play-but"
              color="rgba(255, 255, 255, 0.1)"
              @click="switchPlayStatus"
            >
              <v-icon dark>{{ playStatus ? 'mdi-pause' : 'mdi-play' }}</v-icon>
            </v-btn>
            <v-btn
              fab
              small
              color="rgba(255, 255, 255, 0.1)"
              @click="$emit('handleNext')"
            >
              <v-icon dark>mdi-skip-next</v-icon>
            </v-btn>
          </div>
          <PlayHistory fullPlayer @closeFullPlayer="$emit('close')" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defaultAlbumArt } from '@/config'
import dynamicEffect from '@/utils/dynamicEffect'
import Lyric from './Lyric'
import ProgressBar from '../ProgressBar'
import PlayHistory from '../PlayHistory'
import PlayType from '../PlayType'

export default {
  name: 'FullPlayer',
  props: {
    show: {
      type: Boolean,
      defalut: false
    },
    playStatus: {
      type: Boolean,
      default: false
    },
    currentTime: {
      type: Number,
      default: 0
    },
    currentTimeMillisecond: {
      type: Number,
      default: 0
    },
    endTime: {
      type: Number,
      default: 0
    },
    currentSongInfo: {
      type: Object,
      default: () => {}
    },
    loading: {
      type: Boolean,
      default: false
    },
  },
  components: {
    Lyric,
    ProgressBar,
    PlayHistory,
    PlayType
  },
  data() {
    return {
      scene: null,
      canvas: null,
      canvasTimer: null,
      imgUrl: '',
      maySwitchPlayStatus: true,
      showCover: true,
      currentTimeSubstitute: this.currentTime,
      noUpdateCurrentTime: false,
      defaultAlbumArt
    };
  },
  methods: {
    close() {
      this.$emit('close')
    },
    goArtist(id) {
      this.close()
      setTimeout(() => {
        this.$router.push({
          name: 'Artist',
          params: {
            id
          }
        })
      }, this.$store.getters.animationTime / 2)
      
    },
    load() {
      this.imgUrl = this.preloadUrl
      this.imgUrlLoad = false
    },
    switchPlayStatus() {
      if(this.maySwitchPlayStatus) {
        this.maySwitchPlayStatus = false
        this.$emit(this.playStatus ? 'pause' : 'play')
        setTimeout(() => {
          this.maySwitchPlayStatus = true
        }, 100)
      }
    },
    switchCover() {
      if(this.isSmAndDown) {
        this.showCover = !this.showCover
      }
    },
    onResize(e) {
      clearTimeout(this.canvasTimer)
      this.canvasTimer = setTimeout(() => {
        const CanvasIsChange = this.setCanvasWideHighAndIsChange()
        if(e && CanvasIsChange) this.run()
      }, 300);
    },
    run(updateWideHigh = true) {
      this.$nextTick(() => {
        if(this.scene?.stop) {
          this.scene.stop()
        }

        updateWideHigh &&　this.setCanvasWideHighAndIsChange()
        this.scene = new dynamicEffect[this.dynamicEffect](this.canvas)

        if(this.scene?.run && this.playStatus) {
          this.scene.run()
        }
      })
    },
    setCurrentTime(currentTime, isPlay = false) {
      this.$emit('setCurrentTime', currentTime)
      isPlay && this.$emit('play')
      this.noUpdateCurrentTime = false
    },
    setCanvasWideHighAndIsChange() {
      const oldWideHigh = this.canvas.width
      const newWideHigh = Math.ceil(this.canvas.parentNode.offsetWidth * 2)
      this.canvas.width = this.canvas.height = newWideHigh
      
      return oldWideHigh !== newWideHigh
    }
  },
  computed: {
    isCurrentSong() {
      return Boolean(Object.keys(this.currentSongInfo).length)
    },
    isSmAndDown() {
      return this.$vuetify.breakpoint.smAndDown
    },
    preloadUrl() {
      return this.isCurrentSong ? `${this.currentSongInfo.al.picUrl}?param=256y256` : this.defaultAlbumArt
    },
    dynamicEffect() {
      return this.$store.getters.dynamicEffect
    }
  },
  watch: {
    dynamicEffect() {
      this.run(false)
    },
    show(val) {
      if(val) {
        (!this.scene?.getPlayState() || !this.canvas.width) && this.run()
      } else {
        this.showCover = true
      }
    },
    currentTime(val) {
      if(!this.noUpdateCurrentTime) {
        this.currentTimeSubstitute = val
      }
    },
    playStatus(val) {
      if(val) {
        if(this.scene?.run) {
          this.scene.run()
        }
      } else {
        if(this.scene?.stop) {
          this.scene.stop()
        }
      }
    },
    preloadUrl(val) {
      if(val) {
        var img = new Image()
        img.src = val
        if (img.complete) {
          this.load()
          return
        }
        img.onload = this.load
      } else {
        this.imgUrl = defaultAlbumArt
      }
    }
  },
  mounted() {
    this.canvas = document.getElementById('background');
    this.setCanvasWideHighAndIsChange()
  },
  created() {
    this.imgUrl = this.isCurrentSong ? this.currentSongInfo.al.picUrl : defaultAlbumArt
  }
};
</script>

<style scoped lang="scss">
.full-player {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #fff;
  overflow: hidden;

  .bg-box {
    position: absolute;
    top: -100px; bottom: -100px;
    left: -100px; right: -100px;
    background-size: cover;
    background-position: top center;
    filter: blur(50px);
    transition: background-image var(--animationTime);
    .bg-img {
      object-fit: cover;
      width: 100%;
      height: 100%;
      position: absolute;
      opacity: 0;
    }
    .mask-layer {
      width: 100%;
      height: 100%;
      background-color: rgba($color: #000000, $alpha: 0.6);
      position: absolute;
    }
  }

  .content {
    position: relative;
    color: #fff;
    height: 100%;
    .top {
      width: 100%;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      .icon {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        &.left {
          left: 10px;
        }
        &.right {
          right: 10px;
        }
      }
      .song-info {
        width: calc(100% - 100px);
        text-align: center;
        font-size: calc(16px + 0.4vw);
        .name {
          width: 100%;
          font-size: 1em;
        }
        .artists {
          font-size: .65em;
          list-style-type: none;
          padding: 0;
          .artist-item {
            display: inline-block;
            color: #fff;
            cursor: pointer;
            &::after {
              content: '/';
              padding: 0 5px;
              cursor: default;
            }
            &:last-of-type {
              &::after {
                content: none;
              }
            }
          }
        }
      }
    }

    .main {
      margin: 0 auto;
      max-width: 1200px;
      height: calc(100% - 164px);
      display: flex;
      position: relative;
      overflow: hidden;
      &.sm-and-down .cover, 
      &.sm-and-down .lyric-box {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 0;
        width: 100%;
      }
      .cover {
        width: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        .cover-img-box {
          margin: 0 auto;
          max-width: 50%;
          position: relative;
          height: 0;
          width: 100%;
          padding-bottom: 50%;
          &::before {
            content: "";
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            height: 100%;
            filter: blur(10px);
            border-radius: 50%;
            background-image: radial-gradient(white, rgba(0, 0, 0, 0));
          }
          &::after {
            content: "";
            border: #fff 1px solid;
            position: absolute;
            top: -5%;
            left: -5%;
            width: 110%;
            height: 110%;
            border-radius: 50%;
          }
          .cover-background {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
          .cover-img {
            position: absolute;
            border-radius: 50%;
            display: inline-block;
            width: 100%;
            height: 100%;
            object-fit: cover;
            vertical-align: middle;
            animation: rotate 25s linear infinite;
            background-color: #ccc;
            &.paused {
              animation-play-state: paused;
            }
          }
          .loading {
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
          }
        }
      }
      .lyric-box {
        width: 50%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
      }

      .switchover {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 0;
      }
    }

    .bottom {
      position: absolute;
      bottom: 0;
      height: 100px;
      width: 100%;
      & * {
        color: #fff;
      }
      .content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 24px 12px 8px;
        box-sizing: border-box;
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        .progress-bar {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          padding: 0 4px;
        }
      }
    }
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100%{
      transform: rotate(360deg);
    }
  }
}
</style>