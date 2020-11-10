<template>
  <div class="create-post-page">
    <h4>New Essay</h4>
    <uploader
      action="/upload"
      :beforeUpload="uploadCheck"
      @file-uploaded="handleFileUploaded"
      @file-uploaded-error="onFileUploadedError"
      class="d-flex align-items-center justify-content-center bg-light text-secondary w-100 my-4"
    >
      <h1>Click to upload</h1>
      <template #loading>
        <div class="d-flex">
          <div class="spinner-border text-secondary" role="status">
            <span class="sr-only">Loading...</span>
          </div>
          <h2>is Uploading...</h2>
        </div>
      </template>
      <template #uploaded="dataProps">
        <img :src="dataProps.uploadedData.data.url">
      </template>
    </uploader>
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
import { GlobalDataProps, PostProps, ResponseType, ImageProps } from '../store'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import axios from 'axios'
import ValidateForm from '@/components/ValidateForm.vue'
import ValidateInput, { RulesProp } from '@/components/ValidateInput.vue'
import Uploader from '@/components/Uploader.vue'
import createMessage from '@/components/createMessage'
import { beforeUploadCheck } from '@/helper.ts'

export default defineComponent({
  name: 'CreatePost',
  components: {
    ValidateForm,
    ValidateInput,
    Uploader
  },
  setup() {
    const store = useStore<GlobalDataProps>()
    const router = useRouter()
    const titleVal = ref('')
    const contentVal = ref('')
    let imageId = ''
    const titleRules: RulesProp = [
      { type: 'required', message: 'The title can not be empty.' }
    ]
    const contentRules: RulesProp = [
      { type: 'required', message: 'The content can not be empty' }
    ]
    const handleFileUploaded = (rawData: ResponseType<ImageProps>) => {
      if (rawData.data._id) {
        imageId = rawData.data._id
      }
    }
    const onFormSubmit = (result: boolean) => {
      if (result) {
        const { column, _id } = store.state.user
        if (column) {
          const newPost: PostProps = {
            title: titleVal.value,
            content: contentVal.value,
            column,
            author: _id
          }
          if (imageId) {
            newPost.image = imageId
          }
          store.dispatch('createPost', newPost).then(() => {
            createMessage('Post successfully!', 'success')
            setTimeout(() => {
              router.push({ name: 'column', params: { id: column } })
            }, 2000)
          })
        }
      }
    }
    const onFileUploadedError = (rawData: ResponseType<ImageProps>) => {
      createMessage(`image uploaded failed, ${rawData.msg}`, 'error')
    }
    const uploadCheck = (file: File) => {
      const result = beforeUploadCheck(file, { format: ['image/jpeg', 'image/png'], size: 1 })
      const { passed, error } = result
      if (error === 'format') {
        createMessage('only JPG/PNG format images allowed to upload', 'error')
      }
      if (error === 'size') {
        createMessage('The size is limited to 1 Mb', 'error')
      }
      return passed
    }
    return {
      titleVal,
      contentVal,
      titleRules,
      contentRules,
      onFormSubmit,
      handleFileUploaded,
      onFileUploadedError,
      uploadCheck
    }
  }
})
</script>

<style>
.create-post-page .file-upload-container {
  height: 200px;
  cursor: pointer;
}

.create-post-page .file-upload-container img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
