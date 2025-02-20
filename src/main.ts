import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { i18n } from './i18n'
import App from './App.vue'
import router from './router'
import './assets/index.css'

// Configuração do tema escuro
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}

// Criação da aplicação
const app = createApp(App)

// Plugins
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(i18n)

// Configuração global de erros
app.config.errorHandler = (err, vm, info) => {
  console.error('Erro global:', err)
  console.error('Componente:', vm)
  console.error('Info:', info)
  // Aqui você pode adicionar integração com serviços de monitoramento de erros
}

// Diretivas globais
app.directive('focus', {
  mounted: (el) => el.focus()
})

// Montagem da aplicação
app.mount('#app')