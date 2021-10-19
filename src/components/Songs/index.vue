<template>
  <VirtualList
    class="songs"
    ref="VirtualList"
    :estimate-size="estimateSize"
    :data-key="'id'"
    :data-sources="dataList"
    :data-component="SongsItem"
    :page-mode="true"
  />
</template>

<script>
import VirtualList from 'vue-virtual-scroll-list'
import SongsItem from './components/SongsItem.vue'

export default {
  name: 'Songs',
  components: {
    VirtualList
  },
  props: {
    dataList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      SongsItem,
      estimateSize: 70
    };
  },
  methods: {
    updatePageModeFront() {
      this.$nextTick(() => {
        this.$refs.VirtualList.updatePageModeFront()
      })
    }
  }
};
</script>

<style scoped lang="scss">
.songs {
  padding-left: 0;
  background-color: #fff;
  border: 1px solid #f1f1f1;
  border-bottom: none;
}

.pointer {
  cursor: pointer;
}
</style>