<template>
  <transition name="new-version-box-transition" mode="out-in">
    <div class="new-version-box" v-if="show">
      <div class="new-version-box-title">新内容已准备就绪，请<span @click="refresh">刷新</span></div>
      <v-icon @click="show = false">mdi-close</v-icon>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'NewVersionBox',
  data() {
    return {
      show: false,
      worker: null
    };
  },
  methods: {
    newVersionLoad(registration) {
      this.worker = registration.waiting
      this.show = true
    },
    refresh() {
      if (!this.worker)
        return;
      const channel = new MessageChannel()
      this.worker.postMessage({ type: 'SKIP_WAITING' }, [channel.port2])

      location.reload(true)
    }
  },
  created() {
    window.newVersionLoad = this.newVersionLoad
  }
};
</script>

<style scoped lang="scss">
.new-version-box {
  user-select: none;
  position: fixed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  bottom: 30px;
  right: 15px;
  width: 300px;
  height: 50px;
  background-color: #fff;
  box-shadow: 0 5px 15px #999;
  border-radius: 10px;
  padding: 0 20px;
  box-sizing: border-box;
  transition: var(--animationTime);
  z-index: 999;
  .new-version-box-title {
    font-size: 1rem;
    span {
      padding: 0 3px;
      color: #1e88e5;
      cursor: pointer;
    }
  }
}

.new-version-box-transition-enter-active, .new-version-box-transition-leave-active {
  transform: translateX(0);
}
.new-version-box-transition-enter, .new-version-box-transition-leave-to {
  transform: translateX(calc(100% + 40px));
}
</style>