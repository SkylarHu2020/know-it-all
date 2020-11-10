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
      <div class="mb-3">
        <label class="form-label">Nick Name</label>
        <validate-input
          :rules="nickNameRules"
          v-model="nickNameVal"
          placeholder="please enter your nick name"
          type="text"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">Password</label>
        <validate-input
          type="password"
          placeholder="Please enter your password"
          :rules="passwordRules"
          v-model='passwordVal'
        />
      </div>
      <div class="mb-3">
        <label class="form-label">Confirm Password</label>
        <validate-input
          type="password"
          placeholder="Please confirm your password"
          :rules="confirmPasswordRules"
          v-model='confirmPasswordVal'
        />
      </div>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import ValidateForm from '@/components/ValidateForm.vue'
import ValidateInput, { RulesProp } from '@/components/ValidateInput.vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import createMessage from '@/components/createMessage.ts'

export default defineComponent({
  name: 'Signup',
  components: {
    ValidateForm,
    ValidateInput
  },
  setup() {
    const inputRef = ref<any>()
    const router = useRouter()
    const emailVal = ref('')
    const emailRules: RulesProp = [
      { type: 'required', message: 'The email can not be empty.' },
      { type: 'email', message: 'Please enter a valid email.' }
    ]
    const nickNameVal = ref('')
    const nickNameRules = [
      { type: 'required', message: 'The nick name can not be empty' }
    ]
    const passwordVal = ref('')
    const passwordRules: RulesProp = [
      { type: 'required', message: 'The password can not be empty' }
    ]
    const confirmPasswordVal = ref('')
    const confirmPasswordRules: RulesProp = [
      { type: 'required', message: 'The password can not be empty' },
      {
        type: 'custom',
        validator: () => {
          return confirmPasswordVal.value === passwordVal.value
        },
        message: 'The confirm password is not the same as password'
      }
    ]
    const onFormSubmit = async (result: boolean) => {
      if (result) {
        const payload = {
          email: emailVal.value,
          nickName: nickNameVal.value,
          password: passwordVal.value
        }
        try {
          await axios.post('/users/', payload)
          createMessage('Signup successful!', 'success')
          setTimeout(() => {
            router.push('/login')
          }, 2000)
        } catch (e) {
          console.log(e)
        }
      }
    }
    return {
      inputRef,
      emailVal,
      emailRules,
      nickNameVal,
      nickNameRules,
      passwordVal,
      passwordRules,
      confirmPasswordVal,
      confirmPasswordRules,
      onFormSubmit
    }
  }
})
</script>

<style>

</style>
