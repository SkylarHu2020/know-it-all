<template>
  <nav class="navbar navbar-dark bg-primary justify-content-between mb-4 px-4">
    <a class="navbar-brand" href="#">Know it all</a>
    <ul v-if="!user.isLogin" class="list-inline mb-0">
      <li class="list-inline-item"><a href="#" class="btn btn-outline-light my-2">Sign In</a></li>
      <li class="list-inline-item"><a href="#" class="btn btn-outline-light my-2">Sign Up</a></li>
    </ul>
    <ul v-else class="list-inline mb-0">
      <li class="list-inline-item">
        <dropdown :title="`Hi ${user.name}`">
          <dropdown-item><a href="#" class="dropdown-item">New Essay</a></dropdown-item>
          <dropdown-item><a href="#" class="dropdown-item">Edit Accout</a></dropdown-item>
          <dropdown-item><a href="#" class="dropdown-item">Sign Out</a></dropdown-item>
        </dropdown>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import Dropdown from '@/components/Dropdown.vue'
import DropdownItem from '@/components/DropdownItem.vue'

export interface UserProps {
  isLogin: boolean;
  name?: string;
  id?: number;
}

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
  }
})
</script>

<style>

</style>
