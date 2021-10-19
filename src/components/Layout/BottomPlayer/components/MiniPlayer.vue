<template>
  <div class="mini-player" :class="{ mobile: $vuetify.breakpoint.mobile }">
    <div class="song-info">
      <v-img
        class="album-art-preloading"
        :src="isCurrentSong ? currentSongInfo.al.picUrl : defaultAlbumArt"
        @load="albumArtLoad"
        @error="albumArtLoad"
      />
      <v-img
        class="album-art rounded"
        :src="albumArtImage"
      >
        <v-row
          class="fill-height ma-0"
          align="center"
          justify="center"
          v-show="loading"
        >
          <v-progress-circular indeterminate :color="$store.getters.textColor"></v-progress-circular>
        </v-row>
        <v-hover
          v-if="currentSongInfo.id"
          v-slot:default="{ hover }"
        >
          <div class="album-mask" :class="{ mobile: $vuetify.breakpoint.mobile }" @click="openFullPlayer">
            <transition name="slide-y-reverse-transition" mode="out-in">
              <v-icon v-show="hover" color="#fff" x-large>mdi-chevron-up</v-icon>
            </transition>
          </div>
        </v-hover>
      </v-img>
      <div class="text-box" v-if="isCurrentSong">
        <p class="song-name text-overflow">{{ currentSongInfo.name }}<span class="artist">{{ currentSongInfo.ar.map(item => item.name).join(' ') }}</span></p>
        <p class="time">
          <span class="play-tiem">{{ currentTime | timestampToMinute }}</span>
          /
          <span class="end-time">{{ endTime | timestampToMinute }}</span>
        </p>
      </div>
    </div>
    <div class="functional-zone">
      <div class="main-control">
        <transition name="scale-transition">
          <v-btn
            fab
            small
            :color="$store.getters.mainColor"
            :disabled="isOperable"
            v-if="!$vuetify.breakpoint.mobile"
            @click="$emit('handlePrev')"
          >
            <v-icon dark>mdi-skip-previous</v-icon>
          </v-btn>
        </transition>
        <transition name="scale-transition">
          <v-btn
            fab
            class="play-but"
            :class="{'mx-8': !$vuetify.breakpoint.mobile}"
            :color="$store.getters.mainColor"
            :small="$vuetify.breakpoint.mobile"
            :disabled="isOperable"
            @click="switchPlayStatus"
          >
            <v-icon dark>{{ playStatus ? 'mdi-pause' : 'mdi-play' }}</v-icon>
          </v-btn>
        </transition>
        <transition name="scale-transition">
          <v-btn
            fab
            small
            :color="$store.getters.mainColor"
            :disabled="isOperable"
            v-if="!$vuetify.breakpoint.mobile"
            @click="$emit('handleNext')"
          >
            <v-icon dark>mdi-skip-next</v-icon>
          </v-btn>
        </transition>
      </div>
      <div class="other-control">
        <PlayType />
        <PlayHistory />
      </div>
    </div>
  </div>
</template>

<script>
import { defaultAlbumArt } from '@/config'
import PlayType from './PlayType'
import PlayHistory from './PlayHistory'
import Index from '../../index';

export default {
  name: 'MiniPlayer',
  props: {
    playStatus: {
      type: Boolean,
      default: false
    },
    currentTime: {
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
    showFullPlayer: {
      type: Boolean,
      default: false
    }
  },
  components: {
    PlayHistory,
    PlayType,
    Index
  },
  data() {
    return {
      albumArtImage: '',
      maySwitchPlayStatus: true,
      defaultAlbumArt,
    };
  },
  methods: {
    switchPlayStatus() {
      if(this.maySwitchPlayStatus) {
        this.maySwitchPlayStatus = false
        this.$emit(this.playStatus ? 'pause' : 'play')
        setTimeout(() => {
          this.maySwitchPlayStatus = true
        }, 100)
      }
    },
    // 打开完整播放器
    openFullPlayer() {
      if(this.currentSongInfo.id) {
        this.$router.push({
          query: {
            showFullPlayer: true,
            ...this.$route.query
          }
        })
      }
    },
    albumArtLoad(url) {
      this.albumArtImage = url
    }
  },
  computed: {
    isCurrentSong() {
      return Boolean(Object.keys(this.currentSongInfo).length)
    },
    isOperable() {
      return Boolean(!this.currentSongInfo.id)
    }
  },
};
</script>

<style scoped lang="scss">
.mini-player {
  display: flex;
  padding: 6px;
}
.song-info {
  flex: 1;
  height: 100%;
  padding-left: 64px;
  position: relative;
  .mobile & {
    flex: 2;
  }
  .album-art-preloading {
    position: absolute;
    z-index: -1;
    opacity: 0;
  }
  .album-art {
    position: absolute;
    left: 0;
    height: 58px;
    width: 58px;
    ::v-deep .v-image__image {
      transition: background-image var(--animationTime);
    }
    .album-mask {
      width: 100%;
      height: 100%;
      backdrop-filter: blur(2px);
      background-color: rgba($color: #000000, $alpha: 0.35);
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      opacity: 0;
      transition: var(--animationTime);
      &.mobile {
        opacity: 0 !important;
      }
      &:hover {
        opacity: 1;
      }
    }
  }
  .text-box {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    .song-name {
      font-size: 1em;
      margin: 0;
      vertical-align: text-bottom;
      .artist {
        color: #666;
        font-size: .8em;
        &::before {
          content: ' - ';
        }
      }
    }
    .time {
      margin: 0;
      font-size: .8em;
    }
  }
}
.functional-zone {
  flex: 2;
  display: flex;
  & * {
    color: var(--textColor);
  }
  .mobile & {
    flex: 1;
  }
  .main-control {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .other-control {
    flex: 1;
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-end;
    align-items: center;
    position: relative;
    .playlist-but {
      transition: var(--animationTime);
    }
  }
}
</style>