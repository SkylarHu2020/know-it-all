<template>
  <div class="home-page">
    <section class="py-5 text-center container">
      <div class="row py-lg-5">
        <div class="col-lg-6 col-md-8 mx-auto">
          <img src="../assets/callout.svg" alt="callout" class="w-50" />
          <h2 class="font-weight-light">free notes</h2>
          <p>
            <a href="#" class="btn btn-primary my-2">start write</a>
          </p>
        </div>
      </div>
    </section>
    <h4 class="font-weight-bold text-center">find something great</h4>
    <column-list :list='list'></column-list>
    <button class="btn btn-primary mt-2 mb-5 mx-auto btn-block w-25" @click="loadMorePage" v-if="!isLastPage">Load More</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import ColumnList from '@/components/ColumnList.vue'
import { useStore } from 'vuex'
import useLoadMore from '@/hooks/useLoadMore.ts'
import { GlobalDataProps } from '../store'

export default defineComponent({
  name: 'Home',
  components: {
    ColumnList
  },
  setup() {
    const store = useStore<GlobalDataProps>()
    const list = computed(() => store.getters.getColumns)
    const total = computed(() => store.state.columns.total)
    const currentPage = computed(() => store.state.columns.currentPage)
    onMounted(() => {
      store.dispatch('fetchColumns', {
        pageSize: 3
      })
    })
    const { loadMorePage, isLastPage } = useLoadMore('fetchColumns', total, { pageSize: 3, currentPage: (currentPage.value ? currentPage.value + 1 : 2) })
    return {
      list,
      loadMorePage,
      isLastPage
    }
  }
})
</script>

<style>
</style>
