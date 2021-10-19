<template>
  <div class="recommend-mv">
    <MvGroup
      :title="title"
      :dataList="dataList"
      :dataListLength="dataListLength"
      :loading="loading"
    />
  </div>
</template>

<script>
import MvGroup from '@/components/MvGroup'

export default {
  name: 'recommendMv',
  components: {
    MvGroup
  },
  data() {
    return {
      title: '推荐MV',
      loading: true,
      dataList: undefined,
      dataListLength: 4
    };
  },
  methods: {
    getData() {
      this.loading = true
      this.$api.personalized.mv().then(res => {
        if(res.code == 200) {
          this.dataList = res.result
          this.loading = false
        }
      })
    }
  },
  created() {
    this.getData()
  }
};
</script>

<style scoped lang="scss">
.recommend-mv {
  margin-top: 20px;
  overflow: hidden;
}
</style>