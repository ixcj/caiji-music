<template>
  <v-hover v-slot:default="{ hover }" :disabled="$vuetify.breakpoint.mobile">
    <div class="song-item rounded" :class="!loading && hover && 'hover'">
      <v-responsive class="rounded" :aspect-ratio="1" :width="imgSize">
        <div class="cover rounded" @click="clickCover">
          <v-img
            class="cover-img"
            :src="`${item.album && item.album.blurPicUrl.replace('http://', '//')}?param=256y256`"
          ><!-- 移动端某些浏览器没内容时图片不会显示，未找到原因 -->0</v-img>
          <v-icon class="icon" :color="$store.getters.mainColor" v-if="!loading">mdi-play</v-icon>
        </div>
      </v-responsive>
      <v-skeleton-loader
        boilerplate
        class="mx-auto"
        type="list-item-two-line"
        :loading="loading"
      >
        <div class="content">
          <p class="song-name text-overflow">{{ item.name }}</p>
          <ul class="artists text-overflow">
            <li class="tag-box">
              <span class="tag pointer" v-if="item.mvid" @click.stop="goTo('Mv', item.id)" @dblclick.stop>MV</span>
              <span class="tag" v-if="item.privilege.fee == 1">VIP</span>
            </li>
            <li
              class="artist-item"
              v-for="(artist, index) in item.artists"
              :key="index"
              @click.stop="goTo('Artist', artist.id)"
              @dblclick.stop
            >
              <span>{{ artist.name }}</span>
            </li>
          </ul>
        </div>
      </v-skeleton-loader>
    </div>
  </v-hover>
</template>

<script>
  export default {
    name: 'SongItem',
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
      clickCover() {
        this.$playMusic(this.item.id)
      },
      goTo(name, id) {
        if(this.loading) return
        
        this.$router.push({
          name,
          params: {
            id
          }
        })
      }
    },
    computed: {
      imgSize() {
        return 80
      }
    }
  };
</script>

<style scoped lang="scss">
.song-item {
  width: 100%;
  display: flex;
  transition: var(--animationTime);
  &.hover {
    background-color: rgba($color: #000000, $alpha: .05);
    .icon {
      opacity: 1 !important;
    }
  }
  .mx-auto {
    width: 100%;
    height: 100%;
  }
  .cover {
    height: 100%;
    background-color: #dbdbdb;
    overflow: hidden;
    cursor: pointer;
    &-img {
      color: transparent;
    }
    &:active {
      .icon {
        opacity: 1;
      }
    }
    .icon {
      opacity: 0.75;
      transition: var(--animationTime);
      background-color: var(--textColor);
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      padding: 5px;
      box-sizing: border-box;
      width: 34px;
      height: 34px;
    }
  }
  .content {
    width: 100%;
    height: 100%;
    padding: 8px 16px;
    box-sizing: border-box;
    font-size: 1em;
    .song-name {
      font-size: 1.25em;
      margin-bottom: 10px
    }
    .artists {
      list-style-type: none;
      padding: 0;
      .tag-box {
        display: inline-block;
        .tag {
          color: var(--mainColor);
          border: 1px solid var(--mainColor);
          border-radius: 3px;
          padding: 0 3px;
          margin-right: 5px;
          &.pointer {
            cursor: pointer;
          }
        }
      }
      .artist-item {
        display: inline-block;
        cursor: pointer;
        color: #666;
        :hover {
          color: #000;
        }
        &::after {
          content: '/';
          padding: 0 5px;
          cursor: default;
        }
        &:last-of-type {
          &::after {
            content: '';
          }
        }
      }
    }
  }

  ::v-deep .v-skeleton-loader__list-item-two-line {
    background-color: transparent;
    padding: 8px 16px;
    box-sizing: border-box;
    .v-skeleton-loader__sentences.v-skeleton-loader__bone {
      height: 100%;
      .v-skeleton-loader__bone {
        height: 14px;
        margin-bottom: 8px;
      }
    }
  }
}
</style>