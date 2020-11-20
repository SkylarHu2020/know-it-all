import { useStore } from 'vuex'
import { ref, computed, ComputedRef } from 'vue'

interface LoadParams {
  currentPage: number;
  pageSize: number;
  cid?: string;
}

const useLoadMore = (actionName: string, total: ComputedRef<number>, params: LoadParams = { cid: '', currentPage: 2, pageSize: 5 }) => {
  const store = useStore()
  const currentPage = ref(params.currentPage)
  const requestParams = computed(() => ({
    cid: params.cid,
    currentPage: currentPage.value,
    pageSize: params.pageSize
  }))

  const loadMorePage = () => {
    store.dispatch(actionName, requestParams.value).then(() => {
      currentPage.value++
    })
  }
  const isLastPage = computed(() => {
    return Math.ceil(total.value / params.pageSize) < currentPage.value
  })
  return {
    loadMorePage,
    isLastPage,
    currentPage
  }
}

export default useLoadMore
