<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useBlogStore } from '@/stores/blog'
import BlogCard from './BlogCard.vue'

const blogStore = useBlogStore()
const { posts, loading, error, categories, tags } = storeToRefs(blogStore)
const { loadBlogPosts, filterByCategory } = blogStore

// 筛选状态
const selectedCategory = ref<string>('all')
const selectedTag = ref<string>('')

// 显示的文章列表
const displayedPosts = computed(() => {
    let result = posts.value

    if (selectedCategory.value !== 'all') {
        result = filterByCategory(selectedCategory.value)
    }

    if (selectedTag.value) {
        result = result.filter(post =>
            post.meta.tags.some(t => t === selectedTag.value)
        )
    }

    return result
})

// 选择分类
function selectCategory(category: string) {
    selectedCategory.value = category
    selectedTag.value = '' // 重置标签
}

// 选择标签
function selectTag(tag: string) {
    selectedTag.value = tag
}

// 加载文章
onMounted(() => {
    loadBlogPosts()
})
</script>

<template>
    <div class="blog-main">
        <!-- 筛选栏 -->
        <div class="filter-section">
            <div class="filter-group">
                <h3 class="filter-title">分类</h3>
                <div class="filter-buttons">
                    <button @click="selectCategory('all')" :class="[
                        'filter-btn',
                        selectedCategory === 'all' ? 'active' : ''
                    ]">
                        全部 <span class="count">({{ posts.length }})</span>
                    </button>
                    <button v-for="cat in categories" :key="cat.slug" @click="selectCategory(cat.slug)" :class="[
                        'filter-btn',
                        selectedCategory === cat.slug ? 'active' : ''
                    ]">
                        {{ cat.name }} <span class="count">({{ cat.count }})</span>
                    </button>
                </div>
            </div>

            <div class="filter-group" v-if="tags.length > 0">
                <h3 class="filter-title">标签</h3>
                <div class="filter-buttons tags">
                    <button @click="selectTag('')" :class="[
                        'filter-btn',
                        !selectedTag ? 'active' : ''
                    ]">
                        全部
                    </button>
                    <button v-for="tag in tags" :key="tag.name" @click="selectTag(tag.name)" :class="[
                        'filter-btn',
                        selectedTag === tag.name ? 'active' : ''
                    ]">
                        #{{ tag.name }} <span class="count">({{ tag.count }})</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" class="loading-state">
            <div class="spinner"></div>
            <p>加载中...</p>
        </div>

        <!-- 错误提示 -->
        <div v-else-if="error" class="error-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path
                    d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
            </svg>
            <p>{{ error }}</p>
        </div>

        <!-- 文章列表 -->
        <div v-else-if="displayedPosts.length > 0" class="posts-list">
            <BlogCard v-for="post in displayedPosts" :key="post.id" :post="post" />
        </div>

        <!-- 空状态 -->
        <div v-else class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path
                    d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
            </svg>
            <h3>暂无文章</h3>
            <p>该分类或标签下还没有文章</p>
        </div>
    </div>
</template>

<style scoped>
.blog-main {
    max-width: 900px;
    margin: 0 auto;
}

/* 筛选栏 */
.filter-section {
    background: #fff;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.filter-group {
    margin-bottom: 20px;
}

.filter-group:last-child {
    margin-bottom: 0;
}

.filter-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0 0 12px 0;
}

.filter-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.filter-buttons.tags {
    gap: 8px;
}

.filter-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 8px 16px;
    background: #f5f5f5;
    color: #555;
    border: 1px solid #e0e0e0;
    border-radius: 20px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.filter-btn:hover {
    background: #e8e8e8;
    border-color: #d0d0d0;
}

.filter-btn.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    border-color: transparent;
}

.count {
    font-size: 0.8rem;
    opacity: 0.7;
}

/* 加载状态 */
.loading-state {
    text-align: center;
    padding: 60px 20px;
    color: #666;
}

.spinner {
    width: 40px;
    height: 40px;
    margin: 0 auto 16px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

/* 错误状态 */
.error-state {
    text-align: center;
    padding: 60px 20px;
    color: #dc3545;
}

.error-state svg {
    color: #f8d7da;
    margin-bottom: 16px;
}

.error-state p {
    font-size: 1.1rem;
    margin: 0;
}

/* 文章列表 */
.posts-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

/* 空状态 */
.empty-state {
    text-align: center;
    padding: 60px 20px;
    color: #999;
}

.empty-state svg {
    color: #ddd;
    margin-bottom: 16px;
}

.empty-state h3 {
    font-size: 1.5rem;
    color: #333;
    margin: 0 0 8px 0;
}

.empty-state p {
    font-size: 1rem;
    margin: 0;
}

/* 响应式适配 */
@media (max-width: 768px) {
    .blog-main {
        padding: 0;
    }

    .filter-section {
        padding: 16px;
    }

    .filter-buttons {
        gap: 6px;
    }

    .filter-btn {
        padding: 6px 12px;
        font-size: 0.85rem;
    }
}
</style>