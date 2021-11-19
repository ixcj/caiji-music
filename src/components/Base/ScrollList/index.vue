<template>
  <div class="scroll-list" v-scroll="onScroll">
    <slot></slot>
    <transition name="slide-y-reverse-transition" mode="out-in">
      <div class="hint">
        <v-progress-circular
          :size="30"
          :width="3"
          :color="$store.getters.mainColor"
          indeterminate
          v-show="!finished || loading"
        ></v-progress-circular>
        <span class="text">{{ !finished || loading ? loadingText : finishedText }}</span>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'ScrollList',
  props: {
    // 目标元素，默认为根元素
    target: {
      type: Element,
      default: () => {
        return document.documentElement
      }
    },
    // 防抖间隔
    wait: {
      type: Number,
      default: 150
    },
    // 是否加载
    loading: {
      type: Boolean,
      default: false
    },
    // 数据是否全部加载完成
    finished: {
      type: Boolean,
      default: false
    },
    // 偏移量
    offset: {
      type: Number,
      default: 70
    },
    // 加载文字
    loadingText: {
      type: String,
      default: '加载中...'
    },
    // 加载完成文字
    finishedText: {
      type: String,
      default: '没有更多了'
    },
    // 是否在初始化时立即执行滚动位置检查
    immediateCheck: {
      type: Boolean,
      default: true
    },
    // 禁用滚动到底事件
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      onScrollTimer: null
    };
  },
  methods: {
    isBottom() {
      const target = this.target
      return (target.scrollHeight - target.scrollTop) < (target.clientHeight + this.offset)
    },
    onScroll() {
      if(this.finished || this.disabled) return

      clearTimeout(this.onScrollTimer)
      this.onScrollTimer = setTimeout(() => {
        this.isBottom() && !this.loading && this.$emit('load')
      }, this.wait)
    },
  },
  mounted() {
    this.immediateCheck && this.onScroll()
  }
};
</script>

<style scoped lang="scss">
.scroll-list {
  padding-bottom: calc(2rem + 12px);
  position: relative;

  .hint {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    text-align: center;
    .text {
      display: inline-block;
      height: 2rem;
      line-height: 2rem;
      font-size: 1rem;
      margin-left: .8rem;
    }
  }
}
</style>