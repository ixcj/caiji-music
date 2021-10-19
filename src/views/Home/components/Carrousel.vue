<template>
  <v-hover v-slot:default="{ hover }" :disabled="$vuetify.breakpoint.mobile">
    <v-responsive
      class="banner-box rounded-lg"
      :class="hover && 'hover'" ref="mySwiper" 
      width="100%"
      :aspect-ratio="27 / 10"
    >
      <v-skeleton-loader
        boilerplate
        :loading="loading"
        transition="fade-transition"
        class="mx-auto"
        type="image"
      >
        <swiper class="swiper-box" :options="swiperOptions">
          <!-- 无内容时占位 -->
          <swiper-slide
            v-if="!bannersFilter.length"
            class="swiper-item rounded-lg"
            :class="$vuetify.breakpoint.name"
          ></swiper-slide>

          <swiper-slide
            v-for="(item, index) in bannersFilter"
            :key="index"
            class="swiper-item rounded-lg"
            :class="$vuetify.breakpoint.name"
            @click.native="bannerClick(item)"
          >
            <img
              class="banner-img"
              :src="`${item.imageUrl.replace('http://', '//')}?param=1080y400`"
            />
            <v-sheet
              class="badge"
              bottom
              inline
              v-if="item.typeTitle"
              :color="$store.getters.mainColor"
              v-text="item.typeTitle"
            ></v-sheet>
          </swiper-slide>
          <div v-show="bannersFilter.length" class="swiper-pagination" slot="pagination"></div>
          <v-btn class="prev" slot="button-prev" fab dark small :color="$store.getters.mainColor">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn class="next" slot="button-next" fab dark small :color="$store.getters.mainColor">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>            
        </swiper>
      </v-skeleton-loader>
    </v-responsive>
  </v-hover>
</template>

<script>
import { Swiper, SwiperSlide, directive  } from '@/components/Base/vue-awesome-swiper'
import 'swiper/css/swiper.css'

export default {
  name: "Home",
  components: {
    Swiper,
    SwiperSlide,
  },
  methods: {
    getData() {
      this.$api.home.banner().then(res => {
        if(res.code == 200) {
          this.banners = res.banners
          this.loading = false
        }
      })
    },
    bannerClick(item) {
      const id = item.targetId
      const { targetType } = item // targetType: 1 单曲, 10 专辑, 1004 MV
      
      if(targetType == 1) {
        this.$playMusic(id)
      } else {
        const targetTypeRouterName = {
          '10': 'Album',
          '1004': 'Mv'
        }
        if(Object.keys(targetTypeRouterName).includes(targetType.toString())) {
          this.$router.push({
            name: targetTypeRouterName[targetType],
            params: {
              id
            }
          })
        } else {
          this.$message({
            content: '未知的banner类型',
            color: 'error'
          })
        }
      }
    },
  },
  data() {
    return {
      loading: true,
      banners: [],
      swiperOptions: {
        pagination:{
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.next',
          prevEl: '.prev',
        },
        autoplay: {
          delay: 5000,
          disableOnInteraction: false
        },
        loop: true,
        initialSlide: 0,
        centeredSlides: true,
        centeredSlidesBounds: true,
        slidesPerView: 1,
        spaceBetween: 20,
      }
    }
  },
  computed: {
    bannersFilter() {
      return this.banners.filter(item => {
        return [1, 10, 1004].includes(item.targetType)
      })
    }
  },
  mounted() {
    this.getData()
  }
};
</script>

<style lang="scss" scoped>
.banner-box {
  position: relative;
  &.hover {
    .next,
    .prev {
      transform: translate(0, -50%);
    }
  }
  .mx-auto {
    height: 100%;
    ::v-deep .v-skeleton-loader__image {
      background-color: #dbdbdb;
    }
  }
  .swiper-box {
    height: 100%;
    .swiper-item {
      background-color: #dbdbdb;
      width: 100%;
      height: 100%;
      overflow: hidden;
      cursor: pointer;
      font-size: calc(0.3vw + 8px);
      .banner-img {
        width: 100%;
        height: 100%;
        vertical-align: middle;
      }
      .badge {
        pointer-events: none;
        position: absolute;
        display: inline-block;
        right: 0;
        bottom: 0;
        padding: 3px 6px;
        border-radius: 9px 0 0 0;
        color: var(--textColor);
        font-size: 1em;
        padding: calc(1em / 4) calc(1em / 2);
      }
    }
  }
  .but-box {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
  }
  .next,
  .prev {
    color: var(--textColor);
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
    z-index: 9;
    transition: var(--animationTime);
  }
  .prev {
    left: 15px;
    transform: translate(calc(-100% - 20px), -50%);
  }
  .next {
    right: 15px;
    transform: translate(calc(100% + 20px), -50%);
  }
  .swiper-container {
    .swiper-pagination {
      width: 100%;
      bottom: 0;
      ::v-deep .swiper-pagination-bullet {
        outline: none;
        background-color: rgba($color: #ffffff, $alpha: 1.0);
        border-radius: calc(100vw / 400 + 12px);
        width: calc(100vw / 400 + 12px);
        height: calc(100vw / 1000 + 2px);
        margin: 0 calc(100vw / 600 + 3px);
      }
    }
  }
}
</style>
