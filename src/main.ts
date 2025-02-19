import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

// Check for dark mode preference
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.documentElement.classList.add('dark')
}

createApp(App).use(router).mount('#app')