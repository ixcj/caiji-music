<template>
  <div class="search-expand rounded-lg elevation-6">
    <v-icon
      right
      class="close-icon"
      @click.stop="close"
    >mdi-chevron-up</v-icon>
    <div class="content scrollbar-y">
      <transition name="fade-transition" mode="out-in">
        <div class="absolute" v-show="!Object.keys(suggest).length">
          <!-- 搜索历史 -->
          <div class="search-history" v-show="searchHistory.length">
            <p class="title">搜索历史 <v-icon @click="clickDeleteAll">mdi-delete</v-icon></p>
            <div class="search-history-box">
              <v-hover
                v-for="item in searchHistory"
                :key="item"
                v-slot:default="{ hover }"
              >
                <div
                  :class="{hover}"
                  class="search-history-item rounded-pill"
                  @click.stop="$emit('search', item)"
                >
                  {{item}}
                  <v-icon
                    class="search-history-item-close-icon"
                    dense
                    @click.stop="deleteSearchHistory(item)"
                  >mdi-close</v-icon>
                </div>
              </v-hover>
            </div>
          </div>
          <!-- 热门搜索 -->
          <div class="hot-search">
            <p class="title">热门搜索</p>
            <p v-if="!hotList.length" style="text-align: center">
              <v-progress-circular
                :size="30"
                :width="4"
                :color="$store.getters.mainColor"
                indeterminate
              ></v-progress-circular>
            </p>
            <ul v-else class="hot-search-box">
              <li
                class="hot-search-item"
                v-for="(item, index) in hotList"
                :key="item.searchWord"
                :class="{'top-three': index < 3}"
                @click.stop="$emit('search', item.searchWord)"
              >
                <span class="index">{{index + 1}}</span>
                {{item.searchWord}}
                <img class="icon" v-if="item.iconUrl" :src="item.iconUrl.replace('http://', '//')">
              </li>
            </ul>
          </div>
        </div>
      </transition>
      <transition name="fade-transition" mode="out-in">
        <!-- 搜索建议 -->
        <div class="absolute suggest-box" v-show="Object.keys(suggest).length">
          <div class="keyword-box" @click="$emit('search', suggest.keyword)">搜索"<span class="text-highlight">{{ suggest.keyword }}</span>"相关内容<v-icon>mdi-chevron-right</v-icon></div>
          <div class="suggest-item" v-for="(type, index) in suggest.order" :key="index">
            <div class="type-name">
              <v-icon class="icon">{{ typeInfo[type].icon }}</v-icon>
              {{ typeInfo[type].name }}
            </div>
            <div
              class="suggest-type-item bg-hover text-overflow"
              v-for="suggestTypeItem in suggest[type]"
              :key="suggestTypeItem.id"
              @click="handleSuggest(suggestTypeItem, type)"
            >
              <span v-html="highlight(suggestTypeItem.name, suggest.keyword) + ' '"></span>
              <span v-if="suggestTypeItem.alias" class="alias">{{ suggestTypeItem.alias.length ? suggestTypeItem.alias.map(item => `(${item})`).join(' ') : '' }}</span>
              <span v-if="suggestTypeItem.artists" v-html="' - ' + highlight(suggestTypeItem.artists.map(item => item.name).join(' '), suggest.keyword)"></span>
              <span v-if="suggestTypeItem.artist" v-html="' - ' + highlight(suggestTypeItem.artist.name, suggest.keyword)"></span>
            </div>
          </div>
        </div>
      </transition>
      <transition name="fade-transition" mode="out-in">
        <div class="dialog-box" v-show="dialog">
          <div class="bg" @click.stop="closeDialog"></div>
          <transition name="scale-transition" mode="out-in">
            <v-card class="dialog" v-show="dialog">
              <v-card-title>确定删除历史记录?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="green darken-1"
                  text
                  @click="closeDialog()"
                >
                  取消
                </v-btn>
                <v-btn
                  color="red darken-1"
                  text
                  @click="deleteAll()"
                >
                  确定
                </v-btn>
              </v-card-actions>
            </v-card>
          </transition>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'SearchExpand',
  props: {
    keyword: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialog: false,
      hotList: [],
      suggest: {},
      timer: null,
      typeInfo: {
        songs: {
          icon: 'mdi-music-note-eighth',
          name: '单曲'
        },
        artists: {
          icon: 'mdi-account',
          name: '歌手'
        },
        albums: {
          icon: 'mdi-album',
          name: '专辑'
        },
        playlists: {
          icon: 'mdi-playlist-music',
          name: '歌单'
        }
      }
    };
  },
  computed: {
    ...mapState('history', [
      'searchHistory'
    ])
  },
  methods: {
    ...mapMutations('history', [
      'deleteSearchHistory'
    ]),
    clickDeleteAll() {
      this.dialog = true
    },
    deleteAll() {
      this.deleteSearchHistory('all')
      this.closeDialog()
    },
    closeDialog() {
      this.dialog = false
    },
    getSearchSuggest() {
      if (this.keyword.split(' ').filter(Boolean).length === 0) {
        return
      }
      const { keyword } = this
      this.$api.search.suggest({
        keywords: keyword
      }).then(res => {
        if (keyword === this.keyword) {
          if (!Object.keys(res.result.order).length) {
            return
          }
          this.suggest = {
            ...res.result,
            keyword: keyword
          }
        } else {
          this.getSearchSuggest()
        }
      })
    },
    close() {
      this.$emit('close')
    },
    handleSuggest(data, type) {
      const { id } = data
      switch(type) {
        case 'songs':
          this.$playMusic(id)
          break
        case 'artists':
          this.$router.push({
            name: 'Artist',
            params: {
              id
            }
          })
          break
        case 'albums':
          this.$router.push({
            name: 'Album',
            params: {
              id
            }
          })
          break
        case 'playlists':
          this.$router.push({
            name: 'Playlist',
            params: {
              id
            }
          })
          break
      }
      this.close()
    },
    highlight(value, keyword) {
      const valueArr = value.toLowerCase().split(keyword.toLowerCase())
      
      if (valueArr.length === 1) {
        return value
      } else {
        const keywordIndex = value.toLowerCase().indexOf(keyword.toLowerCase())
        return `${valueArr[0]}<span class="text-highlight">${value.substring(keywordIndex, keyword.length)}</span>${valueArr[1]}`
      }
    }
  },
  created() {
    this.$api.search.hot().then(res => {
      this.hotList = res.data
    })
  },
  watch: {
    keyword(newVal, oldVal) {
      if (newVal) {
        if (!oldVal) {
          this.getSearchSuggest()
        } else {
          clearTimeout(this.timer)
          this.timer = setTimeout(() => {
            this.getSearchSuggest()
          }, 450)
        }
      } else {
        this.suggest = {}
      }
    }
  }
};
</script>

<style scoped lang="scss">
.search-expand {
  position: absolute;
  background-color: #fff;
  overflow: auto;
  width: 100%;
  height: 350px;
  max-height: calc(100vh - 128px);
  left: 0;
  top: calc(100% + 5px);
  .content {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 5px;
    }
  }
  .close-icon {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 99;
  }
  .title {
    font-size: 1.2em !important;
    font-weight: bold;
    margin-bottom: 5px;
  }
  .search-history {
    padding: 0 8px;
    .search-history-box {
      display: flex;
      flex-wrap: wrap;
      .search-history-item {
        font-size: .85em;
        cursor: pointer;
        display: flex;
        align-items: center;
        border: 1px solid #cdcdcd;
        padding: 2px 2em 2px 1em;
        margin: 0 5px 5px 0;
        transition: .25s;
        position: relative;
        &.hover {
          background-color: rgba($color: #000000, $alpha: 0.05);
        }
        .search-history-item-close-icon {
          position: absolute;
          right: 3px;
          font-size: 1.4em;
        }
      }
    }
  }
  .hot-search {
    margin-top: 5px;
    .title {
      margin: 0;
      padding: 0 8px;
    }
    .hot-search-box {
      list-style: none;
      padding: 0;
      .hot-search-item {
        cursor: pointer;
        display: flex;
        align-items: center;
        padding: 5px 0;
        position: relative;
        transition: .25s;
        &:hover {
          background-color: #f5f5f5;
        }
        &.top-three {
          font-weight: bold;
          .index {
            color: red;
          }
        }
        .index {
          margin: 0 8px;
        }
        .icon {
          margin-left: 5px;
          height: 15px;
        }
      }
    }
  }
}

.dialog-box {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  .bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba($color: #000000, $alpha: 0.46);
  }
  .dialog {
    width: 300px;
  }
}

.absolute {
  position: absolute;
  width: 100%;
  padding: 8px 0;
}

.bg-hover:hover {
  background-color: rgba($color: #000000, $alpha: 0.075);
}

.suggest-box {
  .keyword-box {
    cursor: pointer;
    padding: 5px 8px;
    display: flex;
    align-items: center;
    transition: var(--animationTime);
    color: #666;
    transform: translateY(-4px);
    &:hover {
      color: #000;
    }
  }
  .suggest-item {
    color: #333;
    .type-name {
      font-size: 1.2em;
      font-weight: bold;
      height: 40px;
      display: flex;
      align-items: center;
      background-color: rgba($color: #000000, $alpha: 0.05);
      .icon {
        margin: 0 3px;
        width: 24px;
        height: 24px;
      }
    }
    .suggest-type-item {
      padding: 5px 0 5px 30px;
      line-height: calc(1.5em + 10px);
      cursor: pointer;
      transition: var(--animationTime);
      .alias {
        color: #999;
      }
    }
  }
}
</style>