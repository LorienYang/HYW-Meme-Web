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
                            :ref="(el) => setItemRef(el, idx)"
                            @click="openLightbox(idx)"
                            style="cursor: pointer;"
                            :style="{ opacity: activeIndex === idx ? 0 : 1 }"
                    >
                </div>
            </div>
        </div>
    </div>

    <Teleport to="body">
        <div v-if="activeIndex !== null" class="lightbox-container">
            <div 
                class="lightbox-mask"
                :class="{ visible: maskVisible }"
                @click="closeLightbox"
            ></div>
            
            <!-- Image -->
            <img
                :src="imageList[activeIndex]"
                class="lightbox-img"
                :style="[imgStyle, transformStyle]"
                alt="Full screen"
            />

            <!-- Navigation -->
            <!-- 图标重绘 -->
            <button v-if="activeIndex > 0" class="nav-btn prev" @click.stop="switchImage(activeIndex - 1)">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                </svg>
            </button>
            <button v-if="activeIndex < imageList.length - 1" class="nav-btn next" @click.stop="switchImage(activeIndex + 1)">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                </svg>
            </button> 

            <!-- Toolbar -->
            <div class="lightbox-toolbar" @click.stop>
                <button @click="zoomIn" title="放大">+</button>
                <button @click="zoomOut" title="缩小">-</button>
                <button @click="resetTransform" title="还原">1:1</button>
                <button @click="rotateLeft" title="左旋转">↺</button>
                <button @click="rotateRight" title="右旋转">↻</button>
                <button @click="downloadCurrent" title="下载">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                </button>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onUnmounted, onMounted } from 'vue';
import {imageList} from "../assets/config/images.ts";

const activeIndex = ref<number | null>(null);
const maskVisible = ref(false);
const imgStyle = ref<Record<string, string>>({});
const itemRefs = ref<Record<number, HTMLImageElement | null>>({});

// Transform state
const scale = ref(1);
const rotate = ref(0);

const transformStyle = computed(() => ({
    transform: `rotate(${rotate.value}deg) scale(${scale.value})`
}));

const setItemRef = (el: any , idx: number) => {
    if (el) itemRefs.value[idx] = el as HTMLImageElement;
};

// Scrollbar handling
const lockScroll = () => {
    document.body.style.overflow = 'hidden';
};

const unlockScroll = () => {
    document.body.style.overflow = '';
};

// Calculate centered position
const calcCenterStyle = (target: HTMLImageElement) => {
    const padding = 40;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    
    // Natural dimensions
    const nw = target.naturalWidth;
    const nh = target.naturalHeight;

    // 默认放大到表情包原始大小，除非表情包大小超出屏幕范围
    const scale = Math.min(1, (vw - padding) / nw, (vh - padding) / nh);

    const targetW = nw * scale;
    const targetH = nh * scale;

    const targetTop = (vh - targetH) / 2;
    const targetLeft = (vw - targetW) / 2;

    return {
        top: `${targetTop}px`,
        left: `${targetLeft}px`,
        width: `${targetW}px`,
        height: `${targetH}px`,
        borderRadius: '4px'
    };
};

const openLightbox = async (index: number) => {
    const target = itemRefs.value[index];
    if (!target) return;

    const rect = target.getBoundingClientRect();
    activeIndex.value = index;
    resetTransformState();
    
    lockScroll();

    // Initial position (thumbnail)
    imgStyle.value = {
        top: `${rect.top}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        borderRadius: '10px',
        transition: 'none' // Disable transition for initial set
    };

    await nextTick();

    maskVisible.value = true;

    // Animate to center
    requestAnimationFrame(() => {
        imgStyle.value = {
            ...calcCenterStyle(target),
            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
        };
    });
};

const switchImage = (newIndex: number) => {
    if (newIndex < 0 || newIndex >= imageList.length) return;
    
    const target = itemRefs.value[newIndex];
    if (!target) return;

    activeIndex.value = newIndex;
    resetTransformState();
    
    // Morph to new image dimensions
    imgStyle.value = {
        ...calcCenterStyle(target),
        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
    };
};

const closeLightbox = () => {
    if (activeIndex.value === null) return;
    const target = itemRefs.value[activeIndex.value];
    if (!target) {
        maskVisible.value = false;
        activeIndex.value = null;
        unlockScroll();
        return;
    }
    
    const rect = target.getBoundingClientRect();
    maskVisible.value = false;
    
    // Reset transform for clean closing animation
    scale.value = 1;
    rotate.value = 0;

    // Animate back to thumbnail
    imgStyle.value = {
        top: `${rect.top}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        borderRadius: '10px',
        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
    };

    setTimeout(() => {
        activeIndex.value = null;
        unlockScroll();
    }, 300);
};

// Toolbar Actions
const resetTransformState = () => {
    scale.value = 1;
    rotate.value = 0;
};
const zoomIn = () => scale.value = Math.min(scale.value + 0.2, 3);
const zoomOut = () => scale.value = Math.max(scale.value - 0.2, 0.2);
const resetTransform = () => resetTransformState();
const rotateLeft = () => rotate.value -= 90;
const rotateRight = () => rotate.value += 90;

const downloadCurrent = () => {
    if (activeIndex.value === null) return;
    const url = imageList[activeIndex.value];
    if (!url) return
    const a = document.createElement('a');
    a.href = url;
    // 尝试从URL获取文件名，如果失败则使用默认名
    const filename = url.substring(url.lastIndexOf('/') + 1) || `meme-${Date.now()}.jpg`;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};

// Keyboard support
const onKeyDown = (e: KeyboardEvent) => {
    if (activeIndex.value === null) return;
    switch(e.key) {
        case 'Escape': closeLightbox(); break;
        case 'ArrowLeft': switchImage(activeIndex.value - 1); break;
        case 'ArrowRight': switchImage(activeIndex.value + 1); break;
    }
};

onMounted(() => {
    window.addEventListener('keydown', onKeyDown);
});

onUnmounted(() => {
    window.removeEventListener('keydown', onKeyDown);
    unlockScroll();
});
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
                    transition: opacity 0.1s;
                }
            }
        }
    }
}

/* Lightbox Styles */
.lightbox-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    pointer-events: none; /* Let clicks pass through to mask if not on controls */
}

.lightbox-container > * {
    pointer-events: auto;
}

.lightbox-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
    backdrop-filter: blur(5px);
}

.lightbox-mask.visible {
    opacity: 1;
}

.lightbox-img {
    position: fixed;
    z-index: 10;
    cursor: grab;
    object-fit: contain;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    transform-origin: center center;
}

.lightbox-img:active {
    cursor: grabbing;
}

.nav-btn {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    font-size: 2rem;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    cursor: pointer;
    z-index: 20;
    transition: background 0.2s;
    border-radius: 50%;
}

.nav-btn:hover {
    background: rgba(255, 255, 255, 0.3);
}

.nav-btn.prev { left: 20px; }
.nav-btn.next { right: 20px; }

.lightbox-toolbar {
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
    background: rgba(0, 0, 0, 0.6);
    padding: 10px 20px;
    border-radius: 30px;
    z-index: 20;
    backdrop-filter: blur(10px);
}

.lightbox-toolbar button {
    background: transparent;
    border: none;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
}

.lightbox-toolbar button:hover {
    background: rgba(255, 255, 255, 0.2);
}
</style>