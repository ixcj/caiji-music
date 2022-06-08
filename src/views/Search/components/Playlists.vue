<template>
  <div class="playlists">
    <v-hover
      v-for="(item, index) in dataList"
      :key="index"
      v-slot:default="{ hover }"
    >
      <div
        class="playlists-item"
        :class="{ hover: hover && !$vuetify.breakpoint.mobile }"
        v-ripple="$vuetify.breakpoint.mobile"
        @click="clickItem(item)"
      >
        <v-img
          class="cover rounded"
          :width="imgWidth"
          :height="imgWidth"
          :src="`${item.coverImgUrl.replace('http://', '//')}?param=100y100`"
        ></v-img>
        <div
          class="info-box"
          :style="{ height: `${imgWidth}px`, width: `calc(100% - ${imgWidth + 10}px)` }"
        >
          <div class="text">
            <div class="item-info">
              <p class="name text-overflow">{{ item.name }}</p>
              <p class="description text-overflow">{{ item.description || '并没有描述' }}</p>
            </div>
            <div v-show="!$vuetify.breakpoint.mobile" class="creator text-overflow">
              <span>by <span class="nickname" @click.stop="goCreator(item.creator.userId)" @dblclick.stop="goCreator(item.creator.userId)">{{ item.creator.nickname }}</span></span>
            </div>
          </div>
        </div>
      </div>
    </v-hover>
  </div>
</template>

<script>
export default {
  name: 'Playlists',
  props: {
    dataList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {};
  },
  computed: {
    imgWidth() {
      return this.$vuetify.breakpoint.mobile ? 60 : 80
    }
  },
  methods: {
    clickItem(item) {
      this.$router.push({
        name: 'Playlist',
        params: {
          id: item.id
        }
      })
    },
    goCreator(id) {
      console.log('点击歌单创建者', id)
    }
  },
};
</script>

<style scoped lang="scss">
.playlists {
  padding-left: 0;
  background-color: #fff;
  border: 1px solid #f1f1f1;
  border-bottom: none;
  &-item {
    transition: var(--animationTime);
    padding: 10px;
    box-sizing: border-box;
    border-bottom: 1px solid #f1f1f1;
    &.hover {
      background-color: rgba($color: #000000, $alpha: 0.05);
    }
    .cover {
      display: inline-block;
      position: relative;
      background-color: rgba($color: #000000, $alpha: 0.05);
      vertical-align: middle;
      transition: var(--animationTime);
      .account-icon {
        position: absolute;
        left: 0;
        right: 0;
      }
    }
    .info-box {
      display: inline-block;
      vertical-align: top;
      margin-left: 10px;
      position: relative;
      .text {
        height: 100%;
        display: flex;
        align-items: center;
        gap: 20px;
        .item-info {
          height: 100%;
          display: flex;
          justify-content: space-around;
          flex-direction: column;
          flex: 3;
          .name {
            font-size: 1rem;
            margin-bottom: 0;
          }
          .description {
            font-size: 0.8rem;
            color: #666;
            margin-bottom: 0;
          }
        }
        .creator {
          flex: 1;
          list-style-type: none;
          padding: 0;
          font-size: .8rem;
          color: #999;
          .nickname {
            transition: var(--animationTime);
            cursor: pointer;
            &:hover {
              color: #000;
            }
          }
        }
      }
    }
  }
}
</style>