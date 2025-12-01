import {createRouter, createWebHistory} from 'vue-router'

import HomeView from '../views/MeME.vue'
import AboutView from '../views/About.vue'

const routes = [
    { path: '/', name: '何意味？', component: HomeView },
    { path: '/about', name: '关于', component: AboutView },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router