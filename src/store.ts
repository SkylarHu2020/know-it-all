import { createStore } from 'vuex'
import axios from 'axios'
import { arrToObj, objToArr } from '@/helper.ts'

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
  avatar?: ImageProps;
  description?: string;
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
  author?: string | UserProps;
}

interface ListProps<P> {
  [id: string]: P;
}

export interface GlobalErrorProps {
  status: boolean;
  message?: string;
}

export interface GlobalDataProps {
  error: GlobalErrorProps;
  token: string;
  loading: boolean;
  columns: { data: ListProps<ColumnProps>; currentPage: number; total: number };
  posts: { data: ListProps<PostProps>; loadedColumns: ListProps<{ total: number; currentPage: number}>};
  user: UserProps;
}

const store = createStore<GlobalDataProps>({
  state: {
    error: { status: false },
    token: localStorage.getItem('token') || '',
    loading: false,
    columns: { data: {}, currentPage: 0, total: 0 },
    posts: { data: {}, loadedColumns: {} },
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
      const { data } = state.columns
      const { list, count, currentPage } = rawData.data
      state.columns = {
        data: { ...data, ...arrToObj(list) },
        total: count,
        currentPage: currentPage * 1
      }
    },
    fetchColumn(state, { data }) {
      state.columns.data[data._id] = data
    },
    fetchPosts(state, { rawData, cid }) {
      const { data } = state.posts
      const { list, count, currentPage } = rawData.data
      const currentLoadColumn = {
        currentPage: currentPage * 1,
        total: count
      }
      state.posts.data = { ...data, ...arrToObj(list) }
      state.posts.loadedColumns[cid] = currentLoadColumn
      // state.posts.data = { ...state.posts.data, ...arrToObj(data.data.list) }
      // state.posts.loadedColumns.push(cid)
    },
    fetchPost(state, { data }) {
      state.posts.data[data._id] = data
    },
    deletePost(state, { data }) {
      delete state.posts.data[data._id]
    },
    createPost(state, newPost) {
      state.posts.data[newPost._id] = newPost
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
    },
    updatePost(state, { data }) {
      state.posts.data[data._id] = data
    }
  },
  actions: {
    async fetchColumns({ state, commit }, params = {}) {
      const { currentPage = 1, pageSize = 6 } = params
      if (state.columns.currentPage < currentPage) {
        const { data } = await axios.get(`/columns?currentPage=${currentPage}&pageSize=${pageSize}`)
        commit('fetchColumns', data)
        return data
      }
    },
    async fetchColumn({ state, commit }, cid) {
      if (!state.columns.data[cid]) {
        const { data } = await axios.get(`/columns/${cid}`)
        commit('fetchColumn', data)
        return data
      }
    },
    async fetchPosts({ state, commit }, params = {}) {
      // if (!state.posts.loadedColumns.includes(cid)) {
      //   const { data } = await axios.get(`/columns/${cid}/posts`)
      //   commit('fetchPosts', { data: data, cid: cid })
      //   return data
      // }
      const { cid, currentPage = 1, pageSize = 6 } = params
      if (!state.posts.loadedColumns[cid] || state.posts.loadedColumns[cid].currentPage < currentPage) {
        const { data } = await axios.get(`/columns/${cid}/posts?currentPage=${currentPage}&pageSize=${pageSize}`)
        commit('fetchPosts', { rawData: data, cid })
        return data
      }
    },
    async fetchPost({ state, commit }, id) {
      const currentPost = state.posts.data[id]
      if (!currentPost || !currentPost.content) {
        const { data } = await axios.get(`/posts/${id}`)
        commit('fetchPost', data)
        return data
      } else {
        return Promise.resolve({ data: currentPost })
      }
    },
    async deletePost({ commit }, id) {
      const { data } = await axios.delete(`/posts/${id}`)
      commit('deletePost', data)
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
    },
    async updatePost({ commit }, { id, payload }) {
      const { data } = await axios.patch(`/posts/${id}`, payload)
      commit('updatePost', data)
      return data
    }
  },
  getters: {
    getColumns: (state) => {
      return objToArr(state.columns.data)
    },
    getColumnById: (state) => (id: string) => {
      return state.columns.data[id]
    },
    getPostsByCid: (state) => (cid: string) => {
      return objToArr(state.posts.data).filter(post => post.column === cid)
    },
    getPostById: (state) => (id: string) => {
      return state.posts.data[id]
      // return state.posts.filter(post => id === post._id)[0]
    }
  }
})

export default store
