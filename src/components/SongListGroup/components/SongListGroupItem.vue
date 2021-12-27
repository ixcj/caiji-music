<template>
  <div class="song-list-item" @click="goPlaylist">
    <v-responsive class="rounded" :aspect-ratio="1">
      <v-skeleton-loader
        boilerplate
        :loading="loading"
        class="cover-skeleton"
        type="image"
      >
        <v-hover
          v-slot:default="{ hover }"
          :disabled="$vuetify.breakpoint.mobile"
        >
          <div
            class="cover rounded"
            :class="hover && 'hover'"
          >
            <v-img
              class="cover-img"
              :src="`${item.picUrl}?param=256y256`"
              :lazy-src="`${item.picUrl}?param=32y32`"
            ><!-- 移动端某些浏览器没内容时图片不会显示，未找到原因 -->0</v-img>
            <div class="number">
              <v-icon class="play-icon" small color="#fff">mdi-play</v-icon>
              {{ item.playCount > 100000 ? parseInt(item.playCount / 10000) + '万' : item.playCount }}
            </div>
            <v-icon class="icon" :color="$store.getters.textColor">mdi-play</v-icon>
          </div>
        </v-hover>
      </v-skeleton-loader>
    </v-responsive>
    <v-skeleton-loader
      boilerplate
      :loading="loading"
      class="text-skeleton name"
      type="list-item-two-line"
    >
      <div class="text-overflow2">{{ item.name }}</div>
    </v-skeleton-loader>
  </div>
</template>

<script>
  export default {
    name: 'SongListItem',
    props: {
      item: {
        type: Object,
        default: () => ({})
      },
      loading: {
        type: Boolean,
        default: true
      },
    },
    data() {
      return {
      };
    },
    methods: {
      goPlaylist() {
        if(this.loading) return
        
        this.$router.push({
          name: 'Playlist',
          params: {
            id: this.item.id
          }
        })
      }
    }
  };
</script>

<style scoped lang="scss">
.song-list-item {
  width: 100%;
  .cover {
    position: relative;
    cursor: pointer;
    height: 100%;
    overflow: hidden;
    &.hover {
      .icon {
        opacity: 1;
      }
    }
    &-img {
      width: 100%;
      color: transparent;
    }
    .number {
      display: flex;
      align-items: center;
      position: absolute;
      right: 3px;
      top: 3px;
      color: #fff;
      font-size: 0.8rem;
      background-color: rgba($color: #000000, $alpha: 0.3);
      backdrop-filter: blur(2px);
      border-radius: 1rem;
      padding: 0 0.5rem 0 0.3rem;
      word-break: keep-all;
      .play-icon {
        margin-right: 3px;
        font-size: 1rem !important;
      }
    }
    .icon {
      opacity: 0;
      transition: var(--animationTime);
      background-color: var(--mainColor);
      position: absolute;
      right: 10px;
      bottom: 10px;
      border-radius: 50%;
      padding: 5px;
      box-sizing: border-box;
      width: 34px;
      height: 34px;
    }
  }
  .name {
    cursor: pointer;
    margin-top: .3em;
    font-size: 1em;
  }
  .text-skeleton {
    height: 3em;
    ::v-deep .v-skeleton-loader__text {
      height: .75em;
    }
    ::v-deep .v-skeleton-loader__list-item-two-line {
      height: 100%;
      background-color: transparent;
      padding: 0;
    }
  }
}
</style>