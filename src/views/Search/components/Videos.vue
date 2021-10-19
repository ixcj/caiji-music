<template>
  <div class="search-list">
    <div
      class="search-list-item"
      v-for="item in dataList"
      :key="item.vid"
    >{{ item.title }}</div>
  </div>
</template>

<script>
export default {
  name: 'SearchList',
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
.search-list {
  &-item {
    height: 40px;
  }
}
</style>