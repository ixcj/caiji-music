<template>
  <v-snackbar
    class="message"
    v-model="message.isShow"
    :color="message.color"
    :timeout="message.timeout"
    :key="key"
  >
    {{message.content}}

    <template v-slot:action="{ attrs }">
      <v-btn
        v-bind="attrs"
        fab
        dark
        small
        color="rgba(255,255,255,.15)"
        @click="close"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { random } from '@/utils/random'

export default {
  name: 'message',
  data() {
    return {
      key: 0
    };
  },
  computed: {
    message() {
      this.key = random()
      return this.$store.getters.message
    }
  },
  methods: {
    close() {
      this.message.isShow = false
    }
  },
};
</script>

<style scoped lang="scss">
.message {
}
</style>