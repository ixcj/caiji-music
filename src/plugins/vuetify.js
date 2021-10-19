import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  breakpoint: {
    mobileBreakpoint: 600,
    thresholds: {
      xs: 600,
      sm: 800,
      md: 1100,
      lg: 1544,
    },
    scrollBarWidth: 0
  }
});
