<template>
  <div class="song-group group">
    <h2 class="group-title" v-if="title">
      <span :class="path && 'more'">{{ title }}</span>
    </h2>
    <div class="swiper-box">
      <swiper ref="mySwiper" :class="{ 'swiper-no-swiping': loading }" :options="swiperOptions">
        <swiper-slide
          v-for="(row, index) in dataListFormat"
          :key="index"
          class="swiper-item"
          :class="$vuetify.breakpoint.name"
        >
          <SongItem
            class="song-item"
            v-for="item in row"
            :key="item.id"
            :item="item"
            :loading="loading"
            @dblclick.native="dblClickSongItem(item)"
          />
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide, directive  } from '@/components/Base/vue-awesome-swiper'
import 'swiper/css/swiper.css'
import SongItem from './components/SongItem'

export default {
  name: '',
  props: {
    title: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: true
    },
    path: {
      type: String,
      default: ''
    },
    line: {
      type: Number,
      default: 4
    },
    dataListLength: {
      type: Number,
      default: 12
    },
    dataList: {
      type: Array,
      default: () => []
    },
    swiperOptions: {
      type: Object,
      default: () => {
        return {
          initialSlide: 0,
          slidesPerView: 'auto',
        }
      }
    }
  },
  components: {
    Swiper,
    SwiperSlide,
    SongItem
  },
  data() {
    return {
    };
  },
  computed: {
    dataListFormat() {
      const newArr = []
      let arr = []
      if(this.dataList.length) {
        arr = this.dataList.filter(item => {
          return this.$store.getters.vipType ? true : item.privilege.fee !== 1
        })
      } else {
        arr = new Array(this.dataListLength).fill().map((item, index) => {
          return {
            id: index + 1,
            privilege: {
              fee: 0
            }
          }
        })
      }
      arr.length = this.dataListLength
      
      while(arr.length > 0) {
        newArr.push(arr.splice(0, this.line))
      }
      return newArr
    },
    swiper() {
      return this.$refs.mySwiper.$swiper
    }
  },
  methods: {
    dblClickSongItem(data) {
      if(!this.$vuetify.breakpoint.mobile) {
        this.$playMusic(data.id)
      }
    }
  },
  directives: {
    swiper: directive
  }
};
</script>
