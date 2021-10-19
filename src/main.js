import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

import '@/assets/styles/style.scss'

import './filters'

import './plugins/axios'
import api  from './api'
Vue.prototype.$api = api

Vue.prototype.$message = config => {
  store.commit('layout/setMessage', config)
}

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
