import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router.ts'
import store from '@/store.ts'
import axios from 'axios'

axios.defaults.baseURL = 'http://apis.imooc.com/api'
axios.interceptors.request.use(config => {
  config.params = {
    ...config.params,
    icode: 'E2809197D1FD7200'
  }
  store.commit('setLoading', true)
  return config
})

axios.interceptors.response.use(config => {
  setTimeout(() => {
    store.commit('setLoading', false)
  }, 2000)
  return config
})

const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
