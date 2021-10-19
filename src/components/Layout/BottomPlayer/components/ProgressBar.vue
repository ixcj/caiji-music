<template>
  <div class="progress-bar" :class="{ 'full-Player-progress-bar': fullPlayer }" v-show="Boolean(endTime) || !isNaN(endTime)">
    <span class="time-label" v-if="fullPlayer">{{currentTime | timestampToMinute}}</span>
    <v-slider
      :value="currentTime"
      :min="0"
      :max="endTime"
      :color="fullPlayer ? '#ffffff' : $store.getters.mainColor"
      :track-color="fullPlayer ? '#ffffff' : $store.getters.mainColor"
      :key="$vuetify.breakpoint.mobile"
      @input="inputPlayTime"
      @touchstart.native="mousedown"
      @mousedown="mousedown"
      @mouseup="mouseup"
    >
      <template v-if="!fullPlayer && $vuetify.breakpoint.mobile" v-slot:thumb-label="{ value }">
        {{ value | timestampToMinute }}
      </template>
    </v-slider>
    <span class="time-label" v-if="fullPlayer">{{endTime | timestampToMinute}}</span>
  </div>
</template>

<script>
export default {
  name: 'ProgressBar',
  props: {
    fullPlayer: {
      type: Boolean,
      default: false
    },
    currentTime: {
      type: Number,
      default: 0
    },
    endTime: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {};
  },
  methods: {
    inputPlayTime(val) {
      clearTimeout(this.timer)
      this.$emit('update:currentTime', val)
    },
    mousedown() {
      this.$emit('noUpdateCurrentTime')
    },
    mouseup() {
      setTimeout(() => {
        this.$emit('setCurrentTime', this.currentTime)
      }, 0)
    }
  },
};
</script>

<style scoped lang="scss">
.progress-bar {
  height: 24px;
  z-index: 9;
  &.full-Player-progress-bar {
    display: flex;
  }
  .time-label {
    font-size: 14px;
    margin: 0 8px;
    display: flex;
    align-items: center;
  }
  ::v-deep .v-slider__track-background {
    opacity: .25 !important;
  }
  ::v-deep .v-slider--horizontal {
    margin: 0;
    min-height: 24px;
  }
  ::v-deep .v-input__control {
    height: 24px;
    .v-input__slot {
      margin: 0;
    }
  }
}
</style>