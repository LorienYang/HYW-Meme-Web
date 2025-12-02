import {createRouter, createWebHistory} from 'vue-router'

import HomeView from '../views/MeME.vue'
import AboutView from '../views/About.vue'
import GuideView from '../views/Guide.vue'

const routes = [
    { path: '/', name: '何意味？', component: HomeView },
    { path: '/about', name: '关于', component: AboutView },
    { path: '/guide', name: '添加表情包', component: GuideView },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router