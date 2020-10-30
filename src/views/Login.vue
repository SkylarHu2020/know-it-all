<template>
  <div class="container">
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">Email Address</label>
        <validate-input
          :rules="emailRules"
          v-model="emailVal"
          placeholder="please enter your email"
          type="text"
          ref="inputRef"
        />
      </div>
      <div class="form-label">
        <label class="form-label">Password</label>
        <validate-input
          type="password"
          placeholder="Please enter your password"
          :rules="passwordRules"
          v-model='passwordVal'
        />
      </div>
      <template #submit>
        <span class="btn btn-danger">Submit</span>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import ValidateInput, { RulesProp } from '@/components/ValidateInput.vue'
import ValidateForm from '@/components/ValidateForm.vue'

export default defineComponent({
  name: 'App',
  components: {
    ValidateInput,
    ValidateForm
  },
  setup() {
    const inputRef = ref<any>()
    const emailVal = ref('')
    const router = useRouter()
    const emailRules: RulesProp = [
      { type: 'required', message: 'The email can not be empty.' },
      { type: 'email', message: 'Please enter a valid email.' }
    ]
    const passwordVal = ref('')
    const passwordRules: RulesProp = [
      { type: 'required', message: 'The password can not be empty' }
    ]

    const onFormSubmit = (result: boolean) => {
      if (result) {
        router.push({
          name: 'home'
        })
      }
    }

    return {
      emailRules,
      emailVal,
      passwordVal,
      passwordRules,
      onFormSubmit,
      inputRef
    }
  }
})
</script>

<style>
</style>
