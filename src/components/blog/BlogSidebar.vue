<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useBlogStore } from '@/stores/blog'
import { getModuleMotto } from '@/config/mottos'

// 获取博客数据
const blogStore = useBlogStore()
const { categories, tags } = storeToRefs(blogStore)

// 获取博客模块座右铭
const motto = getModuleMotto('blog')

// 加载数据
onMounted(() => {
    blogStore.loadBlogPosts()
})
</script>

<template>
    <aside class="blog-sidebar">
        <!-- 个人信息卡片 -->
        <div class="sidebar-widget profile-card">
            <div class="avatar">
                <img src="https://api.dicebear.com/7.x/lorelei/svg?seed=SuiXin&backgroundColor=ffdf00" alt="avatar" />
            </div>
            <h3 class="nickname">SuiXin</h3>
            <p class="bio">{{ motto.motto }}</p>
            <p class="bio-en" v-if="motto.mottoEn">{{ motto.mottoEn }}</p>
        </div>

        <!-- 分类小部件 -->
        <div class="sidebar-widget category-widget">
            <h3 class="widget-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path
                        d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z" />
                </svg>
                分类
            </h3>
            <ul class="category-list" v-if="categories.length > 0">
                <li v-for="cat in categories" :key="cat.slug">
                    <a href="#" class="category-link">
                        <span class="category-name">{{ cat.name }}</span>
                        <span class="category-count">{{ cat.count }}</span>
                    </a>
                </li>
            </ul>
            <div v-else class="empty-hint">
                暂无分类
            </div>
        </div>

        <!-- 标签小部件 -->
        <div class="sidebar-widget tag-widget">
            <h3 class="widget-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path
                        d="M3 2v4.586l7 7L14.586 9l-7-7H3zM2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586V2z" />
                    <path
                        d="M5.5 5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm0 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM1 7.086a1 1 0 0 0 .293.707L8.75 15.25l-.043.043a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 0 7.586V3a1 1 0 0 1 1-1v5.086z" />
                </svg>
                标签
            </h3>
            <div class="tag-cloud" v-if="tags.length > 0">
                <a v-for="tag in tags" :key="tag.name" href="#" class="tag" :title="`${tag.count} 篇文章`">
                    {{ tag.name }}
                    <span class="tag-count">{{ tag.count }}</span>
                </a>
            </div>
            <div v-else class="empty-hint">
                暂无标签
            </div>
        </div>
    </aside>
</template>

<style scoped>
.blog-sidebar {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.sidebar-widget {
    background: #fff;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: box-shadow 0.3s ease;
}

.sidebar-widget:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.widget-title {
    font-size: 1.1rem;
    font-weight: 700;
    margin: 0 0 16px 0;
    padding-bottom: 12px;
    border-bottom: 2px solid #f0f0f0;
    display: flex;
    align-items: center;
    gap: 8px;
    color: #1a1a1a;
}

.widget-title svg {
    flex-shrink: 0;
    color: #667eea;
}

/* 个人信息卡片 */
.profile-card {
    text-align: center;
    padding: 32px 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
}

.avatar {
    width: 100px;
    height: 100px;
    margin: 0 auto 20px;
    border-radius: 50%;
    overflow: hidden;
    border: 4px solid rgba(255, 255, 255, 0.3);
    background: #fff;
}

.avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.nickname {
    font-size: 1.4rem;
    font-weight: 700;
    margin: 0 0 8px 0;
    color: #fff;
}

.bio {
    font-size: 0.95rem;
    margin: 0;
    color: rgba(255, 255, 255, 0.9);
}

.bio-en {
    font-size: 0.85rem;
    margin: 4px 0 0 0;
    color: rgba(255, 255, 255, 0.8);
    font-style: italic;
    font-weight: 300;
}

/* 分类列表 */
.category-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.category-list li {
    border-bottom: 1px solid #f0f0f0;
}

.category-list li:last-child {
    border-bottom: none;
}

.category-link {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    color: #333;
    text-decoration: none;
    transition: all 0.3s ease;
}

.category-link:hover {
    color: #667eea;
    transform: translateX(4px);
}

.category-name {
    font-size: 0.95rem;
    font-weight: 500;
}

.category-count {
    background: #f0f0f0;
    color: #666;
    font-size: 0.85rem;
    padding: 2px 8px;
    border-radius: 12px;
    transition: all 0.3s ease;
}

.category-link:hover .category-count {
    background: #667eea;
    color: #fff;
}

/* 标签云 */
.tag-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 8px 14px;
    background: #f5f5f5;
    border-radius: 20px;
    font-size: 0.85rem;
    color: #555;
    text-decoration: none;
    transition: all 0.3s ease;
    border: 1px solid transparent;
}

.tag:hover {
    background: #667eea;
    color: #fff;
    border-color: #667eea;
    transform: translateY(-2px);
}

.tag-count {
    font-size: 0.75rem;
    opacity: 0.6;
}

/* 空状态提示 */
.empty-hint {
    text-align: center;
    color: #999;
    font-size: 0.9rem;
    padding: 20px 0;
}

/* 响应式适配 */
@media (max-width: 768px) {
    .blog-sidebar {
        width: 100%;
    }

    .sidebar-widget {
        padding: 20px;
    }

    .profile-card {
        padding: 24px 20px;
    }
}
</style>