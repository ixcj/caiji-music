<template>
  <transition name="scale-transition">
    <div class="play-type" v-if="fullPlayer || !$vuetify.breakpoint.mobile">
      <v-tooltip v-model="showTooltip" top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            fab
            small
            class="play-type-but"
            :class="{ 'mx-4': !fullPlayer }"
            :color="fullPlayer ? 'rgba(255, 255, 255, 0.1)' : $store.getters.mainColor"
            v-bind="attrs"
            v-on="on"
            @click="handlePlayType"
          >
            <v-icon dark>{{ playTypeList[playType].icon }}</v-icon>
          </v-btn>
        </template>
        {{ playTypeList[playType].text }}
      </v-tooltip>
    </div>
  </transition>
</template>

<script>
import { isTouchDevice } from '@/utils'
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'PlayType',
  props: {
    fullPlayer: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showTooltip: false,
      showTooltipTimer: null,
      playTypeList: {
        'orderPlay': {
          text: '顺序播放',
          icon: 'mdi-repeat'
        },
        'singleCycle': {
          text: '单曲循环',
          icon: 'mdi-repeat-once'

        },
        'shufflePlay': {
          text: '随机播放',
          icon: 'mdi-shuffle'
        },
      }
    };
  },
  methods: {
    ...mapMutations('setting', [
      'setPlayType'
    ]),
    handlePlayType() {
      if(this.showTooltip == false) {
        this.showTooltip = true
      }

      const typeArr = Object.keys(this.playTypeList)
      const index = typeArr.indexOf(this.playType)
      if(index < typeArr.length - 1) {
        this.setPlayType(typeArr[index + 1])
      } else {
        this.setPlayType(typeArr[0])
      }
    },
    resetTimer(show) {
      clearTimeout(this.showTooltipTimer)
      this.showTooltipTimer = setTimeout(() => {
        this.showTooltip = show
      }, 3000);
    }
  },
  computed: {
    ...mapState('setting', [
      'playType'
    ])
  },
  watch: {
    showTooltip(val) {
      if(val && isTouchDevice) {
        this.resetTimer(false)
      }
    },
    playType() {
      this.resetTimer(false)
    }
  }
};
</script>

<style scoped lang="scss">
.play-type {
  &-but {
    transition: var(--animationTime);
    color: var(--textColor);
  }
}
</style>
