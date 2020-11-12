import { createStore } from 'vuex'
import axios from 'axios'

export interface ResponseType<P = {}> {
  code: number;
  msg: string;
  data: P;
}

export interface UserProps {
  isLogin: boolean;
  nickName?: string;
  _id?: string;
  column?: string;
  email?: string;
}

export interface ImageProps {
  _id?: string;
  url?: string;
  createdAt?: string;
}

export interface ColumnProps {
  _id: string;
  title: string;
  avatar?: ImageProps;
  description: string;
}

export interface PostProps {
  _id?: string;
  title: string;
  excerpt?: string;
  content?: string;
  image?: ImageProps | string;
  createdAt?: string;
  column: string;
  author?: string;
}

export interface GlobalErrorProps {
  status: boolean;
  message?: string;
}

export interface GlobalDataProps {
  error: GlobalErrorProps;
  token: string;
  loading: boolean;
  columns: ColumnProps[];
  posts: PostProps[];
  user: UserProps;
}

const store = createStore<GlobalDataProps>({
  state: {
    error: { status: false },
    token: localStorage.getItem('token') || '',
    loading: false,
    columns: [],
    posts: [],
    user: { isLogin: false }
  },
  mutations: {
    login(state, rawData) {
      const token = rawData.data.token
      state.token = token
      localStorage.setItem('token', token)
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
    },
    fetchCurrentUser(state, rawData) {
      state.user = { isLogin: true, ...rawData.data }
    },
    fetchColumns(state, rawData) {
      state.columns = rawData.data.list
    },
    fetchColumn(state, rawData) {
      state.columns = [rawData.data]
    },
    fetchPosts(state, rawData) {
      state.posts = rawData.data.list
    },
    createPost(state, newPost) {
      state.posts.push(newPost)
    },
    setLoading(state, status) {
      state.loading = status
    },
    setError(state, e: GlobalErrorProps) {
      state.error = e
    },
    logout(state) {
      state.token = ''
      state.user = { isLogin: false }
      localStorage.removeItem('token')
      delete axios.defaults.headers.common.Authorization
    }
  },
  actions: {
    async fetchColumns({ commit }) {
      const { data } = await axios.get('/columns')
      commit('fetchColumns', data)
      return data
    },
    async fetchColumn({ commit }, cid) {
      const { data } = await axios.get(`/columns/${cid}`)
      commit('fetchColumn', data)
      return data
    },
    async fetchPosts({ commit }, cid) {
      const { data } = await axios.get(`/columns/${cid}/posts`)
      commit('fetchPosts', data)
      return data
    },
    async createPost({ commit }, payload) {
      const { data } = await axios.post('/posts', payload)
      commit('createPost', data)
      return data
    },
    async login({ commit }, payload) {
      const { data } = await axios.post('/user/login', payload)
      commit('login', data)
      return data
    },
    async fetchCurrentUser({ commit }) {
      const { data } = await axios.get('/user/current')
      commit('fetchCurrentUser', data)
      return data
    }
  },
  getters: {
    getColumnById: (state) => (id: string) => {
      return state.columns.find(c => c._id === id)
    },
    getPostByCid: (state) => (cid: string) => {
      return state.posts.filter(post => post.column === cid)
    }
  }
})

export default store
