<template>
  <v-hover
    v-slot:default="{ hover }"
  >
    <li
      class="songs-item"
      v-ripple="$vuetify.breakpoint.mobile"
      :class="{
        'no-copyright-sounds': item.privilege.st < 0,
        hover: hover && !$vuetify.breakpoint.mobile
      }"
      @click="clickItem(item, item.privilege.st < 0)"
      @dblclick="dblclickItem(item, item.privilege.st < 0)"
    >
      <div class="left">
        <span class="index">
          <v-icon v-if="item.id === currentSongId" :color="$store.getters.mainColor">{{ playStatus ? 'mdi-volume-high' : 'mdi-volume-low'}}</v-icon>
          <template v-else>
            {{ (index + 1) | add0 }}
          </template>
        </span>
        <p class="song-name text-overflow" :class="{active: item.id === currentSongId}">{{ item.name }}</p>
        <ul class="artists text-overflow">
          <li class="tag-box">
            <span class="tag pointer" v-if="item.mv" @click.stop="goTo('Mv', item.id)" @dblclick.stop>MV</span>
            <span class="tag" v-if="item.privilege.fee == 1">VIP</span>
          </li>
          <li
            class="artist-item"
            v-for="(artist, index) in item.ar"
            :key="index"
          >
            <span @click.stop="goTo('Artist', artist.id)" @dblclick.stop>{{ artist.name }}</span>
          </li>
        </ul>
      </div>
      <div class="right">
        <div class="album text-overflow">
          <span class="pointer" @click.stop="goTo('Album', item.al.id)" @dblclick.stop>{{ item.al.name }}</span>
        </div>
        <div class="time">{{ item.dt | timestampToMinute }}</div>
      </div>
    </li>
  </v-hover>
</template>

<script>
import { isTouchDevice } from '@/utils'

export default {
  name: 'SongItem',
  props: {
    source: {
      type: Object,
      default () {
        return {}
      }
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {};
  },
  methods: {
    dblclickItem(item, NoCopyrightSounds) {
      if(this.$vuetify.breakpoint.mobile) return

      if(NoCopyrightSounds) {
        this.$message({
          content: '暂无版权',
          color: 'error',
          timeout: 3000,
          isShow: true
        })
        return
      }
      this.$playMusic(item)
    },
    clickItem(item, NoCopyrightSounds) {
      if(!this.$vuetify.breakpoint.mobile && !isTouchDevice) return
      
      if(NoCopyrightSounds) {
        this.$message({
          content: '暂无版权',
          color: 'error',
          timeout: 3000,
          isShow: true
        })
        return
      }
      this.$playMusic(item)
    },
    goTo(name, id) {
      if(!id) {
        const type = {
          Artist: '歌手',
          Mv: 'MV',
          Album: '专辑'
        }[name]
        this.$message({
          content: `无法找到${type}信息！`,
          color: 'error'
        })
        return
      }
      this.$router.push({
        name,
        params: {
          id
        }
      })
    }
  },
  computed: {
    item() {
      return this.source
    },
    currentSongId() {
      return this.$store.getters.currentSongInfo?.id || 0
    },
    playStatus() {
      return this.$bottomPlayer.playStatus
    }
  }
};
</script>

<style scoped lang="scss">
.songs-item {
  height: 70px;
  box-sizing: border-box;
  padding: 10px 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f1f1f1;
  transition: var(--animationTime);
  &.hover {
    background-color: rgba($color: #000000, $alpha: 0.05);
  }
  &.no-copyright-sounds {
    cursor: not-allowed;
    * {
      opacity: 0.8;
    }
  }
  .left {
    width: 60%;
    height: 100%;
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    position: relative;
    padding-left: 2.5rem;
    .mobile & {
      width: 80%;
    }
    .index {
      font-size: 1em;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #999;
      width: 2.5rem;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
    }
    .song-name {
      font-size: 1rem;
      margin-bottom: 0;
      .mobile & {
        font-size: 1.1rem;
      }
      &.active {
        color: var(--mainColor);
        font-weight: bold;
      }
    }
    .artists {
      list-style-type: none;
      padding: 0;
      font-size: .75rem;
      .mobile & {
        font-size: .85rem;
      }
      .tag-box {
        display: inline-block;
        .tag {
          color: var(--mainColor);
          border: 1px solid var(--mainColor);
          border-radius: 3px;
          padding: 0 3px;
          margin-right: 5px;
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
            content: none;
          }
        }
      }
    }
  }
  .right {
    width: 40%;
    display: flex;
    justify-content: space-between;

    color: #999;
    font-size: 0.9rem;
    .mobile & {
      width: 20%;
    }
    .album {
      flex: 3;
      &:hover {
        color: #333;
      }
      
      .mobile & {
        display: none;
      }
    }
    .time {
      flex: 1;
      padding-right: 1rem;
      box-sizing: border-box;
      display: flex;
      justify-content: flex-end;
    }
  }
}

.pointer {
  cursor: pointer;
}
</style>