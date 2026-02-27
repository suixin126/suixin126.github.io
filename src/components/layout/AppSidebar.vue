<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import BlogSidebar from '@/components/blog/BlogSidebar.vue';
import DairySidebar from '@/components/dairy/DairySidebar.vue';
import GamesSidebar from '@/components/games/GamesSidebar.vue';
import MusicSidebar from '@/components/music/MusicSidebar.vue';

const route = useRoute();

const sidebarComponent = computed(() => {
    const sidebarType = route.meta.sidebar as string;
    switch (sidebarType) {
        case 'blog':
            return BlogSidebar
        case 'dairy':
            // return TalkSidebar
            return DairySidebar
        case 'games':
            // return GamesSidebar
            return GamesSidebar
        case 'music':
            // return MusicSidebar
            return MusicSidebar
        default:
            return null
    }
})

</script>

<template>
    <aside class="app-sidebar" v-if="sidebarComponent">
        <component :is="sidebarComponent" />
    </aside>
</template>

<style scoped>
.app-sidebar {
    width: 300px;
    flex-shrink: 0;
    order: 1;
}

@media (max-width: 768px) {
    .app-sidebar {
        width: 100%;
    }
}
</style>