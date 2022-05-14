<template>
  <div class="albums">
    <v-hover
      v-for="(item, index) in dataList"
      :key="index"
      v-slot:default="{ hover }"
    >
      <div
        class="albums-item"
        :class="{ hover: hover && !$vuetify.breakpoint.mobile }"
        v-ripple="$vuetify.breakpoint.mobile"
        @click="clickItem(item)"
        @dblclick="dblclickItem(item)"
      >
        <v-img
          class="cover rounded"
          :width="imgWidth"
          :height="imgWidth"
          :src="`${item.picUrl.replace('http://', '//')}?param=100y100`"
        ></v-img>
        <div
          class="info-box"
          :class="{ mobile: $vuetify.breakpoint.mobile }"
          :style="{ height: `${imgWidth}px`, width: `calc(100% - ${imgWidth + 10}px)` }"
        >
          <div class="text">
            <div class="name text-overflow">
              {{ item.name }}
            </div>
            <ul class="artists text-overflow">
              <li
                class="artist-item"
                v-for="artist in item.artists"
                :key="artist.id"
              >
                <span @click.stop="goArtist(artist.id)" @dblclick.stop>{{ artist.name }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </v-hover>
  </div>
</template>

<script>
import { isTouchDevice } from '@/utils'

export default {
  name: 'Albums',
  props: {
    dataList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
    };
  },
  computed: {
    imgWidth() {
      return this.$vuetify.breakpoint.mobile ? 60 : 80
    }
  },
  methods: {
    dblclickItem(item) {
      if(this.$vuetify.breakpoint.mobile) return

      this.$router.push({
        name: 'Album',
        params: {
          id: item.id
        }
      })
    },
    clickItem(item) {
      if(!this.$vuetify.breakpoint.mobile && !isTouchDevice) return
      
      this.$router.push({
        name: 'Album',
        params: {
          id: item.id
        }
      })
    },
    goArtist(id) {
      this.$router.push({
        name: 'Artist',
        params: {
          id
        }
      })
    }
  }
};
</script>

<style scoped lang="scss">
.albums {
  padding-left: 0;
  background-color: #fff;
  border: 1px solid #f1f1f1;
  border-bottom: none;
  .albums-item {
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
        .name {
          flex: 2;
        }
        .artists {
          flex: 1;
          list-style-type: none;
          padding: 0;
          font-size: .8rem;
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
      &.mobile {
        .text {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: flex-start;
          .name {
            flex: none;
          }
          .artists {
            flex: none;
          }
        }
      }
    }
  }
}
</style>