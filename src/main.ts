import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createStore } from 'vuex'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import ColumnDetail from '@/views/ColumnDetail.vue'

const routerHistory = createWebHistory()
const store = createStore({
  state: {
    count: 0
  },
  mutations: {
    add (state) {
      state.count++
    }
  }
})
console.log('store', store.state.count)
store.commit('add')
console.log('store', store.state.count)

const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/column/:id',
      name: 'column',
      component: ColumnDetail
    }
  ]
})

const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
