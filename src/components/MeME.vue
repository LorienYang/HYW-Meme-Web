<template>
    <div class="MeMe-Control">
        <div
                class="MeMe-Item"
                v-for="(img,idx) in imageList"
                :key="idx"
                :style="{ animationDelay: idx * 0.25 + 's' }"
        >
            <div class="MeMe-Item-Box">
                <div class="MeMe-Item-Img">
                    <img
                            :src="img"
                            alt="点击放大"
                            loading="lazy"
                            @click="openLightbox(idx)"
                            style="cursor: pointer;"
                    >
                </div>
            </div>
        </div>
    </div>

    <vue-easy-lightbox
            :visible="visibleRef"
            :imgs="imageList"
            :index="indexRef"
            @hide="onHide"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue';

import {imageList} from "../assets/config/images.ts";

//图片放大实现
import VueEasyLightbox from 'vue-easy-lightbox';
const visibleRef = ref(false);
const indexRef = ref(0);
/**
 * @param index 被点击图片的索引
 */
const openLightbox = (index: number) => {
    indexRef.value = index;
    visibleRef.value = true;
};
const onHide = () => {
    visibleRef.value = false;
};

</script>

<style scoped>
.MeMe-Control {
    display: grid;
    width: auto;
    grid-template-columns: 1fr;
    grid-auto-columns: 1fr;
    gap: 25px;
    @media (max-width: 480px) {
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
    }
    @media (min-width: 481px) and (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
    }
    @media (min-width: 768px) {
        grid-template-columns: repeat(3, 1fr);
    }
    @media (min-width: 992px) {
        grid-template-columns: repeat(4, 1fr);
    }
    @media (min-width: 1200px) {
        grid-template-columns: repeat(5, 1fr);
    }
    @media (min-width: 1400px) {
        grid-template-columns: repeat(6, 1fr);
        justify-content: center;
    }
    .MeMe-Item {
        width: 100%;
        .MeMe-Item-Box {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 180px;
            height: 180px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            border-radius: 10px;
            background-color: rgba(255, 255, 255, 0.95);
            @media (min-width: 768px) {
                width: 200px;
                height: 200px;
            }
            .MeMe-Item-Img {
                display: inline-flex;
                width: auto;
                height: auto;
                border-radius: 10px;
                overflow: hidden;
                z-index: 1;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                img {
                    width: 140px;
                    height: auto;
                    max-height: 140px;
                    z-index: 0;
                }
            }
        }
    }
}
</style>