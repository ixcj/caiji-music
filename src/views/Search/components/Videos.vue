<template>
  <div class="videos-list">
    <div
      class="videos-list-item"
      v-for="item in dataList"
      :key="item.vid"
    >{{ item.title }}</div>
  </div>
</template>

<script>
export default {
  name: 'VideosList',
  props: {
    dataList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped lang="scss">
.videos-list {
  &-item {
    height: 40px;
  }
}
</style>