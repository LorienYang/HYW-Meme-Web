import { createApp } from 'vue'
import './style.css'
import Index from './index.vue'
import router from './router'

createApp(Index).use(router).mount('#app')
