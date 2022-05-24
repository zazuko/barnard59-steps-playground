import { createApp } from 'vue'
import App from './App.vue'
import './styles/index.css'

const app = createApp(App)

const port = process.env.PORT || 4000
const publicBaseUrl = process.env.PUBLIC_BASE_URL || `http://localhost:${port}`
app.provide('publicBaseUrl', publicBaseUrl)

app.directive('focus', {
  mounted (el) {
    el.focus()
  },
})

app.mount('#app')
