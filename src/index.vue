<script setup lang="ts">
import MeME from "./components/MeME.vue";
</script>

<template>
    <div class="Web-Control">
        <div class="Nav">
            <h1>何意味？</h1>
            <div class="Menu">
                <a href="/">主页</a>
            </div>
        </div>
        <div class="何意味">
            <MeME />
        </div>
        <div class="Footer">
            3
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
        z-index: 9999;
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
        h1 {
            font-size: 24px;
            padding: 0 0 0 20px;
        }
        a {
            font-size: 20px;
            text-decoration: none;
            color: black;
        }
        .Menu {
            padding: 0 20px;
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
    width: 90%;
    margin: 0 auto;
    padding: 20px 0;
}

</style>