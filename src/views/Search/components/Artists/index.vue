<template>
  <VirtualList
    class="Artists"
    ref="VirtualList"
    :estimate-size="estimateSize"
    :data-key="'id'"
    :data-sources="dataList"
    :data-component="ArtistsItem"
    :page-mode="true"
  />
</template>

<script>
import VirtualList from 'vue-virtual-scroll-list'
import ArtistsItem from './components/ArtistsItem.vue'

export default {
  name: 'Artists',
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
      ArtistsItem,
      estimateSize: 100
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
.Artists {
  padding-left: 0;
  background-color: #fff;
  border: 1px solid #f1f1f1;
  border-bottom: none;
}
</style>