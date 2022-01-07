<template>
  <div class="set-theme">
    <h1 style="margin-bottom: 10px">主题设置</h1>

    <h2 class="block-title">主题色：</h2>
    <div class="theme-item-box">
      默认：
      <i
        class="theme-item elevation-3"
        :style="{ backgroundColor: defaultTheme.mainColor }"
        @click.stop="setMainColor(defaultTheme.mainColor)"
      ></i>
      自定义：
      <v-menu
        offset-y
        :close-on-content-click="false"
        transition="slide-y-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <i
            v-bind="attrs"
            v-on="on"
            class="theme-item elevation-3"
            :style="{ backgroundColor: mainColor }"
          ></i>
        </template>
        <v-color-picker
          class="pick-color"
          mode="hexa"
          v-model="mainColor"
          show-swatches
          :swatches="mainColors"
          @input="setMainColor(mainColor)"
        ></v-color-picker>
      </v-menu>
    </div>

    <h2 class="block-title">前景色：</h2>
    <div class="theme-item-box">
      自动：
      <v-switch
        style="margin-top: 0; height: 40px"
        :color="textColor"
        :background-color="mainColor"
        v-model="autoTextColor"
        @change="autoTextColorChange"
      ></v-switch>
      自定义：
      <i
        class="theme-item elevation-3"
        :style="{ backgroundColor: '#fff' }"
        @click.stop="setText('#ffffff')"
      ></i>
      <i
        class="theme-item elevation-3"
        :style="{ backgroundColor: '#333' }"
        @click.stop="setText('#333333')"
      ></i>
    </div>

    <h2 class="block-title">背景色：</h2>
    <div class="theme-item-box">
      默认：
      <i
        class="theme-item elevation-3"
        :style="{ backgroundColor: defaultTheme.bgColor }"
        @click.stop="setBgColor(defaultTheme.bgColor)"
      ></i>
      自定义：
      <v-menu
        offset-y
        :close-on-content-click="false"
        transition="slide-y-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <i
            v-bind="attrs"
            v-on="on"
            class="theme-item elevation-3"
            :style="{ backgroundColor: bgColor }"
          ></i>
        </template>
        <v-color-picker
          class="pick-color"
          mode="hexa"
          v-model="bgColor"
          show-swatches
          :swatches="bgColors"
          @input="setBgColor(bgColor)"
        ></v-color-picker>
      </v-menu>
    </div>

    <h2 class="block-title">封面动效：</h2>
    <div class="theme-item-box" style="display: block;">
      <v-select
        class="dynamic-effect-select"
        :items="dynamicEffectOptions"
        :value="$store.getters.dynamicEffect"
        label="选择封面动效"
        solo
        @change="setDynamicEffect"
      ></v-select>
      <div class="show-dynamic-effect">
        <div class="circle">动效展示布</div>
        <canvas class="setting-dynamic-effect" id="setting-dynamic-effect-canvas"></canvas>
      </div>
    </div>

    <h2 class="block-title">页面动画：</h2>
    <div class="theme-item-box" style="display: block;">
      <v-radio-group :value="pageAnimation" @change="setPageAnimation">
        <v-row>
          <v-col
            cols="auto"
            v-for="item in pageAnimationOptions"
            :key="item.value"
          >
            <v-radio
              :label="item.text"
              :value="item.value"
              @click="randomKey"
            ></v-radio>
          </v-col>
        </v-row>
      </v-radio-group>
      <transition :name="pageAnimation" mode="out-in">
        <div class="show-page-animation" :key="pageAnimationKey">页面动画展示布</div>
      </transition>
    </div>

    <h2 class="block-title">动画速度：</h2>
    <div class="theme-item-box">
      <v-slider
        thumb-label
        step="50"
        min="0"
        max="1000"
        :color="mainColor"
        :track-color="mainColor"
        :value="animationTime"
        :label="animationTime + 'ms'"
        @input="setAnimation"
      ></v-slider>
    </div>
  </div>
</template>

<script>
import { theme } from '@/config'
import { mapMutations } from 'vuex'
import { random } from '@/utils/random'
import dynamicEffect, { options } from '@/utils/dynamicEffect'

export default {
  name: 'SetTheme',
  data() {
    return {
      dynamicEffectOptions: options,
      defaultTheme: theme,
      show: false,
      mainColor: this.$store.getters.mainColor,
      textColor: this.$store.getters.textColor,
      autoTextColor: this.$store.getters.autoTextColor,
      bgColor: this.$store.getters.bgColor,
      animationTime: this.$store.getters.animationTime.toString(),
      scene: null,
      canvas: null,
      setAnimationTimeTimer: 0,
      pageAnimationKey: null,
      pageAnimationOptions: [
        {
          text: 'X 轴滚动1',
          value: 'scroll-x-transition'
        },
        {
          text: 'X 轴滑动2',
          value: 'slide-x-reverse-transition'
        },
        {
          text: '淡入淡出',
          value: 'fade-transition'
        }
      ],

      mainColors: [
        ['#dd001b', '#f52443', '#ff441a'],
        ['#349e69', '#02b340', '#31c27c'],
        ['#0b2d64', '#1f4f89', '#2c80c5'],
        ['#353535', '#666666', '#8a8a8a']
      ],
      textColors: [
        ['#ffffff', '#f8f8f8', '#efefef'],
        ['#e8e8e8', '#dfdfdf', '#d8d8d8'],
        ['#a0a0a0', '#888888', '#6f6f6f'],
        ['#555555', '#3f3f3f', '#333333']
      ],
      bgColors: [
        ['#ffffff', '#fcfcfc', '#f9f9f9'],
        ['#f6f6f6', '#f3f3f3', '#f0f0f0'],
        ['#ececec', '#e9e9e9', '#e6e6e6'],
      ]
    };
  },
  watch: {
    '$store.getters.mainColor'(val) {
      this.mainColor = val
    },
    '$store.getters.textColor'(val) {
      this.textColor = val
    },
    '$store.getters.autoTextColor'(val) {
      this.autoTextColor = val
    },
    '$store.getters.bgColor'(val) {
      this.bgColor = val
    },
    '$store.getters.dynamicEffect'(val) {
      this.run()
    },
    '$route.query.showFullPlayer'(val) {
      if(val) {
        if(this.scene?.stop) {
          this.scene.stop()
        }
      } else {
        if(this.scene?.run) {
          this.scene.run()
        }
      }
    }
  },
  methods: {
    ...mapMutations('setting', [
      'setMainColor',
      'setTextColor',
      'setAutoTextColor',
      'setBgColor',
      'setAnimationTime',
      'setPageAnimation',
      'setDynamicEffect'
    ]),
    setText(val) {
      this.setAutoTextColor(false)
      this.setTextColor(val)
    },
    setAnimation(n) {
      this.animationTime = n
      clearTimeout(this.setAnimationTimeTimer)
      this.setAnimationTimeTimer = setTimeout(() => {
        this.setAnimationTime(n)
      }, 300)
    },
    autoTextColorChange(val) {
      this.setAutoTextColor(val)
      if(val) {
        this.setMainColor(this.mainColor)
      } else {
        this.setTextColor(this.textColor)
      }
    },
    randomKey() {
      const key = random()
      if(key == this.pageAnimationKey) {
        this.randomKey()
      } else {
        this.pageAnimationKey = key
      }
    },
    run() {
      this.$nextTick(() => {
        if(this.scene?.stop) {
          this.scene.stop()
        }

        this.canvas.widt = this.canvas.height = 300
        this.scene = new dynamicEffect[this.$store.getters.dynamicEffect](this.canvas)

        if(this.scene?.run) {
          this.scene.run()
        }
      })
    },
  },
  computed: {
    pageAnimation() {
      return this.$store.getters.pageAnimation
    }
  },
  mounted() {
    this.canvas = document.getElementById('setting-dynamic-effect-canvas');
    this.run()
  },
  activated() {
    if(this.scene?.run) {
      this.scene.run()
    }
  },
  deactivated() {
    if(this.scene?.stop) {
      this.scene.stop()
    }
  }
};
</script>

<style scoped lang="scss">
.set-theme {
  .title {
    display: block;
    font-size: 28px;
  }
  .block-title {
    margin-top: 15px;
  }
  .theme-item-box {
    display: flex;
    align-items: flex-start;
    font-size: 20px;
    max-width: 450px;
    .theme-item {
      display: inline-block;
      width: 40px;
      height: 40px;
      cursor: pointer;
      margin: 0 3px 3px 0;
      vertical-align: text-bottom;
    }
  }
  .dynamic-effect-select {
    margin: 10px 0;
  }
  .pick-color {
    position: absolute;
    right: calc(100% - 160px);
    top: 45px;
  }
  .d-flex {
    position: relative;
  }

  .show-dynamic-effect {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 300px;
    height: 300px;
    background-color: rgba(0, 0, 0, 0.6);
    position: relative;
    &::after {
      content: "";
      border: #fff 1px solid;
      position: absolute;
      z-index: 0;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 55%;
      height: 55%;
      border-radius: 50%;
    }
    .circle {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 50%;
      height: 50%;
      border-radius: 50%;
      background-color: #ccc;
      position: relative;
      z-index: 2;
    }
    .setting-dynamic-effect {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 1;
    }
  }
  .show-page-animation {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    width: 300px;
    height: 200px;
    background-color: rgba(0, 0, 0, 0.6);
    color: #fff;
  }

  ::v-deep .v-slider__track-background {
    opacity: .35 !important;
  }
  ::v-deep .v-select {
    .v-text-field__details {
      display: none;
    }
  }
  ::v-deep .v-input--selection-controls {
    margin-top: 0;
    .v-messages {
      display: none;
    }
  }
}
</style>