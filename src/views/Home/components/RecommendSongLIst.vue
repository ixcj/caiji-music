<template>
  <div class="recommend-song-list">
    <SongListGroup
      :title="title"
      :dataList="dataList"
      :dataLIstLength="limit"
      :loading="loading"
    />
  </div>
</template>

<script>
import SongListGroup from '@/components/SongListGroup'

export default {
  name: 'recommendSongList',
  components: {
    SongListGroup
  },
  data() {
    return {
      title: '推荐歌单',
      loading: true,
      dataList: undefined,
      limit: 9
    };
  },
  methods: {
    getData() {
      this.loading = true
      this.$api.personalized.songlist({
        limit: this.limit
      }).then(res => {
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
.recommend-song-list {
  margin-top: 20px;
  overflow: hidden;
}
</style>