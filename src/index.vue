<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
    <div class="Web-Control">
        <div class="Nav">
            <router-link to="/" class="Button">
            <img src="/src/assets/imgs/nav/HYW-Website-Nav.webp" alt="何意味？" />
            </router-link>
            <div class="Menu">
                <router-link to="/" class="Button">主页</router-link>
                <router-link to="/about" class="Button">关于</router-link>
            </div>
        </div>
        <div class="何意味">
            <RouterView/>
        </div>
        <div class="Footer">
            <span>&copy; {{currentYear}} <a href="https://github.com/LorienYang">Lorien Yang</a> All rights reserved.</span>
            <span>声明：本网站仅提供表情包预览与下载，版权归原作者所有。</span>
            <span>
                如有侵权，请<a href="mailto:postmaster@sakuraonline.cn">联系我们</a>。
                您可以通过 <a href="https://github.com/LorienYang/HYW-Meme-Web/pulls">提交PR</a>丰富本站点内容</span>
            <span>域名由 <a href="https://github.com/Kimimaybe29">Kimimaybe29</a> 提供</span>
        </div>
    </div>
</template>

<style scoped>
.Web-Control {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    .Nav {
        z-index: 999;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: fixed;
        top: 15px;
        width: 90%;
        height: 60px;
        background-color: white;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        img {
            margin-left: 20px;
            width: 132px;
            height: 50px;
        };
        h1 {
            font-size: 24px;
            padding: 0 0 0 20px;
        };
        .Menu {
            display: flex;
            padding: 0 20px;
            justify-content: center;
            align-items: center;
            gap: 10px;
            a {
                font-size: 20px;
                text-decoration: none;
                color: black;
            }
        }
    }
}

.何意味 {
    display: flex;
    justify-content: center;
    width: 90%;
    margin: 0 auto;
    padding: 90px 0 0 0 ;
}
.Footer {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 90%;
    margin: 0 auto;
    padding: 40px 0 20px 0;
    a {
        text-decoration: none;
    }
    span {
        font-size: 16px;
        line-height: 1.5;
        @media (max-width: 560px) {
            font-size: 12px;
        }
    }
}

</style>