<template>
  <div class="Home">
    <Carrousel />
    <RecommendSongLIst />
    <NewMusic />
    <RecommendMv />
  </div>
</template>

<script>
import Carrousel from './components/Carrousel'
import RecommendSongLIst from './components/RecommendSongLIst'
import NewMusic from './components/NewMusic'
import RecommendMv from './components/RecommendMv'

export default {
  name: 'Home',
  components: {
    Carrousel,
    RecommendSongLIst,
    NewMusic,
    RecommendMv
  },
  data() {
    return {
    }
  },
  methods: {},
};
</script>

<style scoped lang="scss">
</style>