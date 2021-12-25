<template>
  <div
    class="lyric"
    :class="{
      'no-update-lyric': !isUpdateLyricsLocation,
      mobile: $vuetify.breakpoint.mobile
    }"
    @click="$emit('switchCover')"
  >
    <swiper
      v-show="!loading && !error && !nolyric"
      class="swiper-box"
      ref="mySwiper"
      :options="swiperOptions"
    >
      <swiper-slide
        class="swiper-item"
        v-for="(item, index) in lyric"
        :key="index"
        :class="{ 'current-lyric': currentLyricIndex == (index + 1) }"
        @click.native="e => handleSwiperItem(e, index)"
      >
        {{ item.text }}
        <div class="time">
          <v-icon dark>{{ 'mdi-play' }}</v-icon>
          <span>{{ parseInt(item.time) | timestampToMinute }}</span>
        </div>
      </swiper-slide>
    </swiper>
    <div v-show="loading || error || nolyric">
      <span v-if="nolyric">纯音乐，请欣赏</span>
      <span v-if="loading">歌词加载中...</span>
      <span v-if="error" @click.stop>歌词加载失败，请<span class="text-highlight" style="font-weight: bold; cursor: pointer;" @click="getLyric">重试</span></span>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide, directive  } from '@/components/Base/vue-awesome-swiper'
import 'swiper/css/swiper.css'
import { isEmpty } from '@/utils'

export default {
  name: 'Lyric',
  props: {
    id: {
      type: Number,
      default: null
    },
    show: {
      type: Boolean,
      default: false
    },
    playStatus: {
      type: Boolean,
      default: false
    },
    currentTimeMillisecond: {
      type: Number,
      default: 0
    }
  },
  components: {
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      error: false,
      loading: false,
      sourceData: null,
      currentLyricIndex: 0,
      isUpdateLyricsLocation: true,
      isUpdateLyricsLocationTimer: null,
      nolyric: false
    };
  },
  methods: {
    handleSwiperItem(e, index) {
      if(!this.isUpdateLyricsLocation && this.swiper.activeIndex == index) {
        e.stopPropagation()
        const time = this.lyric[index].time
        if(!isEmpty(time)) {
          this.$emit('setCurrentTime', time)
          this.$nextTick(() => {
            this.isUpdateLyricsLocation = true
          })
          clearTimeout(this.isUpdateLyricsLocationTimer)
        }
      }
    },
    getLyric() {
      this.loading = true
      this.error = false
      this.nolyric = false

      const id = this.id

      if(id) {
        this.$api.song.lyric({
          id
        }).then(res => {
          if(id !== this.id) return

          if(res.nolyric) {
            this.nolyric = true
          } else {
            this.sourceData = res.lrc.lyric
            this.loading = false
          }
          this.updateLyricsLocation(true)
        }).catch(() => {
          this.loading = false
          this.error = true
        })
      } else {
        this.sourceData = ''
      }
    },
    getLyricIndex(arr, num) {
      if(num < arr[0]) return 1

      for (let i = 0; i < arr.length; i++) {
        if(num < arr[i]) {
          return i
        }
      }

      return arr.length
    },
    updateLyricsLocation(forcedToUpdate = false) {
      if(!this.show) return
      
      if(this.lyric?.length) {
        const index = this.getLyricIndex(this.lyric.map(item => item.time), this.currentTimeMillisecond)
        if(forcedToUpdate || this.currentLyricIndex != index) {
          this.currentLyricIndex = index
          if(forcedToUpdate || this.isUpdateLyricsLocation) {
            this.swiper.slideTo(this.currentLyricIndex - 1)
          }
        }
      }
    },
    noUpdateLyric() {
      this.isUpdateLyricsLocation = false
    },
    updateLyric() {
      // 5秒后开始恢复歌词滚动
      clearTimeout(this.isUpdateLyricsLocationTimer)
      this.isUpdateLyricsLocationTimer = setTimeout(() => {
        this.isUpdateLyricsLocation = true
        this.playStatus && this.updateLyricsLocation(true)
      }, 5000)
    }
  },
  computed: {
    swiperOptions() {
      return {
        direction: 'vertical',
        slidesPerView: 'auto',
        centeredSlides: true,
        watchSlidesProgress: true,
        grabCursor: true,
        noUpdate: true,
        on: {
          touchMove: () => {
            this.noUpdateLyric()
          },
          touchEnd: () => {
            this.updateLyric()
          }
        }
      }
    },
    swiper() {
      return this.$refs.mySwiper.$swiper
    },
    lyric() {
      if(!this.sourceData) return []

      const lyric = []
      this.sourceData.split('\n').filter(Boolean).forEach(item => {
        const lyricItem = item.replace(/\[(\d{1}|\d{2}):(\d{1}|\d{2})((\.|\:)(\d{1}|\d{2}|\d{3}))?\]/g, '').trim()
        const timeArr = item.match(/\[(\d{1}|\d{2}):(\d{1}|\d{2})((\.|\:)(\d{1}|\d{2}|\d{3}))?\]/g)
        if(Array.isArray(timeArr)) {
          timeArr.forEach(item => {
            const times = item.substring(item.indexOf("[") + 1, item.indexOf("]")).split(':')
            const time = times.length ? Number(times[0]) * 60 + Number(times[1]) : 0
            lyric.push({
              text: lyricItem,
              time
            })
          })
        }
      })

      return lyric.filter(item => item.text.length && !isNaN(item.time)).sort((a, b) => a.time - b.time)
    }
  },
  watch: {
    id() {
      this.getLyric()
    },
    currentTimeMillisecond() {
      this.updateLyricsLocation()
    },
    playStatus(val) {
      if(val) {
        this.updateLyricsLocation(true)
        this.isUpdateLyricsLocation = true
      }
    },
    show(val) {
      if(val) {
        this.updateLyricsLocation(true)
        this.isUpdateLyricsLocation = true
      }
    }
  },
  created() {
    this.getLyric()
  },
  directives: {
    swiper: directive
  }
};
</script>

<style scoped lang="scss">
.lyric {
  transform: translateZ(0);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  mask-image: linear-gradient(0deg, transparent 0%, #000 10%, #000 90%, transparent 100%);
}

.swiper-box {
  font-size: 18px;
  width: 100%;
  height: 100%;
  .swiper-item {
    text-align: center;
    opacity: .4;
    padding: 10px 40px;
    box-sizing: border-box;
    position: relative;
    word-wrap: break-word;
    height: auto;
    .mobile & {
      font-size: 16px;
      line-height: 20px;
    }
    &.swiper-slide-active{
      opacity: .8;
      .no-update-lyric & .time {
        opacity: 1;
        cursor: pointer;
      }
    }
    &.current-lyric {
      opacity: 1 !important;
    }
    .time {
      position: absolute;
      top: 0; bottom: 0;
      left: 0; right: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      opacity: 0;
      font-size: 14px;
      transition: var(--animationTime);
      padding: 0 3px;
    }
  }
}
</style>