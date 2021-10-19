<template>
  <div class="setting">
    <SetTheme />
  </div>
</template>

<script>
import SetTheme from './components/SetTheme'

export default {
  name: 'Setting',
  components: {
    SetTheme
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped lang="scss">
.setting {
}
</style>