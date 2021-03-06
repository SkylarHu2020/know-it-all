import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router.ts'
import store from '@/store.ts'
import axios from 'axios'

const icode = '4E6F59EF8FD2E843'
axios.defaults.baseURL = 'http://apis.imooc.com/api/'
axios.interceptors.request.use(config => {
  config.params = {
    ...config.params,
    icode
  }

  if (config.data instanceof FormData) {
    config.data.append('icode', icode)
  } else {
    config.data = { ...config.data, icode }
  }

  // config.data = {
  //   ...config.data,
  //   icode: 'E2809197D1FD7200'
  // }

  store.commit('setLoading', true)
  store.commit('setError', { status: false })
  return config
})

axios.interceptors.response.use(config => {
  store.commit('setLoading', false)
  return config
}, e => {
  const { error } = e.response.data
  store.commit('setError', { status: true, message: error })
  store.commit('setLoading', false)
  throw e
})

const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
