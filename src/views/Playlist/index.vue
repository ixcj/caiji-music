<template>
  <div class="playlist" v-resize="onResize" :key="pageNmae">
    <div class="playlist-header">
      <v-responsive class="cover rounded" :aspect-ratio="1" :width="imgSize" :height="imgSize">
        <v-img
          class="cover-img"
          :src="`${coverImgUrl}?param=256y256`"
          v-show="!loading"
        ></v-img>
      </v-responsive>
      <div class="text-box" :style="{width: `calc(100% - ${imgSize}px)`}">
        <v-skeleton-loader
          boilerplate
          class="mx-auto"
          type="heading, button, text"
          :loading="loading"
        >
          <div class="name text-overflow2"><span class="type">{{ pageType }}</span>{{ name }}</div>
          <v-btn
            small
            class="play-all"
            :color="$store.getters.mainColor"
            @click="dialog = true"
          >
            <v-icon>mdi-play</v-icon>
            <span @click="dialog = true">播放全部</span>
          </v-btn>
          <div
            class="description"
            :class="{'text-overflow': !unfold}"
            :style="{ '-webkit-line-clamp': lineClamp }"
            v-if="pageNmae == 'Playlist'"
            ref="description"
          >
            {{ description || '并没有描述' }}
            <span class="arrows" @click="unfold = !unfold" v-show="descriptionOverflow">
              <v-icon>{{ unfold ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            </span>
          </div>
          <div v-else class="artist">
            <div class="text-overflow">
              歌手：{{ artists }}
            </div>
            <div class="text-overflow">
              时间：{{ publishTime | formatDate }}
            </div>
          </div>
        </v-skeleton-loader>
      </div>
    </div>
    <div class="paly-list-box">
      <Songs ref="songs" :dataList="songs" v-show="!listLoading" />
      <div v-show="listLoading || listError">
        <div class="loding-box" v-show="listLoading">
          <v-progress-circular
            :size="30"
            :width="3"
            :color="$store.getters.mainColor"
            indeterminate
          ></v-progress-circular>
          <span class="text">加载中...</span>
        </div>
        <div class="loding-box" v-show="listError && !loading">
          歌曲加载失败，请<span class="text-highlight" style="font-weight: bold; cursor: pointer;" @click="getList">重试</span>
        </div>
      </div>
    </div>

    <v-dialog
      v-model="dialog"
      width="300"
    >
      <v-card>
        <v-card-title class="headline">提示</v-card-title>

        <v-card-text style="font-size: 1rem;">
          "播放全部" 将会替换当前的播放列表，是否继续?
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :color="'#333'"
            text
            @click="dialog = false"
          >
            取消
          </v-btn>
          <v-btn
            :color="$store.getters.mainColor"
            text
            @click="playListAll"
          >
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Songs from '@/components/Songs'

export default {
  name: 'Playlist',
  components: {
    Songs
  },
  data() {
    return {
      loading: false,
      listLoading: false,
      listError: false,
      unfold: false,
      pageNmae: '',
      id: 0,
      name: '',
      description: '',
      descriptionOverflow: false,
      coverImgUrl: '',
      artists: '',
      publishTime: '',
      trackIds: '',
      songs: [],
      dialog: false
    };
  },
  methods: {
    ...mapActions('song', [
      'playAll'
    ]),
    onResize() {
      if(this.routeName !== 'Playlist') return

      this.isDescriptionOverflow()
    },
    isDescriptionOverflow() {
      if(!this.$refs.description) return

      if(this.unfold) {
        this.unfold = false
      } else {
        this.descriptionOverflow = this.$refs.description.scrollHeight - this.$refs.description.clientHeight > 10
      }
    },
    getData() {
      this.loading = true
      this.listLoading = true
      this.unfold = false

      const { id } = this
      if(!id || !this.getDetail) return
      this.getDetail({
        id
      }).then(res => {
        switch(this.routeName) {
          case 'Playlist':
            this.renderPlaylist(res)
            break
          case 'Album':
            this.renderAlbum(res)
        }
      })
    },
    renderPlaylist(data) {
      this.loading = false

      this.name = data.playlist.name
      this.description = data.playlist.description
      this.coverImgUrl = data.playlist.coverImgUrl
      this.trackIds = data.playlist.trackIds.map(item => item.id).join(',')

      this.getList()

      this.$nextTick(() => {
        this.isDescriptionOverflow()
      })
    },
    getList() {
      if(!this.trackIds) return

      this.listError = false
      this.listLoading = true

      this.$api.song.detail({
        ids: this.trackIds
      }).then(res => {
        res.songs.map((item, index) => {
          item.privilege = res.privileges[index]
        })
        
        this.songs = res.songs
        this.listLoading = false

        this.$refs.songs.updatePageModeFront()
      }).catch(() => {
        this.listError = true
        this.listLoading = false
        this.songs = []

        this.$refs.songs.updatePageModeFront()
      })
    },
    renderAlbum(data) {
      this.loading = false
      this.listLoading = false

      this.name = data.album.name
      this.coverImgUrl = data.album.picUrl

      this.artists = data.album.artists.map(item => item.name).join(' / ')
      this.publishTime = data.album.publishTime

      this.songs = data.songs
    },
    playListAll() {
      if(this.listLoading) {
        this.$message({
          content: '请等待列表加载完成',
          color: 'warning'
        })
        return
      }
      if(!this.songs.length) {
        this.$message({
          content: '列表为空！',
          color: 'error'
        })
        return
      }

      this.playAll({
        playlist: this.songs,
        bottomPlayer: this.$bottomPlayer
      })
      this.dialog = false
    }
  },
  computed: {
    imgSize() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return 145
        case 'sm': return 160
        case 'md': return 175
        case 'lg': return 190
        case 'xl': return 205
      }
    },
    lineClamp() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return 2
        case 'sm': return 2
        case 'md': return 3
        case 'lg': return 3
        case 'xl': return 3
      }
    },
    routeName() {
      const pageNmae = this.$route.name
      if(['Playlist', 'Album'].includes(pageNmae)) {
        this.pageNmae = pageNmae
      }
      return pageNmae
    },
    getDetail() {
      const getDataMap = {
        Playlist: this.$api.playlist.playlistDetail,
        Album: this.$api.playlist.album
      }
      return getDataMap[this.routeName]
    },
    pageType() {
      return {
        Playlist: '歌单',
        Album: '专辑'
      }[this.pageNmae]
    }
  },
  watch: {
    '$route.params.id'(val) {
      if(!['Playlist', 'Album'].includes(this.routeName)) return

      if(val && this.id != val) {
        this.id = val
      }
    },
    id() {
      this.data = this.$options.data()
      this.getData()
    },
    unfold() {
      this.$refs.songs.updatePageModeFront()
    }
  },
  created() {
    this.pageNmae = this.$route.name
    this.id = this.$route.params.id
  }
};
</script>

<style scoped lang="scss">
.playlist {
  .playlist-header {
    display: flex;
    & > * {
      transition: var(--animationTime);
    }
    .cover {
      background-color: #dbdbdb;
    }
    .text-box {
      padding-left: 20px;
      box-sizing: border-box;
      .name {
        font-size: 1.5rem;
        word-break: break-all;
        .type {
          font-size: .8em;
          display: inline-block;
          padding: 0 .5rem;
          border-radius: 5px;
          margin-right: 5px;
          vertical-align: middle;
          color: var(--mainColor);
          border: var(--mainColor) solid 1px;
          vertical-align: text-top;
        }
      }
      .play-all {
        margin: 3px 0 10px 0;
        color: var(--textColor);
      }
      .description {
        padding-right: 30px;
        word-break: break-all;
        position: relative;
        .arrows {
          cursor: pointer;
          position: absolute;
          top: 0;
          right: 0;
        }
      }
    }
  }

  .paly-list-box {
    margin-top: 12px;
    .loding-box {
      padding-top: 20px;
      text-align: center;
      .text {
        font-size: 1rem;
        margin-left: .8rem;
      }
    }
  }

  ::v-deep {
    .v-skeleton-loader__heading {
      width: 100%;
      max-width: 300px;
      height: 1.3rem;
      margin: 0.7rem 0;
    }
    .v-skeleton-loader__button {
      margin: 3px 0 10px 0;
      width: 110px;
      height: 28px;
    }
    .v-skeleton-loader__text {
      width: 100%;
      max-width: 800px;
      height: 0.75rem;
      margin: 0.75rem 0;
    }
  }
}
</style>