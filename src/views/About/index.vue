<template>
  <div class="About">
    <div class="content">
      <LogoBox :size="100" />
      <h1>菜鸡音乐</h1>
      <p>菜鸡音乐一款在线音乐应用，提供歌曲搜索、免费歌曲在线试听、MV播放等功能。</p>
      <p><a class="url" v-for="item in aboutUrls" :href="item.value" target="_blank">{{ item.text }}</a></p>
    </div>
    <p class="tips">该项目仅用于交流学习，不提供下载、VIP解析等功能</p>
  </div>
</template>

<script>
  import { aboutUrls } from '@/config'
  import LogoBox from '@/components/Layout/LogoBox'

  export default {
    name: 'About',
    components: {
      LogoBox
    },
    data() {
      return {
        aboutUrls,
      };
    },
    methods: {},
  };
</script>

<style scoped lang="scss">
  .About {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .content {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-bottom: 35%;
      text-align: center;
      h1 {
        margin: 10px 0;
      }
      .url {
        margin-right: 5px;
        &:last-child {
          margin-right: 0;
        }
      }
    }
    .tips {
      position: absolute;
      bottom: 0;
      width: 100%;
      font-size: 0.8rem;
      color: #999;
      text-align: center;
    }
  }
</style>