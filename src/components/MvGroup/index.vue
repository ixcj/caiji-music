<template>
  <div class="mv-group group">
    <h2 class="group-title" v-if="title">
      <span :class="path && 'more'">{{ title }}</span>
    </h2>
    <div class="swiper-box">
      <swiper ref="mySwiper" :options="swiperOptions">
        <swiper-slide
          v-for="item in dataListFormat"
          :key="item.id"
          class="swiper-item"
          :class="$vuetify.breakpoint.name"
        >
          <MvItem :item="item" :loading="loading" />
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide, directive  } from '@/components/Base/vue-awesome-swiper'
import 'swiper/css/swiper.css'
import MvItem from './components/MvItem'

export default {
  name: 'MvGroup',
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
    dataList: {
      type: Array,
      default: () => []
    },
    dataListLength: {
      type: Number,
      default: 4
    },
    swiperOptions: {
      type: Object,
      default: () => {
        return {
          initialSlide: 0,
          centeredSlides: true,
          centeredSlidesBounds: true,
          freeMode: true,
          freeModeSticky: true,
          slidesPerView: 'auto',
          spaceBetween: 8,
          breakpoints: {
            600: {
              spaceBetween: 10,
            },
            800: {
              spaceBetween: 12,
            },
            1100: {
              spaceBetween: 14,
            },
            1400: {
              spaceBetween: 16,
            }
          }
        }
      }
    }
  },
  components: {
    Swiper,
    SwiperSlide,
    MvItem
  },
  data() {
    return {};
  },
  methods: {},
  computed: {
    swiper() {
      return this.$refs.mySwiper.$swiper
    },
    dataListFormat() {
      const { length } = this.dataList
      if(length) {
        return this.dataList
      } else {
        return Array.from(new Array(this.dataListLength), (item, index) => {
          return {
            id: index + 1
          }
        })
      }
    }
  },
  directives: {
    swiper: directive
  }
};
</script>
