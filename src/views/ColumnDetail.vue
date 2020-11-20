<template>
  <div class="column-detail-page w-75 mx-auto">
    <div class="column-info row mb-4 bordder-bottom pb-4 align-items-center">
      <div class="col-3 text-center">
        <img :src="column.avatar && column.avatar.url" :alt="column.title" class="rounded-circle border w-100">
      </div>
      <div class="col-9">
        <h4>{{ column.title }}/</h4>
        <p class="text-muted">{{ column.description }}</p>
      </div>
    </div>
    <post-list :list="list"></post-list>
    <button class="btn btn-primary mt-2 mb-5 mx-auto btn-block w-25" @click="loadMorePage" v-if="!isLastPage">Load More</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import PostList from '../components/PostList.vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '../store'
import useLoadMore from '../hooks/useLoadMore'

export default defineComponent({
  components: {
    PostList
  },
  setup() {
    const route = useRoute()
    const store = useStore<GlobalDataProps>()
    const currentId = route.params.id as string
    const total = computed(() => store.state.posts.loadedColumns[currentId] ? store.state.posts.loadedColumns[currentId].total : 0)
    const currentPage = computed(() => store.state.posts.loadedColumns[currentId] ? store.state.posts.loadedColumns[currentId].currentPage : 1)
    onMounted(() => {
      store.dispatch('fetchColumn', currentId)
      store.dispatch('fetchPosts', {
        cid: currentId,
        pageSize: 3
      })
    })
    const column = computed(() => store.getters.getColumnById(currentId))
    const list = computed(() => store.getters.getPostsByCid(currentId))
    const { loadMorePage, isLastPage } = useLoadMore('fetchPosts', total, {
      cid: currentId, pageSize: 3, currentPage: (currentPage.value ? currentPage.value + 1 : 2)
    })
    return {
      column,
      list,
      loadMorePage,
      isLastPage
    }
  }
})
</script>

<style>

</style>
