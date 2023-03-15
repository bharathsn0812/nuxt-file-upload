<template>
  <div class="col-sm-6">
    <br />
    <b-form @submit.stop.prevent>
      <label for="text-password">Select Image File</label>
      <b-form-file
        id="file"
        ref="file"
        type="file"
        accept="image/*"
        @change="handleFileChange"
      ></b-form-file>
      <p class="text-danger">{{ errorMsg }}</p>
      <br />
      <label for="text-password">Enter Name</label>
      <b-form-input
        v-model="name"
        type="text"
        placeholder="enter name"
      ></b-form-input>
      <br />
      <label for="text-password">Enter Password</label>
      <b-form-input
        v-model="password"
        type="password"
        placeholder="enter password"
      ></b-form-input>
    </b-form>
    <br />
    <div v-if="previewUrl">
      <p>Preview</p>
      <img :src="previewUrl" class="img-fluid" />
      <br />
      <b-button variant="primary" class="mt-5" @click="uploadImage"
        >Upload</b-button
      >
    </div>

    <div v-if="url">
      <p>Image Uploaded</p>
      <img :src="url" class="img-fluid" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: '',
      password: '',
      errorMsg: '',
      previewUrl: null,
      url: null,
    }
  },
  methods: {
    handleFileChange(e) {
      const file = e.target.files[0]

      this.errorMsg = ''
      this.previewUrl = null
      this.url = null

      if (!file) return

      if (file.size > 15 * 1024 * 1024) {
        this.errorMsg = 'Max file size allowed is 15MB'
        return
      }

      this.previewUrl = URL.createObjectURL(file)
    },
    uploadImage() {
      const file = this.$refs.file.files[0]
      if (!file) return
      if (!this.name || !this.password) {
        this.errorMsg = 'enter valid credentials'
        return
      }

      const formData = new FormData()
      formData.append('file', file)

      this.$axios
        .post('/api/s3/upload', formData, {
          auth: {
            username: this.name,
            password: this.password,
          },
        })
        .then((res) => {
          this.previewUrl = ''
          this.errorMsg = ''
          this.url = res.data.link
        })
    },
  },
}
</script>
