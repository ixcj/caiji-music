<template>
  <div class="new-music">
    <SongGroup
      :title="title"
      :line="line"
      :dataListLength="dataListLength"
      :dataList="dataList"
      :loading="loading"
    />
  </div>
</template>

<script>
import SongGroup from '@/components/SongGroup'

export default {
  name: 'NewMusic',
  components: {
    SongGroup
  },
  data() {
    return {
      title: '最新音乐',
      loading: true,
      dataList: undefined,
      line: 4,
      dataListLength: 12
    };
  },
  methods: {
    getData() {
      this.loading = true
      this.$api.personalized.newSong({
        limit: this.dataListLength
      }).then(res => {
        if(res.code == 200) {
          this.dataList = res.result.map(item => item.song)
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
.new-music {
  margin-top: 20px;
  overflow: hidden;
}
</style>