<template>
  <nav class="navbar navbar-dark bg-primary justify-content-between mb-4 px-4">
    <router-link class="navbar-brand" to="/">Know it all</router-link>
    <ul v-if="!user.isLogin" class="list-inline mb-0">
      <li class="list-inline-item"><router-link to="/login" class="btn btn-outline-light my-2">Sign In</router-link></li>
      <li class="list-inline-item"><router-link to="/signup" class="btn btn-outline-light my-2">Sign Up</router-link></li>
    </ul>
    <ul v-else class="list-inline mb-0">
      <li class="list-inline-item">
        <dropdown :title="`Hi ${user.nickName}`">
          <dropdown-item><router-link to="/create" class="dropdown-item">New Essay</router-link></dropdown-item>
          <dropdown-item><router-link :to="`/column/${user.column}`" class="dropdown-item">My Column</router-link></dropdown-item>
          <dropdown-item><a href="#" class="dropdown-item">Edit Info</a></dropdown-item>
          <dropdown-item><a href="#" class="dropdown-item"><div @click="logout">Sign Out</div></a></dropdown-item>
        </dropdown>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import Dropdown from '@/components/Dropdown.vue'
import DropdownItem from '@/components/DropdownItem.vue'
import { UserProps } from '../store'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'GlobalHeader',
  components: {
    Dropdown,
    DropdownItem
  },
  props: {
    user: {
      type: Object as PropType<UserProps>,
      required: true
    }
  },
  setup() {
    const store = useStore()
    const logout = () => {
      store.commit('logout')
    }
    return {
      logout
    }
  }
})
</script>

<style>

</style>
