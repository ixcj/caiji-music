<template>
  <div class="videos-list">
    <div
      class="videos-list-item"
      :class="$vuetify.breakpoint.name"
      v-for="item in dataList"
      :key="item.vid"
    >
      <div class="videos-list-item-img">
        <v-img
          class="cover rounded-lg"
          :aspect-ratio="16/9"
          :src="item.coverUrl"
          :alt="item.title"
          @click="clickItem(item)"
        />
      </div>
      <div class="videos-list-item-info">
        <div
          class="videos-list-item-title"
          :class="`text-overflow${$vuetify.breakpoint.mobile ? '2' : ''}`"
          :title="item.title"
          @click="clickItem(item)"
        >
          <span v-if="item.type === 0" class="tag">MV</span>
          <span>{{ item.title }}</span>
        </div>
        <ul class="videos-list-item-creator-box text-overflow">
          <li
            v-for="creator in item.creator"
            :key="creator.userId"
            class="videos-list-item-creator-item"
          >{{ creator.userName }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VideosList',
  props: {
    dataList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      imgWidth: 80
    };
  },
  methods: {
    clickItem(item) {
      this.$router.push({
        name: item.type === 0 ? 'Mv' : 'Video',
        params: {
          id: item.vid
        }
      })
    },
  },
};
</script>

<style scoped lang="scss">
.videos-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  &-item {
    .cover {
      cursor: pointer;
      background-color: rgba($color: #000000, $alpha: 0.05);
    }
    .videos-list-item-info {
      .videos-list-item-title {
        margin-top: 0.4em;
        font-size: 1em;
        cursor: pointer;
        .tag {
          font-size: .8em;
          display: inline-block;
          padding: 0 .5rem;
          border-radius: 5px;
          margin-right: 5px;
          color: var(--mainColor);
          border: var(--mainColor) solid 1px;
        }
        span {
          vertical-align: middle;
        }
      }
      .videos-list-item-creator-box {
        list-style-type: none;
        padding: 0;
        font-size: .8em;
        .videos-list-item-creator-item {
          cursor: pointer;
          display: inline-block;
          color: #666;
          transition: var(--animationTime);
          &:hover {
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
    &.xl {
      width: calc((100% - 45px) / 4);
    }
    &.lg {
      width: calc((100% - 45px) / 4);
    }
    &.md {
      width: calc((100% - 30px) / 3);
    }
    &.sm {
      width: calc((100% - 15px) / 2);
    }
    &.xs {
      width: 100%;
      display: flex;
      gap: 10px;
      .videos-list-item-img {
        width: 40%;
      }
      .videos-list-item-info {
        width: calc(100% - 40% - 10px);
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .videos-list-item-title {
          margin-top: 0;
        }
      }
    }
  }
}
</style>