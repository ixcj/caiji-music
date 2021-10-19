<template>
  <transition name="fade-transition" mode="out-in">
    <router-view />
  </transition>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    //
  })
};
</script>
