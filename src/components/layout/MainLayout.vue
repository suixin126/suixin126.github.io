<script setup lang="ts">
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'
</script>

<template>
    <div class="main-layout">
        <AppHeader />

        <div class="layout-content">
            <!-- 侧边栏 -->
            <AppSidebar />

            <!-- 主内容区插槽 -->
            <main class="main-content">
                <router-view />
            </main>
        </div>
    </div>
</template>

<style scoped>
.main-layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: #f5f7fa;
}

.layout-content {
    flex: 1;
    display: flex;
    gap: 20px;
    padding: 20px;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
    box-sizing: border-box;
}

.main-content {
    flex: 1;
    min-width: 0;
    order: 2;
}

/* 响应式适配 */
@media (max-width: 768px) {
    .layout-content {
        flex-direction: column;
    }

    .main-content {
        order: 2;
    }
}
</style>