import { createStore, Commit } from 'vuex'
import axios from 'axios'
import { resolveComponent } from 'vue'

interface UserProps {
  isLogin: boolean;
  name?: string;
  id?: number;
  columnId?: string;
}

interface ImageProps {
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
  _id: string;
  title: string;
  excerpt?: string;
  content?: string;
  image?: ImageProps;
  createdAt: string;
  column: string;
}

export interface GlobalDataProps {
  loading: boolean;
  columns: ColumnProps[];
  posts: PostProps[];
  user: UserProps;
}

const store = createStore<GlobalDataProps>({
  state: {
    loading: false,
    columns: [],
    posts: [],
    user: { isLogin: false }
  },
  mutations: {
    login(state) {
      state.user = { ...state.user, isLogin: true, name: 'skylar', columnId: '1' }
    },
    createPost(state, newPost) {
      state.posts.push(newPost)
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
    setLoading(state, status) {
      state.loading = status
    }
  },
  actions: {
    async fetchColumns({ commit }) {
      const { data } = await axios.get('/columns')
      commit('fetchColumns', data)
    },
    async fetchColumn({ commit }, cid) {
      const { data } = await axios.get(`/columns/${cid}`)
      commit('fetchColumn', data)
    },
    async fetchPosts({ commit }, cid) {
      const { data } = await axios.get(`/columns/${cid}/posts`)
      commit('fetchPosts', data)
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
