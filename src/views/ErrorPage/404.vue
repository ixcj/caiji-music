<template>
  <div class="not-found">
    <v-responsive :aspect-ratio="38 / 50" class="not-found-svg-box">
      <svg
        width="100%"
        viewBox="0 0 837 1060"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"
      >
        <g
          id="Page-1"
          stroke="none"
          stroke-width="1"
          fill="none"
          fill-rule="evenodd"
          sketch:type="MSPage"
        >
          <path
            d="M353,9 L626.664028,170 L626.664028,487 L353,642 L79.3359724,487 L79.3359724,170 L353,9 Z"
            id="Polygon-1"
            stroke="#007FB2"
            stroke-width="6"
            sketch:type="MSShapeGroup"
          ></path>
          <path
            d="M78.5,529 L147,569.186414 L147,648.311216 L78.5,687 L10,648.311216 L10,569.186414 L78.5,529 Z"
            id="Polygon-2"
            stroke="#EF4A5B"
            stroke-width="6"
            sketch:type="MSShapeGroup"
          ></path>
          <path
            d="M773,186 L827,217.538705 L827,279.636651 L773,310 L719,279.636651 L719,217.538705 L773,186 Z"
            id="Polygon-3"
            stroke="#795D9C"
            stroke-width="6"
            sketch:type="MSShapeGroup"
          ></path>
          <path
            d="M639,529 L773,607.846761 L773,763.091627 L639,839 L505,763.091627 L505,607.846761 L639,529 Z"
            id="Polygon-4"
            stroke="#F2773F"
            stroke-width="6"
            sketch:type="MSShapeGroup"
          ></path>
          <path
            d="M281,801 L383,861.025276 L383,979.21169 L281,1037 L179,979.21169 L179,861.025276 L281,801 Z"
            id="Polygon-5"
            stroke="#36B455"
            stroke-width="6"
            sketch:type="MSShapeGroup"
          ></path>
        </g>
      </svg>
    </v-responsive>
    <div
      class="text"
      :class="$vuetify.breakpoint.mdAndDown && 'abs'"
    >
      <p class="t404">404</p>
      <p>找不到页面</p>
      <div class="but-box">
        <div @click.stop="back" :class="$store.getters.historyArr.length <= 1 ? 'disabled' : ''" class="but blue">返回上页</div>
        <div @click.stop="goHome()" class="but red">返回首页</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "not-found",
  data() {
    return {};
  },
  methods: {
    back() {
      if(this.$store.getters.historyArr.length > 1) {
        this.$router.back()
      }
    },
    goHome() {
      this.$store.commit('setHistoryArr', [])
      this.$router.replace('/')
    }
  }
};
</script>

<style scoped lang="scss">
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 32px;
  &-svg-box {
    width: 100%;
    max-width: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 0;
    }
  }
  .text {
    position: relative;
    z-index: 1;
    font-weight: bold;
    &.abs {
      position: absolute;
      text-align: center;
    }
    p {
      font-size: 1.2em;
      margin: 0;
      &.t404 {
        font-size: 2.4em;
      }
    }
    justify-content: space-between;
    .but-box {
      display: flex;
      justify-content: space-between;
      margin-top: 15px;
      font-size: .5em;
      .but {
        font-size: 1.1em;
        font-weight: 400;
        padding: 3px 10px;
        border-radius: 99px;
        border: 1px solid #999;
        background-color: rgba($color: #000, $alpha: .03);
        backdrop-filter: blur(3px);
        transition: var(--animationTime);
        cursor: pointer;
        &.blue {
          background-color: rgba($color: #2196F3, $alpha: .2) !important;
        }
        &.red {
          background-color: rgba($color: #F44336, $alpha: .2) !important;
        }
        &:hover,
        &:active {
          background-color: rgba($color: #fff, $alpha: .2) !important;
        }
        &.disabled {
          border-color: #ccc !important;
          background-color: rgba($color: #ccc, $alpha: .2) !important;
          cursor: not-allowed;
        }
      }
    }
  }

  #Polygon-1,
  #Polygon-2,
  #Polygon-3,
  #Polygon-4,
  #Polygon-4,
  #Polygon-5 {
    -webkit-animation: float 1s infinite ease-in-out alternate;
    animation: float 1s infinite ease-in-out alternate;
  }
  #Polygon-2 {
    animation-delay: 0.2s;
  }
  #Polygon-3 {
    animation-delay: 0.4s;
  }
  #Polygon-4 {
    animation-delay: 0.6s;
  }
  #Polygon-5 {
    animation-delay: 0.8s;
  }
  @keyframes float {
    100% {
      transform: translateY(20px);
    }
  }
}
</style>