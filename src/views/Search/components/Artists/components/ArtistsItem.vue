<template>
  <v-hover
      v-slot:default="{ hover }"
    >
    <div
      class="artists-item"
      :class="{ hover: hover && !$vuetify.breakpoint.mobile }"
      v-ripple="$vuetify.breakpoint.mobile"
      @click="clickItem(item)"
      @dblclick="dblclickItem(item)"
    >
      <v-img
        class="cover rounded"
        :width="imgSize"
        :height="imgSize"
        :src="`${item.picUrl.replace('http://', '//')}?param=100y100`"
        :lazy-src="`${item.picUrl.replace('http://', '//')}?param=10y10`"
      ></v-img>
      <div class="info-box" :style="`height: ${imgSize}px; line-height: ${imgSize}px;`">
        <div class="text-overflow">
          {{ item.name }}
          <span class="alia" v-if="alia">({{ alia }})</span>
        </div>
      </div>
    </div>
  </v-hover>
</template>

<script>
import { isTouchDevice } from '@/utils'

export default {
  name: 'ArtistsItem',
  props: {
    source: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data() {
    return {
      imgSize: 80
    }
  },
  computed: {
    item() {
      return this.source
    },
    alia() {
      return this.item.alia?.length ? this.item.alia[0] : false
    },
    // 入驻歌手
    // accountId() {
    //   return this.item?.accountId ? this.item.accountId : false
    // }
  },
  methods: {
    dblclickItem(item) {
      if(this.$vuetify.breakpoint.mobile) return

      this.$router.push({
        name: 'Artist',
        params: {
          id: item.id
        }
      })
    },
    clickItem(item) {
      if(!this.$vuetify.breakpoint.mobile && !isTouchDevice) return
      
      this.$router.push({
        name: 'Artist',
        params: {
          id: item.id
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.artists-item {
  height: 100px;
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
    .account-icon {
      position: absolute;
      left: 0;
      right: 0;
    }
  }
  .info-box {
    display: inline-block;
    height: 100%;
    line-height: 80px;
    vertical-align: top;
    margin-left: 10px;
    width: calc(100% - 100px);
    .alia {
      color: #666;
    }
  }
}
</style>
