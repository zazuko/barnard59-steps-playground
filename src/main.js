import { createApp } from 'vue'
import App from './App.vue'
import './styles/index.css'

const app = createApp(App)

app.directive('focus', {
  mounted (el) {
    el.focus()
  },
})

app.mount('#app')
