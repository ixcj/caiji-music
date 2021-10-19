<template>
  <div class="search-results">
    <div class="top">
      <span class="keyword">{{ keywords }}</span>
      <span class="count" v-show="page !== 1 || !loading">找到{{ count }}个结果</span>
    </div>
    <ul class="tabs">
      <li
        class="tab"
        :class="{ active: type === item.code }"
        v-for="item in types"
        :key="item.code"
        @click="switchType(item.code)"
      >{{ item.text }}</li>
    </ul>
    <ScrollList
      class="search-results-list"
      ref="ScrollList"
      :loading="loading"
      :finished="finished"
      :offset="200"
      :disabled="$route.name !== 'Search'"
      @load="getData"
    >
      <component :is="currentComponent" :data-list="dataList"></component>
    </ScrollList>
  </div>
</template>

<script>
import ScrollList from '@/components/Base/ScrollList'
import Songs from '@/components/Songs'
import Albums from './components/Albums'
import Artists from './components/Artists'
import Playlists from './components/Playlists'
import Videos from './components/Videos'

const types = [
  {
    text: '单曲',
    code: 1
  },
  {
    text: '歌手',
    code: 100
  },
  {
    text: '专辑',
    code: 10
  },
  {
    text: '视频',
    code: 1014
  },
  {
    text: '歌单',
    code: 1000
  }
]

export default {
  name: 'Search',
  components: {
    ScrollList,
    Songs,
    Albums,
    Artists,
    Playlists,
    Videos
  },
  data() {
    return {
      types,
      loading: false,
      count: 0,
      type: 1,
      limit: 30,
      page: 1,
      keywords: '',
      dataList: []
    };
  },
  methods: {
    getData(isRefresh = false) {
      this.loading = true

      if(isRefresh) {
        this.page = 1
        this.dataList = []
      }

      const { type, keywords, limit, offset } = this

      this.$api.search.search({
        type,
        limit,
        offset,
        keywords
      }).then(res => {
        if(this.type !== type) return

        this.page++
        const data = res.result
        
        switch(type) {
          case 1:
            this.count = data.songCount
            this.dataList.push(...data.songs)
            break
          case 10:
            this.count = data.albumCount
            this.dataList.push(...data.albums)
            break
          case 100:
            this.count = data.artistCount
            this.dataList.push(...data.artists)
            break
          case 1000:
            this.count = data.playlistCount
            this.dataList.push(...data.playlists)
            break
          case 1014:
            this.count = data.videoCount
            this.dataList.push(...data.videos)
            break
        }
      }).finally(() => {
        if(this.type !== type) return

        this.loading = false

        if(!this.finished) {
          const isBottom = this.$refs.ScrollList.isBottom()
          isBottom && this.getData()
        }
      })
    },
    switchType(type) {
      if(type === this.type) {
        if(this.$vuetify.breakpoint.mobile) {
            this.$vuetify.goTo(0, {
            duration: this.$store.getters.animationTime,
            offset: 0,
            easing: 'easeInOutCubic',
          })
        }
      } else {
        this.type = type
        this.count = 0
        this.getData(true)
      }
    },
  },
  computed: {
    // keywords() {
    //   return this.$route.params.keyword
    // },
    offset() {
      return this.limit * (this.page - 1)
    },
    finished() {
      return this.dataList.length >= this.count
    },
    currentComponent() {
      return {
        1: 'Songs',
        10: 'Albums',
        100: 'Artists',
        1000: 'Playlists',
        1014: 'Videos',
      }[this.type]
    }
  },
  watch: {
    '$route.params.keyword'(val) {
      if(val) {
        this.keywords = val
      }
    },
    keywords(val) {
      if(val) {
        this.getData(true)
      }
    }
  },
  created() {
    this.keywords = this.$route.params.keyword
  }
};
</script>

<style scoped lang="scss">
.search-results {
  position: relative;
  .top {
    margin-bottom: .5rem;
    .keyword {
      display: inline-block;
      margin-right: 5px;
      font-size: 2rem;
      font-weight: 700;
    }
    .count {
      font-size: 1rem;
    }
  }
  .tabs {
    padding: 5px 0;
    list-style-type: none;
    display: flex;
    justify-content: space-between;
    width: 400px;
    max-width: 100%;
    background-color: var(--bgColor);
    .mobile & {
      position: sticky;
      top: 56px;
      z-index: 1;
      width: 100%;
    }
    .tab {
      position: relative;
      cursor: pointer;
      padding-bottom: .3rem;
      &::after {
        content: '';
        position: absolute;
        top: -20%; bottom: -20%;
        left: -30%; right: -30%;
      }
      &.active {
        color: var(--mainColor);
        font-weight: bold;
        &::before {
          content: '';
          display: block;
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          height: 3px;
          width: 80%;
          background-color: var(--mainColor);
          border-radius: 6px;
        }
      }
    }
  }

  &-list {
    overflow: hidden;
  }
}
</style>