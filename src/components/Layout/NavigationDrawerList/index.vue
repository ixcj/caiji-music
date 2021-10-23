<template>
  <v-list nav dense class="NavigationDrawerList">
    <v-tooltip
      right
      :disabled="drawer"
      v-for="(item, index) in menuList"
      :key="index"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-list-item
          link
          :to="item.to"
          :active-class="activeClass"
          v-bind="attrs"
          v-on="on"
        >
          <v-list-item-action>
            <v-icon>{{item.icon}}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{item.text}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
      <span>{{item.text}}</span>
    </v-tooltip>
    
  </v-list>
</template>

<script>
import { hexToRgb, rgbToHsi } from '@/utils/color'
import { menuList } from '@/config'

export default {
  name: 'NavigationDrawerList',
  props: {
    drawer: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      menuList
    };
  },
  computed: {
    activeClass() {
      const rgbColor = hexToRgb(this.$store.getters.mainColor)
      const hsiColor = rgbToHsi(rgbColor.R, rgbColor.G, rgbColor.B)
      return hsiColor[2] > 0.75 ? 'nav-active-white-theme' : 'nav-active'
    }
  },
  methods: {},
};
</script>

<style scoped lang="scss">
.NavigationDrawerList {
  background-color: transparent !important;
  .nav-active {
    color: var(--mainColor);
  }
  .nav-active-white-theme {
    color: #333;
  }
}
</style>