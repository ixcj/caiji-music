<template>
  <div
    class="search elevation-6"
    :class="{ mobile: $vuetify.breakpoint.mobile, active, pointer: !active }"
    @click="handleSearchbox"
    v-click-outside="onClickOutside"
  >
    <input
      class="search-input"
      type="text"
      ref="searchInput"
      v-model="keyword"
      :placeholder="defaultKeyword.showKeyword"
      @input="handleSearchbox"
      @keyup.enter="search"
    >
    <div class="search-icon-box" @click="handleSearchBut">
      <v-icon :color="active ? $store.getters.mainColor : ''">mdi-magnify</v-icon>
    </div>
    <transition name="slide-y-transition">
      <SearchExpand
        class="expand"
        id="searchExpand"
        v-show="showExpand"
        :keyword="keyword"
        @close="onClickOutside"
        @search="searchHistoryClick"
      />
    </transition>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import SearchExpand from './components/SearchExpand'

export default {
  name: 'LayoutSearch',
  components: {
    SearchExpand
  },
  data() {
    return {
      keyword: '', // 搜索关键词
      defaultKeyword: {
        showKeyword: ''
      }, // 默认关键词
      active: false, // 焦点是否在组件内
      showExpand: false, // 是否显示搜索拓展
      showExpandTimer: 0, // 搜索拓展定时器
    };
  },
  methods: {
    ...mapMutations('history', [
      'addSearchHistory'
    ]),
    search() {
      let toParam = {
          name: 'Search',
          params: {
            keyword: this.keyword || this.defaultKeyword.realkeyword
          }
        }
      this.addSearchHistory(toParam.params.keyword)
      this.$refs.searchInput.blur()
      this.onClickOutside()
      this.$router.push(toParam)
    },
    // 搜索历史被点击
    searchHistoryClick(keyword) {
      this.keyword = keyword
      this.search()
    },
    // 点击搜索按钮
    handleSearchBut() {
      if (this.active) {
        this.search()
      }
    },
    // 点击组件（获取焦点）
    handleSearchbox() {
      if (this.active) {
        return
      }
      if (this.$vuetify.breakpoint.mobile) {
        this.$refs.searchInput.focus()
      }
      this.active = true
      this.showExpandTimer = setTimeout(() => {
        this.showExpand = true
      }, this.$store.getters.animationTime)
    },
    // 点击组件外的元素（失去焦点）
    onClickOutside() {
      this.showExpand = false
      clearTimeout(this.showExpandTimer)
      setTimeout(() => {
        this.active = false
        if (this.$vuetify.breakpoint.mobile) {
          this.keyword = ''
        }
      }, this.$store.getters.animationTime)
    }
  },
  created() {
    this.$api.search.default().then(res => {
      this.defaultKeyword = res.data
    })
  },
  watch: {
    '$route.name'() {
      this.onClickOutside()
    },
    showExpand(val) {
      this.$lock(val, true)
    }
  }
};
</script>

<style scoped lang="scss">
.search {
  transition: var(--animationTime);
  position: absolute;
  right: 12px;
  background-color: #fff;
  border-radius: 40px;
  border-radius: 40px;
  height: 40px;
  width: 200px;
  z-index: 99;
  padding: 0 40px 0 15px;
  box-sizing: border-box;
  &.pointer {
    cursor: pointer;
    .search-input {
      cursor: pointer;
    }
  }
  &.active {
      width: 375px;
    }
  &.mobile {
    width: 40px;
    padding: 0 40px 0 0;
    &.active {
      width: calc(100% - 24px);
      padding: 0 40px 0 15px;
    }
  }
  .search-input {
    background: none;  
    outline: none;  
    border: none;
    height: 100%;
    width: 100%;
  }
  .search-icon-box {
    cursor: pointer;
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>