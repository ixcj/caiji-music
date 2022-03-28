<template>
  <div class="mv-item" @click.stop="goTo('Mv', item.id)">
    <v-responsive class="rounded" :aspect-ratio="16 / 9">
      <v-hover
        v-slot:default="{ hover }"
        :disabled="$vuetify.breakpoint.mobile"
      >
        <div class="cover" :class="hover && 'hover'">
          <v-img
            class="img rounded"
            :src="`${ item.picUrl }?param=400y225`"
          ><!-- 移动端某些浏览器没内容时图片不会显示，未找到原因 -->0</v-img>
          <template v-if="!loading">
            <div class="copywriter">{{ item.copywriter }}</div>
            <div class="number">
              <v-icon class="play-icon" small color="#fff">mdi-play</v-icon>
              {{ item.playCount > 100000 ? parseInt(item.playCount / 10000) + '万' : item.playCount }}
            </div>
          </template>
        </div>
      </v-hover>
    </v-responsive>
    <v-skeleton-loader
      boilerplate
      :height="textBoxHeight"
      :loading="loading"
      transition="fade-transition"
      type="list-item-two-line"
    >
      <div :style="`max-height: ${ textBoxHeight }px`">
        <span class="name text-overflow">{{ item.name }}</span>
        <ul class="artists text-overflow">
          <li
            class="artist-item"
            v-for="artist in item.artists"
            :key="artist.id"
            @click.stop="goTo('Artist', artist.id)"
          >
            <span>{{ artist.name }}</span>
          </li>
        </ul>
      </div>
    </v-skeleton-loader>
  </div>
</template>

<script>
export default {
  name: 'MvItem',
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
      textBoxHeight: 60
    };
  },
  methods: {
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
};
</script>

<style scoped lang="scss">
.mv-item {
  background-color: transparent;
  overflow: hidden;
  .cover {
    height: 100%;
    background-color: #dbdbdb;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    &.hover {
      .copywriter {
        transform: translateY(0);
      }
      .number {
        opacity: 0;
      }
    }
    .img {
      color: transparent;
      width: 100%;
      height: 100%;
      vertical-align: middle;
    }
    .copywriter {
      position: absolute;
      width: 100%;
      top: 0;
      left: 0;
      padding: 10px 12px;
      transform: translateY(-100%);
      transition: var(--animationTime);
      background-color: rgba($color: #000000, $alpha: .4);
      font-size: 16px;
      color: #fff;
    }
    .number {
      display: flex;
      align-items: center;
      position: absolute;
      right: 5px;
      top: 5px;
      color: #fff;
      opacity: 1;
      transition: var(--animationTime);
      font-size: 0.8rem;
      background-color: rgba($color: #000000, $alpha: 0.3);
      backdrop-filter: blur(2px);
      border-radius: 1rem;
      padding: 0 0.5rem 0 0.3rem;
      word-break: keep-all;
      .play-icon {
        margin-right: 3px;
        font-size: 1rem;
      }
    }
  }
  .name {
    cursor: pointer;
    width: 100%;
    padding-top: 10px;
    box-sizing: border-box;
    
    font-size: 1.1em;
  }
  .artists {
    list-style-type: none;
    padding: 0;
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
          content: none;
        }
      }
    }
  }
}
::v-deep .v-skeleton-loader__list-item-two-line, .v-skeleton-loader__list-item-avatar-two-line {
  height: 100%;
  padding: 0;
  background-color: transparent !important;
}
</style>