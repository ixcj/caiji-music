<template>
  <v-sheet
    class="LogoBox rounded-circle animation-time"
    :color="$store.getters.mainColor"
    :width="logoSize"
    :height="logoSize"
  >
    <img class="logo-bg" draggable="false" :src="logoBg" alt="logo">
    <svg class="logo-icon text-animation-time" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 118 118">
      <ellipse cx="46.797" cy="87.234" rx="16.797" ry="16.766"/>
      <path d="M57,18h7V77.744C64,95.476,57,98,57,98V18Z"/>
      <path d="M56.8,13L88,15.753V29.747L56.8,26.994V13Z"/>
    </svg>
  </v-sheet>
</template>

<script>
export default {
  name: 'LogoBox',
  props: {
    size: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      logoBg: require('@/assets/images/logo-bg.png')
    };
  },
  methods: {},
  computed: {
    logoSize() {
      const logoSize = this.size
        ? this.size
        : this.$vuetify.breakpoint.smAndDown ? 40 : 48
      return logoSize
    }
  }
};
</script>

<style scoped lang="scss">
.LogoBox {
  overflow: hidden;
  position: relative;
  box-sizing: content-box;
  .logo-bg {
    width: 100%;
    height: 100%;
    mix-blend-mode: hard-light;
    position: relative;
    z-index: 1;
  }
  .logo-icon {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    fill: currentColor;
    color: var(--textColor);
  }
}
</style>