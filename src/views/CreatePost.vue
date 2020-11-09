<template>
  <div class="create-post-page">
    <h4>New Essay</h4>
    <input type="file" name="file" @change.prevent="handleFileChange"/>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">Title: </label>
        <validate-input
          :rules="titleRules"
          v-model="titleVal"
          palceholder="Please enter the essay title"
          type='text'
        />
      </div>
      <div class="mb-3">
        <label class="form-label">Content: </label>
        <validate-input
          :rules="contentRules"
          v-model="contentVal"
          placeholder="Please enter the content"
          type="text"
          tag="textarea"
          rows='10'
        />
      </div>
      <template #submit>
          <button class="btn btn-primary btn-large">Create</button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { GlobalDataProps, PostProps } from '../store'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import axios from 'axios'
import ValidateForm from '@/components/ValidateForm.vue'
import ValidateInput, { RulesProp } from '@/components/ValidateInput.vue'

export default defineComponent({
  name: 'CreatePost',
  components: {
    ValidateForm,
    ValidateInput
  },
  setup() {
    const store = useStore<GlobalDataProps>()
    const router = useRouter()
    const titleVal = ref('')
    const contentVal = ref('')
    const titleRules: RulesProp = [
      { type: 'required', message: 'The title can not be empty.' }
    ]
    const contentRules: RulesProp = [
      { type: 'required', message: 'The content can not be empty' }
    ]
    const onFormSubmit = (result: boolean) => {
      if (result) {
        const { column } = store.state.user
        if (column) {
          const newPost: PostProps = {
            _id: new Date().getTime().toString(),
            title: titleVal.value,
            excerpt: contentVal.value,
            column: column,
            createdAt: new Date().toLocaleString()
          }
          store.commit('createPost', newPost)
          router.push({
            name: 'column',
            params: {
              id: column
            }
          })
        }
      }
    }
    const handleFileChange = async (e: Event) => {
      const target = e.target as HTMLInputElement
      const files = target.files
      if (files) {
        const uploadedFile = files[0]
        const formData = new FormData()
        formData.append(uploadedFile.name, uploadedFile)
        await axios.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      }
    }
    return {
      titleVal,
      contentVal,
      titleRules,
      contentRules,
      onFormSubmit,
      handleFileChange
    }
  }
})
</script>

<style>
</style>
